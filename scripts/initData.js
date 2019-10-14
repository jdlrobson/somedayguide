import fetch from 'node-fetch';
import places from './data/places.json';
import sights from './data/sights.json';
import next from './data/next.json';
import { extractCard, getMissingKeys } from './utils';
import fs from 'fs';

const pending = [];
const keys = ['title', 'lat', 'lon', 'thumbnail', 'summary', 'thumbnail__source', 'description'];

const checkPlace = ( place, index, host ) => {
    const missingKeys = getMissingKeys(place, keys);
    if ( missingKeys.length > 0 ) {
        console.log(`Updating ${place.title} (${missingKeys.join(',')})`);
        pending.push(
            fetch( `${host}/api/rest_v1/page/summary/${encodeURIComponent(place.title)}`).then((r)=>r.json())
                .then((json)=> {
                    place = extractCard(place, json);
                })
        );
    }
};

console.log('Check places...');
places.places.forEach((place, index) =>checkPlace(place, index, 'https://en.wikivoyage.org'));

Object.keys(sights).forEach((key) => {
    sights[key].forEach((sight, index) => checkPlace(sight, index, 'https://en.wikipedia.org'))
});

console.log('Checking go next is 2-way...');
places.places.forEach(( place ) => {
    ( next[place.title] || [] ).forEach((title) => {
        next[title] = next[title] || [];
        if ( next[title].indexOf(place.title) === -1) {
            next[title].push(place.title);
            console.log(`Mark ${title} -> ${place.title} path.`);
            pending.push(Promise.resolve((r) => r()))
        }
    })
});

if ( pending.length ) {
    console.log('Updating JSON');
    Promise.all( pending ).then(() => {
        fs.writeFileSync(`${__dirname}/data/places.json`, JSON.stringify(places));
        fs.writeFileSync(`${__dirname}/data/sights.json`, JSON.stringify(sights));
        fs.writeFileSync(`${__dirname}/data/next.json`, JSON.stringify(next));
    });
} else {
    console.log( 'No changes necessary.' );
}
