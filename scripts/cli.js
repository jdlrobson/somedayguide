import util from 'util';
import countries from './data/countries.json';
import destinations from './data/destinations.json';
import redirects from './data/redirections.json';
import sights from './data/sights.json';
import next from './data/next.json';
import fetch from 'node-fetch';
import domino from 'domino';
import fs from 'fs';
import { lacking_gonext } from './stats';
import { listwithout, getSummary, findClimate, findSights, getNearby,
    getNearbyUntilHave } from './utils';

global.fetch = fetch;
global.document = domino.createWindow().document;

function save() {
    fs.writeFileSync(`${__dirname}/data/redirections.json`, JSON.stringify(redirects));
    fs.writeFileSync(`${__dirname}/data/countries.json`, JSON.stringify(countries));
    fs.writeFileSync(`${__dirname}/data/destinations.json`, JSON.stringify(destinations));
    fs.writeFileSync(`${__dirname}/data/next.json`, JSON.stringify(next));
    fs.writeFileSync(`${__dirname}/data/sights.json`, JSON.stringify(sights));
}

function feedback( msg ) {
    console.log( msg );
}

function getUserInput( msg, clean = true ) {
    return new Promise( ( resolve, reject ) => {
            feedback( msg, true );
            process.stdin.setEncoding('utf8');
            process.stdin.once('data', function (text) {
                    resolve(
                        clean ? util.inspect(text).replace(/\"/g, '').replace(/_/g, ' ')
                            .replace( /'([^\n]*)'/g, '$1' ).replace( '\\n', '' )
                        : text
                     );
            });
    })
}

function updatesummary(title, obj) {
    return getSummary(title).then((json) => {
        if ( json.thumbnail ) {
            obj.thumbnail = json.thumbnail;
            obj.thumbnail__source = json.thumbnail__source;
            save();
        }
        return menu();
    });
}
function gonext() {
    function nextplace( title ) {
        return getUserInput('Where can I go next?').then(( gonext ) => {
            if ( !gonext ) {
                return menu();
            }
            next[title] = next[title] || [];
            if ( next[title].filter((p) => p.title === gonext).length ) {
                feedback('Already got that one.');
            } else {
                feedback(`Pushed "${gonext}" to "${title}"`);
                next[title].push( gonext );
            }
            save();
            return nextplace(title);
        });
    }
    return getUserInput('Which place does the journey begin?').then(( title ) => {
        return nextplace(title);
    });
}

function addtocountry(country) {
    return getUserInput('Which destination?').then(( dest ) => {
        if ( !dest) {
            return menu();
        }
        if ( country.destinations.filter((d) => d === dest).length === 0 ) {
            console.log(`Pushed ${dest} to ${country.title}`);
            country.destinations.push(dest);
        }
        save();
        return addtocountry(country);
    });
}

function addadestination() {
    getUserInput('Which country?').then(( title ) => {
        const country = countries[title];
        if ( country ) {
            addtocountry(country);
        } else {
            return menu();
        }
    });
}

function addClimateTo(to) {
    // try wikivoyage first...
    return findClimate(destinations[to], ['en'], 'wikivoyage').then((r) => {
        if (r) {
            save();
            return menu();
        } else {
            return findClimate(destinations[to]).then((result) => {
                if ( result ) {
                    console.log(`Found and updated climate for ${to}`);
                    save();
                } else {
                    console.log('Could not find climate data.');
                }
                return menu();
            });
        }
    })
}

function addSightsTo(title) {
    return findSights(title).then((suggestedsights) => {
        if ( suggestedsights.length ) {
            const existingSights = destinations[title].sights;
            destinations[title].sights = Array.from(new Set(existingSights.concat(suggestedsights)));
            console.log(`Found and updated sights for ${title}`);
            suggestedsights.forEach((s) => {
                if (!sights[s]) {
                    sights[s] = { title: s };
                }
            })
            save();
        } else {
            console.log('Could not find sights data.');
        }
        return menu();
    });
}

function removeDestination() {
    getUserInput('Which country?').then(( title ) => {
        const country = countries[title];
        if ( country ) {
            return getUserInput('Which destination?').then(( dest ) => {
                country.destinations = country.destinations.filter((d) => d !== dest);
                if ( destinations[dest] ) {
                    destinations[dest].country = undefined;
                }
                console.log(country.title, '\n', country.destinations.join(','))
                save();
                return removeDestination();
            });
        } else {
            return menu();
        }
    });
}

function deleteplace(title) {
    const dest = destinations[title];
    if ( !dest ) {
        console.log(`Unknown place ${title}`);
    } else if ( dest.country ) {
        console.log(`Remove ${title} from ${dest.country} destinations`);
        countries[dest.country].destinations = listwithout(countries[dest.country].destinations, title)
    }
    delete destinations[title];
    if ( next[title] ) {
        console.log(`Delete ${title} from next`)
        next[title].forEach((to) => {
            console.log(`Remove link from ${title} to ${to}`);
            next[to] = listwithout(next[to], title);
        });
        delete next[title];
    }
}

function destinationwithsight(sight) {
    return Object.keys(destinations).filter((key) => {
        if (!destinations[key].sights) {
            return false;
        } else if (destinations[key].sights.indexOf(sight) > -1) {
            return true;
        }
    });
}

function removesightfromdestination(destination, sight) {
    console.log(`Remove reference to ${sight} in ${destination}`);
    destinations[destination].sights = listwithout(destinations[destination].sights, sight);
}

function removesight(sight) {
    if ( !sights[sight] ) {
        console.log(`Unknown sight ${sight}`);
    } else {
        console.log(`Removed ${sight} from sights.json.`)
    }
    destinationwithsight(sight).forEach((key) => removesightfromdestination(key, sight));
    delete sights[sight];
}

function removesights() {
    return getUserInput('Which sight or place?').then(( sightOrPlace ) => {
        if (destinations[sightOrPlace]) {
            return getUserInput('Which sight').then(( sight) => {
                removesightfromdestination(sightOrPlace, sight);
                save();
                return menu();
            });
        } else if ( sightOrPlace ) {
            removesight(sightOrPlace);
            save();
            return removesights();
        } else {
            return menu();
        }
    });
}

function renameplace() {
    return getUserInput('Which place?').then(( original ) => {
        return getUserInput('Rename to what?').then(( newName ) => {
            if ( destinations[original] ) {
                console.log(`Reassign ${original} to ${newName}`);
                destinations[newName] = Object.assign({}, destinations[original], { title: newName });
                delete destinations[original];
            }
        });
    } ).then(() => {
        save();
        return menu();
    })
}

function addredirect() {
    return getUserInput('From?').then(( from ) => {
        if (from) {
            return getUserInput('To?').then(( to ) => {
                if (to) {
                    redirects[from] = to;
                    save();
                    return addredirect();
                } else {
                    return menu();
                }
            });
        } else {
            return menu();
        }
    });
}

function addNearby(title) {
    const remote = destinations[title].remote;
    const candidates = Object.keys(destinations);
    const near = remote ? getNearbyUntilHave(title, candidates, 5) :
        getNearby(title, candidates, 100);
    console.log('Found', near, remote);
    next[title] = Array.from(new Set((next[title] || []).concat(near)));
}

function addSight() {
    function addSightTo(place) {
        return getUserInput('Which sight (provide wikibase id)?').then(( sight ) => {
            if ( !sight ) {
                save();
                return menu();
            }
            place.sights = place.sights || [];
            if ( place.sights.filter((p) => p === sight).length ) {
                feedback('Already got that one.');
            } else {
                feedback(`Pushed "${sight}" to "${place.title}"`);
                place.sights.push(sight);
                sights[sight] = { title: sight };
            }
            return addSightTo(place);
        });
    }
    return getUserInput('Which place?').then(( title ) => {
        const place = destinations[title] || countries[title];
        if ( place ) {
            return addSightTo(place);
        } else {
            console.log(`Cannot find ${title}`);
            return menu();
        }
    });
}

function updatefieldvalue(obj) {
    return getUserInput('Which field?').then(( field ) => {
        if ( !field ) {
            return menu();
        }
        return getUserInput('Which value?').then(( value ) => {
            obj[field] = value;
            save();
            return updatefieldvalue(obj);
        } );
    } );
}

function menu() {
    const options = [
            '1: View place/country',
            '1A: Add place',
            '1B: Delete place',
            '1C: Rename place',
            '1D: Add climate data to place',
            '1E: Add sights to place',
            '2: View sight',
            '2A: Add sight',
            '2B: Remove sight',
            '3B: Remove country',
            '3C: Add country destination',
            '3D: Remove country destination',
            '4: Go next',
            '4A: Add go next',
            '4B: Remove go next',
            '4C: Find go next',
            '5A: Add redirect',
            '6A: Set field',
            '6B: Set image',
            '7A: Set field on sight',
            '8: Refresh summary'
    ];
    getUserInput( '\n\n\n**********************\n' + options.join('\n') + '\n**********************' )
        .then( ( val ) => {
            switch ( val ) {
                case '1':
                    return getUserInput('Which place or country?').then(( title ) => {
                        const d = countries[title] || destinations[title] || {};
                        Object.keys(d).forEach((key) => {
                            console.log(`${key}: ${JSON.stringify(d[key])}`)
                        });
                        return menu();
                    } );
                case '1A':
                    getUserInput('Which place?').then(( title ) => {
                        if ( destinations[title] ) {
                            feedback('Already got that one.');
                        } else if ( title ) {
                            feedback(`Pushed "${title}"`);
                            destinations[title] = { title, sights: [] };
                            save();
                            addNearby(title);
                            save();
                            return addClimateTo(title);
                        }
                        return menu();
                    })
                    break;
                case '1B':
                    getUserInput('Which place?').then(( title ) => {
                        deleteplace(title);
                        save();
                        return menu();
                    })
                    break;
                case '1C':
                    return renameplace();
                case '1D':
                    return getUserInput('Which place?').then(( title ) => {
                        return addClimateTo(title);
                    })
                case '1E':
                    return getUserInput('Which place?').then(( title ) => {
                        return addSightsTo(title);
                    })
                case '2':
                    return getUserInput('Which sight (wikibase id)?').then(( title ) => {
                        const s = sights[title] || {};
                        Object.keys(s).forEach((key) => {
                            console.log(`${key}: ${s[key]}`)
                        });
                        return menu();
                    } );
                case '2A':
                    return addSight();
                    break;
                case '2B':
                    return removesights();
                case '3B':
                    return getUserInput('Which country to REMOVE?').then(( title ) => {
                        delete countries[title];
                        save();
                        return menu();
                    } );
                case '3C':
                    return addadestination();
                case '3D':
                    return removeDestination();
                case '4':
                    getUserInput('Which place does the journey begin?').then(( title ) => {
                        console.log(
                            (next[title] || []).join('\n')
                        );
                        return menu();
                    });
                    break;
                case '4A':
                    return gonext();
                    break;
                case '4B':
                    getUserInput('Which place?').then(( title ) => {
                        if ( !next[title] ) {
                            console.log('no have');
                            return menu();
                        } else {
                            return getUserInput('Remove which destination?')
                                .then(( destination ) => {
                                    next[title] = next[title].filter((title) => title !== destination);
                                    save();
                                    return menu();
                                });
                        }
                    } );
                    break;
                case '4C':
                    getUserInput('Which place?').then(( title ) => {
                        addNearby(title);
                        save();
                        return menu();
                    } );
                    break;
                case '5A':
                    return addredirect();
                case '6A':
                    return getUserInput('Which place or country?').then(( title ) => {
                        if ( destinations[title] ) {
                            return updatefieldvalue(destinations[title]);
                        } else if ( countries[title] ) {
                            return updatefieldvalue(countries[title]);
                        } else {
                            console.log('no have');
                            return menu();
                        }
                    } );
                case '6B':
                    getUserInput('Which place?').then(( title ) => {
                        if ( !destinations[title] ) {
                            console.log('no have');
                            return menu();
                        } else {
                            return getUserInput('What is image thumbnail?', false).then(( thumbnail ) => {
                                return getUserInput('What is commons title?').then(( source ) => {
                                    destinations[title].thumbnail = thumbnail;
                                    destinations[title].thumbnail__source = source;
                                    console.log(`updated ${title}`);
                                    save();
                                    return menu();
                                })
                            });
                        }
                    });
                    break;
                case '7A':
                    return getUserInput('Which sight (provide wikibase id)?').then(( title ) => {
                        if ( !sights[title] ) {
                            console.log('no have');
                            return menu();
                        } else {
                            return updatefieldvalue(sights[title]);
                        }
                    } );
                case '8':
                    return getUserInput('Update summary for?').then(( title ) => {
                        if ( destinations[title] ) {
                            return updatesummary(title, destinations[title]);
                        } else if ( sights[title] ) {
                            return updatefieldvalue(sights[title]);
                        } else {
                            console.log('no have');
                            return menu();
                        }
                    } );
                default:
                    feedback('Huh?');
                    menu();
            }
        });
}
menu();