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
                    resolve( util.inspect(text).replace( /'([^\n]*)'/g, '$1' ).replace( '\\n', '' )
                            .replace(/\\/, '').trim() );
            });
    })
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
function menu() {
    const options = [
            '0: Add place',
            '1: Delete place',
            '2: Add sight',
            '3D: Remove country destination',
            '4: Go next',
            '4A: Add go next',
            '4B: Remove go next',
            '6: Set image'
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
                        delete destinations[title];
                        save();
                        return menu();
                    })
                    break;
                case '2':
                    getUserInput('Which place?').then(( title ) => {
                        const place = destinations[title] || countries[title];
                        if ( place ) {
                            return getUserInput('Which sight?').then(( sight ) => {
                                if ( place.sights.filter((p) => p === sight).length ) {
                                    feedback('Already got that one.');
                                } else {
                                    feedback(`Pushed "${sight}" to "${title}"`);
                                    place.sights.push(sight);
                                    sights[sight] = { title: sight };
                                }
                                save();
                                return menu();
                            });
                        } else {
                            console.log(`Cannot find ${title}`);
                            return menu();
                        }
                    });
                    break;
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
                    getUserInput('Which place does the journey begin?').then(( title ) => {
                        return getUserInput('Where can I go next?').then(( gonext ) => {
                            next[title] = next[title] || [];
                            if ( next[title].filter((p) => p.title === gonext).length ) {
                                feedback('Already got that one.');
                            } else {
                                feedback(`Pushed "${gonext}" to "${title}"`);
                                next[title].push( gonext );
                            }
                            save();
                            return menu();
                        });
                    });
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
                case '6':
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