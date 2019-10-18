import fetch from 'node-fetch';
import destinations from './data/destinations.json';
import next from './data/next.json';
import sights_json from './data/sights.json';
import countries from './data/countries.json';
import { ignore } from './data/ignore.js'
import redirects from './data/redirections.json';
import fs from 'fs';
import { nosightsnonext } from './stats';
import { getWikidata, getClaims, getClaimValue,
    isInstanceOfIsland, isInstanceOfNationalPark,
    isInstanceOfSight, isInstanceOfCity } from './utils';

const SHOW_WARNINGS = true;
const pending = [];
const CHECK_THUMBNAILS = false;

const COUNTRY_PROPERTY = 'P17';

function getThumbnail(title) {
    return CHECK_THUMBNAILS ? fetch(`https://en.wikipedia.org/api/rest_v1/page/media/${encodeURIComponent(title)}`)
        .then((resp) => resp.json())
        .then((json) => {
            const thumb = json.items.map((item) => {
                return {
                    thumbnail: item.thumbnail && item.thumbnail.source,
                    thumbnail__source: item.titles && item.titles.canonical
                };
            }).filter((item) => item.thumbnail && item.thumbnail.indexOf('svg') === -1)[0] || {};
            console.log(`Updating SVG thumbnail for ${title}`);
            return thumb;
        })
        .catch((err) => {
            console.log(`${err} while trying to get ${title}`)
            return Promise.resolve();
        }) : Promise.resolve();
}
function getSummary(title, project='wikipedia') {
    return fetch(`https://en.${project}.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)
        .then((resp) => resp.json())
        .then((json) => {
            return {
                title,
                wb: json.wikibase_item,
                description: json.description,
                thumbnail: json.thumbnail && json.thumbnail.source,
                thumbnail__source: json.originalimage && json.originalimage.source.split('/').slice(-1)[0],
                summary: json.extract
            };
        })
        .catch((err) => {
            console.log(`${err} while trying to get ${title}`)
            return Promise.resolve();
        })
}

console.log('Remove bad data entries in go next');
Object.keys(next).forEach((key) => {
    const newSet = Array.from(new Set(next[key].map((place) => typeof place === 'string' ? place : place[0])));
    if ( newSet.length !== next[key].length) {
        next[key] = newSet;
        pending.push(Promise.resolve());
        console.log(`Remove duplicates in go next for ${key}`);
    } else if (
        SHOW_WARNINGS &&
        newSet.filter((place) => destinations[place] !== undefined).length !== next[key].length
    ) {
        console.warn(`\t${key} points to destination(s) that do not exist: Compare ${next[key].join(',')} with ${newSet.join(',')}`);
    }
    if ( SHOW_WARNINGS && destinations[key] === undefined) {
        console.warn(`\t${key} is not a destination.`);
        delete next[key];
        pending.push(Promise.resolve());
    }
});

console.log('Checking countries');
Object.keys(countries).forEach((countryName) => {
    const country = countries[countryName];
    const newSights = country.sights.filter((sight) => !countries[sight]);
    if ( newSights.length !== country.sights.length ) {
        console.log(`Country ${countryName} listed another country as a sight.`);
        countries[countryName].sights = newSights;
        pending.push(Promise.resolve())
    }
    const destinationSet = new Set(country.destinations);
    if(destinationSet.size !== country.destinations.length) {
        console.log(`Removed duplicate destinations in ${countryName}`);
        country.destinations = Array.from(destinationSet);
        pending.push(Promise.resolve())
    }
});

console.log('do not use SVGs for sights where possible.');
Object.keys(sights_json).forEach((sightName) => {
    const thumbnail = sights_json[sightName].thumbnail;
    if ( thumbnail && thumbnail.indexOf('.svg') > -1 ) {
        pending.push(
            getThumbnail(sightName).then((thumbData) => {
                Object.assign(sights_json[sightName], thumbData);
            })
        )
    }
});

console.log('Checking go next is 2-way...');
Object.keys(destinations).forEach(( destinationTitle ) => {
    const place = destinations[destinationTitle];
    if ( !place.sights ) {
        place.sights = [];
    }
    if ( place.country === undefined ) {
        if ( place.wb ) {
            console.log(`${destinationTitle} does not have a country associated. We can check its wikibase ${place.wb}.`)
            pending.push(
                getWikidata(place.wb, COUNTRY_PROPERTY).then((country) => {
                    place.country = country;
                    console.log('set', country);
                })
            );
        } else if ( place.wb !== undefined ) {
            console.log(`Destination ${destinationTitle} lacking wikibase id.`)
            pending.push(
                getSummary(place.title, 'wikivoyage').then((json) => {
                    place.wb = json.wb;
                }, () => {
                    place.wb = false;
                })
            )
        }
    } else {
        if (place.country && !countries[place.country]) {
            if ( redirects[place.country] ) {
                place.country = redirects[place.country];
                pending.push(Promise.resolve());
            } else {
                console.log(`Unknown country ${place.country}`);
            }
        }
    }
    // https://github.com/jdlrobson/somedayguide/issues/1
    if ( place.summary && place.summary.indexOf('.mw-parser-output') > -1 ) {
        console.log(`Bad description in ${place.title}`);
        pending.push(
            getSummary(place.title, 'wikivoyage').then((json) => {
                place.summary = json.summary;
            })
        );
    }
    if ( place.thumbnail && place.thumbnail.indexOf('.svg') > -1 ) {
        console.log(`SVG thumbnail for ${place.title}`);
    }
    ( next[place.title] || [] ).forEach((nextTitle) => {
        next[nextTitle] = next[nextTitle] || [];
        if ( next[nextTitle].indexOf(place.title) === -1) {
            next[nextTitle].push(place.title);
            console.log(`Mark ${nextTitle} -> ${place.title} path.`);
            pending.push(Promise.resolve())
        }
    })
    const newSights = place.sights.filter((sight) =>
        !(next[place.title] || []).includes(sight) &&
        (!countries[sight])
    );
    if ( newSights.length !== place.sights.length) {
        console.log(`Removed sight that is go next/country in ${place.title}`);
        destinations[destinationTitle].sights = newSights;
        pending.push(Promise.resolve())
    }

    // any sights that are actually destinations?
    const sightsNotCities = [];
    newSights.forEach((sight) => {
        sight = redirects[sight] || sight;

        if (destinations[sight]) {
            console.log(`${sight} is actually a city`)
            if ( !next[destinationTitle] ) {
                next[destinationTitle] = [];
            }
            next[destinationTitle].push(sight);
            pending.push(Promise.resolve())
        } else {
            if (!ignore.includes(sight)) {
                if ( !sights_json[sight] ) {
                    console.log(`No sight entry for ${sight}`)
                    pending.push(
                        getSummary(sight)
                            .then((json) => {
                                console.log('Add', sight);
                                sights_json[sight] = json;
                            })
                    )
                }
                sightsNotCities.push(sight);
            }
        }
    });
    if (sightsNotCities.length !== place.sights.length) {
        place.sights = sightsNotCities;
        console.log(`${destinationTitle} has sights that are actually destinations.`);
        pending.push(Promise.resolve())
    }

    // Make sure sights are array of strings
    if (newSights.length > 0 && typeof newSights[0] !== 'string') {
        destinations[destinationTitle].sights = newSights.map((sight) => sight.title);
        console.log(`Sights for ${destinationTitle} should be list of strings`);
        pending.push(Promise.resolve());
    }
});

nosightsnonext.filter((c)=>c.indexOf('city') === -1 && c.indexOf('(') === -1)
    .forEach((destinationTitle) => {
        const place = destinations[destinationTitle];
        if ( place.wbsight ) {
            // todo: check the location.. is it near any of the destinations?
        } else if ( place.wb === undefined ) {
            console.log(`Destination ${destinationTitle} lacking wikibase id.`)
            pending.push(
                getSummary(place.title, 'wikivoyage').then((json) => {
                    place.wb = json.wb;
                }, () => {
                    place.wb = false;
                })
            )
        } else if (
            place.wbsight === undefined &&
            place.wbcity === undefined &&
            place.wbisland === undefined &&
            place.wbnp === undefined
        ) {
            pending.push(
                getClaims(place.wb, 'P31').then((claims)=> {
                    if ( isInstanceOfSight(claims) ) {
                        // it's a sight..
                        console.log(`${destinationTitle} (${place.wb}) is actually sight.`);
                        place.wbsight = true;
                    } else if (
                        isInstanceOfCity(claims)
                     ) {
                        console.log(`Place ${destinationTitle} confirmed as city.`);
                        place.wbcity = true;
                    } else if (
                        isInstanceOfIsland(claims)
                    ) {
                        console.log(`Place ${destinationTitle} confirmed as island.`);
                        place.wbisland = true;
                    } else if (
                        isInstanceOfNationalPark(claims)
                    ) {
                        console.log(`Place ${destinationTitle} confirmed as national park.`);
                        place.wbnp = true;
                    } else {
                       console.log('Unknown claims', place.wb, claims);
                    }
                })
            );
        }
    })

if ( pending.length ) {
    console.log('Updating JSON');
    Promise.all( pending ).then(() => {
        fs.writeFileSync(`${__dirname}/data/sights.json`, JSON.stringify(sights_json));
        fs.writeFileSync(`${__dirname}/data/countries.json`, JSON.stringify(countries));
        fs.writeFileSync(`${__dirname}/data/destinations.json`, JSON.stringify(destinations));
        fs.writeFileSync(`${__dirname}/data/next.json`, JSON.stringify(next));
    });
} else {
    console.log( 'No changes necessary.' );
}
