import fs from 'fs';
import fetch from 'node-fetch';
import destinations from './data/destinations.json';
import countries from './data/countries.json';

const index = {
    countries: Object.keys(countries),
    destinations: Object.keys(destinations)
};

console.log('Updating JSON');
fs.writeFileSync(`${__dirname}/../public/index.json`, JSON.stringify(index));
