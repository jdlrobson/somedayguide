import destinations from './data/destinations.json';
import next from './data/next.json';
import sights_json from './data/sights.json';
import countries from './data/countries.json';
import countrywb from './data/countrywb.json';
import { ignore } from './data/ignore.js'
import redirects from './data/redirections.json';
import fs from 'fs';
import { nosightsnonext } from './stats';
import { getAllClaims, getGithubWikiData,
    getThumbnail, getSummary, listwithout,
    badthumbnail, getClaimValue,
    getNearbyUntilHave, calculateDistance,
    isInstanceOfIsland, isInstanceOfNationalPark,
    isInstanceOfSight, isInstanceOfCity } from './utils';

const SHOW_WARNINGS = true;
const pending = [];

const COUNTRY_PROPERTY = 'P17';
const MAX_NEARBY_DISTANCE = 500;

function updatefields(place, key, project) {
    pending.push(
        getSummary(key, project).then((json) => {
            Object.assign(place, json);
        }, () => {
            place.wb = false;
            return Promise.resolve();
        })
    );
}

function belongsToCountry(obj, countryName) {
    const objCountryName = obj.country;
    return objCountryName === undefined || objCountryName === false || objCountryName === countryName;
}

function resolvecountry(country) {
    if(country !== false && !countries[country]) {
        if ( redirects[country] ) {
            return redirects[country];
        } else {
            throw new Error(`Unknown country ${country}`);
        }
    } else {
        return country;
    }
}

function updatewbfields(obj, claims) {
    obj.claims = Object.keys(claims).length;
    if ( claims.includes('Q6256') ) {
        console.log(`${obj.title} is a country.`);
        obj.wbcountry = true;
    } else if ( isInstanceOfSight(claims) ) {
        // it's a sight..
        console.log(`${obj.title} (${obj.wb}) is actually sight.`);
        obj.wbsight = true;
    } else if (
        isInstanceOfCity(claims)
     ) {
        console.log(`Place ${obj.title} confirmed as city.`);
        obj.wbcity = true;
    } else if (
        isInstanceOfIsland(claims)
    ) {
        console.log(`Place ${obj.title} confirmed as island.`);
        obj.wbisland = true;
    } else if (
        isInstanceOfNationalPark(claims)
    ) {
        console.log(`Place ${obj.title} confirmed as national park.`);
        obj.wbnp = true;
    } else {
       console.log('Unknown claims for destination/sight', obj.title, obj.wb, claims);
    }
}
function updatecountry(obj) {
    return getAllClaims(obj.wb).then((claims) => {
        const countrywbid = claims[COUNTRY_PROPERTY];
        updatewbfields(obj, claims);
        if (countrywb[countrywbid]) {
            return countrywb[countrywbid];
        } else if (countrywbid && countrywbid.length === 1) {
            return getClaimValue(countrywbid[0]).then((country) => {
                countrywb[countrywbid] = country;
                return country;
            }).then((country) => {
                try {
                    return resolvecountry(country);
                } catch(e) {
                    console.log(`Unknown country ${country}. Please add to redirects.json for ${obj.wb}`);
                }
            })
        }
    }).then((country) => {
        obj.country = country;
        console.log(`set ${obj.title} (${obj.wb}) country to ${country}. Update wikidata entry then run "rm scripts/data/claims/${obj.wb}.json"`);
        return Promise.resolve();
    })
}

function updateWikibase(place, project='wikivoyage') {
    if ( place.wb && place.country === undefined && !place.nocountry && !place.multicountry ) {
        console.log(`${place.title} does not have a country associated. We can check its wikibase ${place.wb}.`)
        pending.push(
            updatecountry(place)
        );
    } else if ( place.wb === undefined ) {
        console.log(`${place.title} lacking wikibase id.`)
        pending.push(
            updatefields(place, place.title, project)
        )
    }
}

