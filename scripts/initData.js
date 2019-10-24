import fetch from 'node-fetch';
import destinations from './data/destinations.json';
import next from './data/next.json';
import sights_json from './data/sights.json';
import countries from './data/countries.json';
import { ignore } from './data/ignore.js'
import redirects from './data/redirections.json';
import fs from 'fs';
import { nosightsnonext, unusedsights } from './stats';
import { getWikidata, getClaims,
    getThumbnail, getSummary,
    badthumbnail,
    getNearbyUntilHave,
    isInstanceOfIsland, isInstanceOfNationalPark,
    isInstanceOfSight, isInstanceOfCity } from './utils';

const SHOW_WARNINGS = true;
const pending = [];

const COUNTRY_PROPERTY = 'P17';

console.log('Remove bad data entries in go next');

function updateLatLn(place, key, project) {
    pending.push(
        getSummary(key, project).then((json) => {
            place.lat = json.lat;
            place.lon = json.lon;
        })
    );
}

function updateWikibase(place, project='wikivoyage') {
    if ( place.wb && !place.country ) {
        console.log(`${place.title} does not have a country associated. We can check its wikibase ${place.wb}.`)
        pending.push(
            getWikidata(place.wb, COUNTRY_PROPERTY).then((country) => {
                place.country = country;
                console.log(`set ${place.title} country to ${country}`);
                return Promise.resolve();
            })
        );
    } else if ( place.wb === undefined ) {
        console.log(`${place.title} lacking wikibase id.`)
        pending.push(
            getSummary(place.title, project).then((json) => {
                place.wb = json.wb || false;
                return Promise.resolve();
            }, () => {
                place.wb = false;
                return Promise.resolve();
            })
        )
    }
}

