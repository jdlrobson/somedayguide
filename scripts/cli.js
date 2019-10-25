import util from 'util';
import countries from './data/countries.json';
import destinations from './data/destinations.json';
import sights from './data/sights.json';
import next from './data/next.json';
import fs from 'fs';

function save() {
    fs.writeFileSync(`${__dirname}/data/countries.json`, JSON.stringify(countries));
    fs.writeFileSync(`${__dirname}/data/destinations.json`, JSON.stringify(destinations));
    fs.writeFileSync(`${__dirname}/data/next.json`, JSON.stringify(next));
    fs.writeFileSync(`${__dirname}/data/sights.json`, JSON.stringify(sights));
}

function feedback( msg ) {
    console.log( msg );
}

function getUserInput( msg ) {
    return new Promise( ( resolve, reject ) => {
            feedback( msg, true );
            process.stdin.setEncoding('utf8');
            process.stdin.once('data', function (text) {
                    resolve( util.inspect(text).replace(/_/g, ' ')
                        .replace( /'([^\n]*)'/g, '$1' ).replace( '\\n', '' )
                            .replace(/\\/, '').trim() );
            });
    })
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

function listwithout(list, title) {
    return list.filter((t) => t !== title);
}

function deleteplace(title) {
    const dest = destinations[title];
    if ( !dest ) {
        return `Unknown place ${title}`;
    }
    if ( dest.country ) {
        console.log(`Remove ${title} from ${dest.country} destinations`);
        countries[dest.country].destinations = listwithout(countries[dest.country].destinations, title)
    }
    delete destinations[title];
    next[title].forEach((to) => {
        console.log(`Remove link from ${title} to ${to}`);
        next[to] = listwithout(next[to], title);
    });
    delete next[title];
}

function countrieswithsight(sight) {
    return Object.keys(countries).filter((key) => {
        if (!countries[key].sights) {
            return false;
        } else if (countries[key].sights.indexOf(sight) > -1) {
            return true;
        }
    });
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

function removesightfromcountry(country, sight) {
    console.log(`Remove reference to ${sight} in ${country}`);
    countries[country].sights = listwithout(countries[country].sights, sight);
}

function removesightfromdestination(destination, sight) {
    console.log(`Remove reference to ${sight} in ${destination}`);
    destinations[destination].sights = listwithout(destinations[destination].sights, sight);
}

function removesight(sight) {
    if ( !sights[sight] ) {
        return `Unknown sight ${sight}`;
    }
    countrieswithsight(sight).forEach((key) => removesightfromcountry(key, sight));
    destinationwithsight(sight).forEach((key) => removesightfromdestination(key, sight));
    delete sights[sight];
}

function removesights() {
    return getUserInput('Which sight?').then(( sight ) => {
        if ( sight ) {
            removesight(sight);
            save();
            return removesights();
        } else {
            return menu();
        }
    });
}

function addsighttodestination(key, sight) {
    console.log(`Add sight ${sight} to ${key}`);
    destinations[key].sights.push(sight);
}

function addsighttocountry(key, sight) {
    console.log(`Add sight ${sight} to ${key}`);
    countries[key].sights.push(sight);
}

function renamesight() {
    return getUserInput('Which sight?').then(( original ) => {
        return getUserInput('Rename to what?').then(( newName ) => {
            sights[newName] = Object.assign({}, sights[original], { title: newName });
            delete sights[original];
            countrieswithsight(original).forEach((key) => {
                removesightfromcountry(key, original);
                addsighttocountry(key, newName);
            });
            destinationwithsight(original).forEach((key) => {
                removesightfromdestination(key, original);
                addsighttodestination(key, newName);
            });
        });
    } ).then(() => {
        save();
        return menu();
    })
}

function addSight() {
    function addSightTo(place) {
        return getUserInput('Which sight?').then(( sight ) => {
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
function menu() {
    const options = [
            '0: Add place',
            '1: Delete place',
            '2A: Add sight',
            '2B: Remove sight',
            '2C: Rename sight',
            '3D: Remove country destination',
            '4: Go next',
            '4A: Add go next',
            '4B: Remove go next',
            '6A: Set field',
            '6B: Set image'
    ];
    getUserInput( '\n\n\n**********************\n' + options.join('\n') + '\n**********************' )
        .then( ( val ) => {
            switch ( val ) {
                case '0':
                    getUserInput('Which place?').then(( title ) => {
                        if ( destinations[title] ) {
                            feedback('Already got that one.');
                        } else {
                            feedback(`Pushed "${title}"`);
                            destinations[title] = { title };
                        }
                        save();
                        return menu();
                    })
                    break;
                case '1':
                    getUserInput('Which place?').then(( title ) => {
                        deleteplace(title);
                        save();
                        return menu();
                    })
                    break;
                case '2A':
                    return addSight();
                    break;
                case '2B':
                    return removesights();
                case '2C':
                    return renamesight();
                case '3D':
                    return removeDestination();
                    break;
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
                case '6A':
                    return getUserInput('Which place?').then(( title ) => {
                        if ( !destinations[title] ) {
                            console.log('no have');
                            return menu();
                        } else {
                            return getUserInput('Which field?').then(( field ) => {
                                return getUserInput('Which value?').then(( value ) => {
                                    destinations[title][field] = value;
                                    save();
                                    return menu();
                                } );
                            } );
                        }
                    } );
                case '6B':
                    getUserInput('Which place?').then(( title ) => {
                        if ( !destinations[title] ) {
                            console.log('no have');
                            return menu();
                        } else {
                            return getUserInput('What is image thumbnail?').then(( thumbnail ) => {
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
                default:
                    feedback('Huh?');
                    menu();
            }
        });
}
menu();