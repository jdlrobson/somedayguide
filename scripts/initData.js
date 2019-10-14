import fetch from 'node-fetch';
import destinations from './data/destinations.json';
import next from './data/next.json';
import { ignore } from './data/redirects.js';
import countries from './data/countries.json';
import fs from 'fs';
const SHOW_WARNINGS = false;
const pending = [];

console.log('Remove bad data entries in go next');
Object.keys(next).forEach((key) => {
    const newSet = Array.from(new Set(next[key]));
    if ( newSet.length !== next[key].length) {
        console.log(`Remove duplicates in go next for ${key}`);
    } else if (
        SHOW_WARNINGS &&
        newSet.filter((place) => destinations[place] !== undefined).length !== next[key].length
    ) {
        console.warn(`\t${key} points to destination(s) that do not exist`);
    }
    if ( SHOW_WARNINGS && destinations[key] === undefined) {
        console.warn(`\t${key} is not a destination.`);
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
})

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
    const newSights = place.sights.filter((sight) =>
        !(next[place.title] || []).includes(sight) &&
        (!countries[sight])
    );
    if ( newSights.length !== place.sights.length) {
        console.log(`Removed sight that is go next/country in ${place.title}`);
        destinations[destinationTitle].sights = newSights;
        pending.push(Promise.resolve())
    }
    /*place.sights.forEach((sight) => {
        sight.thumbnail.replace(/[0-9]+px/, '400px')
    })
    pending.push(Promise.resolve())*/
});

if ( pending.length ) {
    console.log('Updating JSON');
    Promise.all( pending ).then(() => {
        fs.writeFileSync(`${__dirname}/data/countries.json`, JSON.stringify(countries));
        fs.writeFileSync(`${__dirname}/data/destinations.json`, JSON.stringify(destinations));
        fs.writeFileSync(`${__dirname}/data/next.json`, JSON.stringify(next));
    });
} else {
    console.log( 'No changes necessary.' );
}
