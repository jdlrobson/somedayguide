import fetch from 'node-fetch';
import destinations from './data/destinations.json';
import next from './data/next.json';
import countries from './data/countries.json';
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

console.log('Checking countries');
Object.keys(countries).forEach((countryName) => {
    const country = countries[countryName];
    const newSights = country.sights.filter((sight) => !countries[sight.title]);
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
        !(next[place.title] || []).includes(sight.title) &&
        (!countries[sight.title])
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