Object.keys(next).forEach((key) => {
    const newSet = Array.from(
        new Set(next[key].map((place) => typeof place === 'string' ? place : place[0]))
    ).filter((toName) => {
        const to = destinations[toName] || {};
        // https://github.com/jdlrobson/somedayguide/issues/8
        const d = calculateDistance(destinations[key], to);
        return key !== toName && ( to.remote || d === -1 || d < MAX_NEARBY_DISTANCE );
    });
    const knownDestinations = newSet.filter((place) => destinations[place] !== undefined);
    const place = destinations[key];
    if ( place && !place.remote && newSet.length !== next[key].length) {
        next[key] = newSet;
        pending.push(Promise.resolve());
        console.log(`Remove duplicates and far away places in go next for ${key}`);
    }
    if (
        SHOW_WARNINGS &&
        place &&
        knownDestinations.length !== next[key].length &&
        knownDestinations.length === 0
    ) {
        if ( place.lat && place.country && !place.remote ) {
            console.warn(`\t${key} points to destination(s) that do not exist and has no known destinations.`);
            const country = countries[place.country];
            if ( !country.destinations ) {
                console.log(`Country ${place.country} has no destinations`);
            }
            // Look through country destinations
            // https://github.com/jdlrobson/somedayguide/issues/14
            const nearby = getNearbyUntilHave(place.title, Object.keys(destinations), 3, 160, MAX_NEARBY_DISTANCE);
            nearby.forEach((title) => {
                console.log(`${place.title} is near ${title}`);
                next[place.title].push(title);
                pending.push(Promise.resolve());
            });
            if ( !nearby.length ) {
                const nearbyRemote = getNearbyUntilHave(place.title, Object.keys(destinations), 3);
                if (nearbyRemote.length ) {
                    console.log(`${place.title} appears to be a remote destination.`)
                    place.remote = true;
                    place.remote = true;
                    next[place.title] = nearbyRemote;
                    pending.push(Promise.resolve());
                }
            }
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
    if (sight.country && countries[sight.country]) {
        const country = countries[sight.country];
        const countrySights = countries[sight.country].sights || [];
        if ( country && !countrySights.includes(sightName) && sight.title !== sight.country) {
            country.sights = countrySights;
            console.log(`Push ${sight.title} to ${sight.country}`)
            country.sights.push(sightName);
            pending.push(Promise.resolve());
        } else {
            if ( redirects[sight.country] ) {
                console.log(`Rename sight.country ${sight.country}`);
                sight.country = redirects[sight.country];
                pending.push(Promise.resolve());
            }
        }
    }
    // update any unused sights by associating it with a country
    updateWikibase(sight, 'wikipedia');
    if (!sight.lat && !sight.nolat) {
        console.log(`Update lat/lon for sight ${sightName}`)
        updatefields(sight, sight.title, 'wikipedia');
    }

    // #17
    if (destinations[sightName]) {
        console.log( `${sightName} is a sight and a destination/country` );
    }
});

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
    // https://github.com/jdlrobson/somedayguide/issues/1 #25
    if ( !place.summary || place.summary.indexOf('.mw-parser-output') > -1 ) {
        console.log(`Bad description in ${place.title}`);
        pending.push(
            updatefields(place, place.title, 'wikivoyage')
        );
    }
    if ( !place.thumbnail ) {
        pending.push(
            getThumbnail(destinationTitle, place.lastsync).then((thumbData) => {
                if ( destinations[destinationTitle] ) {
                    Object.assign(destinations[destinationTitle], thumbData);
                }
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
    const newSights = Array.from(
        new Set(
            place.sights.filter((sight) =>
                sight && !(next[place.title] || []).includes(sight) &&
                (!countries[sight])
            )
        )
    );
    if ( newSights.length !== place.sights.length) {
        console.log(`Removed sight that is go next/country/duplicate in ${place.title}`);
        console.log(newSights, place.sights, next[place.title]);
        next[place.title] = next[place.title].filter((s) => !place.sights.includes(s));
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
            console.log(`${sight} is in destinations object.`);
        } else {
            if (!ignore.includes(sight)) {
                if ( !sights_json[sight] ) {
                    console.log(`No sight entry for ${sight}`)
                    pending.push(
                        getSummary(sight)
                            .then((json) => {
                                console.log('Add', sight, 'from', destinationTitle);
                                sights_json[sight] = json;
                            })
                    )
                }
                sightsNotCities.push(sight);
            } else {
                console.log(`${sight} is in ignore list`);
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

    if ( place.wbcountry ) {
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
    } else if ( place.wb === undefined && !place.country ) {
        console.log(`Destination ${destinationTitle} lacking wikibase id.`)
        pending.push(
            updatefields(place, place.title, 'wikivoyage')
        );
    } else if ( !place.lat && !place.nolat ) {
        console.log(`No have lat for destination: ${place.title}`)
        updatefields(place, place.title, 'wikivoyage');
    }
});

nosightsnonext.map((title)=>destinations[title] || {}).filter((place) =>
    place.wbcity || place.wbnp || place.wbisland).forEach((place) => {
    if ( place.lat ) {
        const nearby = getNearbyUntilHave(place.title, Object.keys(destinations), 3, 160, MAX_NEARBY_DISTANCE);
        next[place.title] = next[place.title] || [];
        if (nearby.length && nearby.length !== next[place.title].length) {
            console.log( `${place.title} is nearby: ${nearby.join(',')}`);
            next[place.title] = nearby;
            pending.push(Promise.resolve());
        }
    }
});

// make sure country sights are allocated to cities (#12)
Object.keys(countries).forEach((countryName) => {
    const country = countries[countryName];
    const wikicountry = getGithubWikiData(countryName, {});
    const wikisights = wikicountry.sights.filter((s) => !country.sights.includes(s));

    // Fixes: #19
    wikisights.forEach((s) => {
        console.log(`Push sight ${s} from wiki to ${countryName}`);
        country.sights.push(s);
        sights_json[s] = { title: s };
    });
    if ( !country.summary || country.summary.indexOf('.mw-parser-output') > -1 ) {
        console.log(`Bad description in ${country.title}`);
        pending.push(
            updatefields(country, country.title, 'wikivoyage')
        );
    }

    country.sights.forEach((sightName) => {
        let mindistance;
        const sight = sights_json[sightName];
        if ( sight.lat && !sight.nolat ) {
            country.destinations.forEach((destName) => {
                const dest = destinations[destName];
                const distance = calculateDistance(dest, sight);
                if ( distance > 0 && ( mindistance === undefined || distance < mindistance ) ) {
                    mindistance = distance;
                }
                if ( distance > 0 && distance < 150 && !dest.sights.includes(sightName)) {
                    console.log(`${destName} is near ${sightName} ${distance}`);
                    dest.sights.push(sightName);
                    pending.push(Promise.resolve());
                }
                // push sight back to country
                ((dest && dest.sights) || []).forEach((sightName) => {
                    if (!country.sights.includes(sightName)) {
                        const sight = sights_json[sightName];
                        // https://github.com/jdlrobson/somedayguide/issues/15
                        const distance = calculateDistance(dest, sight);
                        if (distance > 0 && distance < 20 && belongsToCountry(sight, countryName)) {
                            // #9
                            console.log(`Pushing ${sightName} to ${country.title}`);
                            country.sights.push(sightName);
                        }
                    }
                })
            });

            // Avoid sights being allocated to wrong country
            if ( mindistance && mindistance > 2000 && sight.nolat === undefined && !sight.remote) {
                console.log(`Hmm... the sight ${sightName} is far from all places inside ${countryName} (${mindistance}) and has been removed.`)
                country.sights = listwithout(country.sights, sight.title);
                pending.push(Promise.resolve());
            }
        }
    });
    const newSights = Array.from(
        // #26
        new Set(
            country.sights.filter((sight) => !countries[sight] &&
                // https://github.com/jdlrobson/somedayguide/issues/15
                belongsToCountry(sights_json[sight], countryName)
            )
        )
    );
    if ( newSights.length !== country.sights.length ) {
        console.log(`Country ${countryName} listed another country as a sight, or repeated a sight,
            or listed a sight that belongs to another country.`);
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
    });
    country.destinations = country.destinations.filter((destination) => !sights_json[destination])
});

if ( pending.length ) {
    Promise.all( pending ).then(() => {
        console.log('Updating JSON');
        fs.writeFileSync(`${__dirname}/data/sights.json`, JSON.stringify(sights_json));
        fs.writeFileSync(`${__dirname}/data/countries.json`, JSON.stringify(countries));
        fs.writeFileSync(`${__dirname}/data/destinations.json`, JSON.stringify(destinations));
        fs.writeFileSync(`${__dirname}/data/next.json`, JSON.stringify(next));
        fs.writeFileSync(`${__dirname}/data/countrywb.json`, JSON.stringify(countrywb));
    });
} else {
    console.log( 'No changes necessary.' );
}