Object.keys(next).forEach((key) => {
    const newSet = Array.from(new Set(next[key].map((place) => typeof place === 'string' ? place : place[0])));
    if ( newSet.length !== next[key].length) {
        next[key] = newSet;
        pending.push(Promise.resolve());
        console.log(`Remove duplicates in go next for ${key}`);
    }
    const knownDestinations = newSet.filter((place) => destinations[place] !== undefined);
    const place = destinations[key];
    if (
        SHOW_WARNINGS &&
        place &&
        knownDestinations.length !== next[key].length &&
        knownDestinations.length === 0
    ) {
        if ( place.lat && place.country ) {
            console.warn(`\t${key} points to destination(s) that do not exist and has no known destinations.`);
            const country = countries[place.country];
            if ( !country.destinations ) {
                console.log(`Country ${place.country} has no destinations`);
            }
            // Look through country destinations
            // https://github.com/jdlrobson/somedayguide/issues/14
            getNearbyUntilHave(place.title, Object.keys(destinations), 3).forEach((title) => {
                console.log(`${place.title} is near ${title}`);
                next[place.title].push(title);
                pending.push(Promise.resolve());
            });
        } else if (!place.country) {
            console.warn(`\t${key} needs country.`);
        } else if (!place.lat) {
            console.warn(`\t${key} needs lat/lon.`);
            updateLatLn(place, key);
        }
    }
    if (
        knownDestinations.length === 0 &&
        SHOW_WARNINGS && destinations[key] === undefined
    ) {
        if ( !countries[key] && !sights_json[key] ) {
            console.warn(`\t${key} is not a known destination.`);
            destinations[key] = { title: key };
        }
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
    country.sights = country.sights.map((sight) => {
        return typeof sight === 'string' ? sight : sight.title
    } );
    country.sights.forEach((sight) => {
        if ( !sights_json[sight] ) {
            console.log(`${sight} is not known.`)
            sights_json[sight] = { title: sight };
            pending.push(Promise.resolve())
        }
    })
});

console.log('do not use SVGs for sights where possible.');
Object.keys(sights_json).forEach((sightName) => {
    const sight = sights_json[sightName];
    const thumbnail = sight.thumbnail;
    if (badthumbnail(thumbnail)) {
        pending.push(
            getThumbnail(sightName, sight.lastsync).then((thumbData) => {
                Object.assign(sights_json[sightName], thumbData);
            })
        )
    }
});

console.log('Checking go next is 2-way...');
Object.keys(destinations).forEach(( destinationTitle ) => {
    const place = destinations[destinationTitle];
    if ( destinationTitle.indexOf('_') > -1 || destinationTitle.indexOf('%') > -1) {
        console.log(`Replacing _ characters in name ${destinationTitle}`);
        let newTitle = destinationTitle.replace(/_/g, ' ');
        if ( newTitle.indexOf('%') ) {
            newTitle = decodeURIComponent(newTitle);
        }
        place.title = newTitle;
        destinations[newTitle] = place;
        delete destinations[destinationTitle];
        return;
    }
    if ( !place.sights ) {
        place.sights = [];
    }
    if ( place.country === undefined ) {
        updateWikibase(place);
    } else {
        if (place.country && !countries[place.country]) {
            if ( redirects[place.country] ) {
                place.country = redirects[place.country];
                pending.push(Promise.resolve());
            } else {
                console.log(`Unknown country ${place.country}`);
            }
        } else if ( place.country ) {
            if ( countries[place.country].destinations.indexOf(place.title) === -1 ) {
                console.log(`${place.country} doesn't list ${place.title}`);
                countries[place.country].destinations.push(place.title);
                pending.push(Promise.resolve());
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
    if ( !place.thumbnail ) {
        pending.push(
            getThumbnail(destinationTitle, place.lastsync).then((thumbData) => {
                Object.assign(destinations[destinationTitle], thumbData);
            })
        );
    }

    ( next[place.title] || [] ).forEach((nextTitle) => {
        next[nextTitle] = next[nextTitle] || [];
        if ( next[nextTitle].indexOf(place.title) === -1 && destinations[nextTitle]) {
            next[nextTitle].push(place.title);
            console.log(`Mark ${nextTitle} -> ${place.title} path.`);
            pending.push(Promise.resolve())
        }
    })
    const newSights = place.sights.filter((sight) =>
        sight && !(next[place.title] || []).includes(sight) &&
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

nosightsnonext
    .forEach((destinationTitle) => {
        const place = destinations[destinationTitle];
        if ( !place ) {
            // renamed during session
            return;
        } else if ( place.wbcountry ) {
            if ( countries[place.title] ) {
                console.log(`${place.title} is country`);
                delete destinations[place.title];
                pending.push(Promise.resolve());
            }
        } else if ( place.wbsight && place.country ) {
            // Fixes: https://github.com/jdlrobson/somedayguide/issues/10
            console.log(`Repurpose ${destinationTitle} as sight on ${place.country}`);
            delete place.wbsight;
            sights_json[destinationTitle] = place;
            delete destinations[destinationTitle];
            countries[place.country].sights.push(place.title);
            pending.push(Promise.resolve());
        } else if ( place.wb === undefined ) {
            console.log(`Destination ${destinationTitle} lacking wikibase id.`)
            pending.push(
                getSummary(place.title, 'wikivoyage').then((json) => {
                    place.wb = json.wb || false;
                }, () => {
                    place.wb = false;
                })
            );
        } else if (
            place.wbsight === undefined &&
            place.wbcity === undefined &&
            place.wbisland === undefined &&
            place.wbcountry === undefined &&
            place.wbnp === undefined
        ) {
            pending.push(
                getClaims(place.wb, 'P31').then((claims)=> {
                    if ( claims.includes('Q6256') ) {
                        console.log(`${place.title} is a country.`);
                        place.wbcountry = true;
                    } else if ( isInstanceOfSight(claims) ) {
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
                       console.log('Unknown claims for destination', place.title, place.wb, claims);
                    }
                })
            );
        } else {
            console.log(`Destination ${destinationTitle} has a problem`);
        }
    })

nosightsnonext.map((title)=>destinations[title] || {}).filter((place) =>
    place.wbcity || place.wbnp || place.wbisland).forEach((place) => {
    if ( !place.lat ) {
        console.log(`No have lat: ${place.title}`)
        updateLatLn(place, place.title, 'wikivoyage');
    } else {
        console.log(`Find places nearby to ${place.title}, ${place.lat},${place.lon}`)
        const nearby = getNearbyUntilHave(place.title, Object.keys(destinations), 3);
        if ( nearby.length ) {
            console.log( `${place.title} is nearby: ${nearby.join(',')}`);
            next[place.title] = nearby;
            pending.push(Promise.resolve());
        }
    }
});

// update any unused sights by associating it with a country
unusedsights.forEach((title) => {
    const sight = sights_json[title];
    updateWikibase(sight, 'wikipedia');
    if ( sight.country ) {
        const country = countries[sight.country];
        // guaranteed to be unique as an unused sight
        if ( country ) {
            country.sights = country.sights || [];
            country.sights.push(title);
            pending.push(Promise.resolve());
        } else {
            if ( redirects[sight.country] ) {
                console.log(`Rename sight.country ${sight.country}`);
                sight.country = redirects[sight.country];
                pending.push(Promise.resolve());
            } else {
                console.log(`Country for ${title} is ${sight.country}`);
            }
        }
    }
});

if ( pending.length ) {
    Promise.all( pending ).then(() => {
        console.log('Updating JSON');
        fs.writeFileSync(`${__dirname}/data/sights.json`, JSON.stringify(sights_json));
        fs.writeFileSync(`${__dirname}/data/countries.json`, JSON.stringify(countries));
        fs.writeFileSync(`${__dirname}/data/destinations.json`, JSON.stringify(destinations));
        fs.writeFileSync(`${__dirname}/data/next.json`, JSON.stringify(next));
    });
} else {
    console.log( 'No changes necessary.' );
}
