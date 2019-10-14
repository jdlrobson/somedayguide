import fetch from 'node-fetch';
import destinations from './data/destinations.json';
import next from './data/next.json';
import { extractCard, getMissingKeys } from './utils';
import fs from 'fs';

const pending = [];

console.log('Remove duplicates in go next');
Object.keys(next).forEach((key) => {
    const newSet = Array.from(new Set(next[key]));
    if ( newSet.length !== next[key].length) {
        console.log(`Remove duplicates in go next for ${key}`);
        next[key] = newSet;
        pending.push(Promise.resolve())
    }
});

console.log('Checking go next is 2-way...');
Object.keys(destinations).forEach(( destinationTitle ) => {
    const place = destinations[destinationTitle];
    ( next[place.title] || [] ).forEach((nextTitle) => {
        next[nextTitle] = next[nextTitle] || [];
        if ( next[nextTitle].indexOf(place.title) === -1) {
            next[nextTitle].push(place.title);
            console.log(`Mark ${nextTitle} -> ${place.title} path.`);
            pending.push(Promise.resolve())
        }
    })
    const newSights = place.sights.filter((sight) => !(next[place.title] || []).includes(sight.title))
    if ( newSights.length !== place.sights.length) {
        console.log(`Removed sight that is go next in ${place.title}`);
        destinations[destinationTitle].sights = newSights;
        pending.push(Promise.resolve())
    }
});

if ( pending.length ) {
    console.log('Updating JSON');
    Promise.all( pending ).then(() => {
        fs.writeFileSync(`${__dirname}/data/destinations.json`, JSON.stringify(destinations));
        fs.writeFileSync(`${__dirname}/data/next.json`, JSON.stringify(next));
    });
} else {
    console.log( 'No changes necessary.' );
}
