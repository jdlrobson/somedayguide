import util from 'util';
import places from './data/places.json';
import sights from './data/sights.json';
import next from './data/next.json';
import fs from 'fs';

function save() {
    fs.writeFileSync(`${__dirname}/data/places.json`, JSON.stringify(places));
    fs.writeFileSync(`${__dirname}/data/sights.json`, JSON.stringify(sights));
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
            '4: Add go next'
    ];
    getUserInput( '\n\n\n**********************\n' + options.join('\n') + '\n**********************' )
        .then( ( val ) => {
            val = parseInt( val, 10 );
            switch ( val ) {
                case 0:
                    getUserInput('Which place?').then(( title ) => {
                        if ( places.places.filter((p) => p.title === title).length ) {
                            feedback('Already got that one.');
                        } else {
                            feedback(`Pushed "${title}"`);
                            places.places.push( { title } );
                        }
                        save();
                        return menu();
                    })
                    break;
                case 1:
                    getUserInput('Which place?').then(( title ) => {
                        if ( places.places.filter((p) => p.title === title).length ) {
                            feedback('Already got that one.');
                        } else {
                            feedback(`Pushed "${title}"`);
                            places.places.push( { title } );
                        }
                        save();
                        return menu();
                    })
                    break;
                case 2:
                    getUserInput('Which place?').then(( title ) => {
                        return getUserInput('Which sight?').then(( sight ) => {
                            if ( sights[title].filter((p) => p.title === sight).length ) {
                                feedback('Already got that one.');
                            } else {
                                feedback(`Pushed "${sight}" to "${title}"`);
                                sights[title].push( { title: sight } );
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
                default:
                    feedback('Huh?');
                    menu();
            }
        });
}
menu();