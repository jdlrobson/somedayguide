import util from 'util';
import destinations from './data/destinations.json';
import next from './data/next.json';
import fs from 'fs';

function save() {
    fs.writeFileSync(`${__dirname}/data/destinations.json`, JSON.stringify(destinations));
    fs.writeFileSync(`${__dirname}/data/next.json`, JSON.stringify(next));
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

function menu() {
    const options = [
            '0: Add place',
            '1: Delete place',
            '2: Add sight',
            '4: Add go next',
            '6: Set image'
    ];
    getUserInput( '\n\n\n**********************\n' + options.join('\n') + '\n**********************' )
        .then( ( val ) => {
            val = parseInt( val, 10 );
            switch ( val ) {
                case 0:
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
                case 1:
                    getUserInput('Which place?').then(( title ) => {
                        delete destinations[title];
                        save();
                        return menu();
                    })
                    break;
                case 2:
                    getUserInput('Which place?').then(( title ) => {
                        return getUserInput('Which sight?').then(( sight ) => {
                            if ( destinations[title].sights.filter((p) => p.title === sight).length ) {
                                feedback('Already got that one.');
                            } else {
                                feedback(`Pushed "${sight}" to "${title}"`);
                                destinations[title].sights.push( { title: sight } );
                            }
                            save();
                            return menu();
                        });
                    });
                    break;
                case 4:
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
                case 6:
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