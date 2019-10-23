import fs from 'fs';
import fetch from 'node-fetch';
import destinations from './data/destinations.json';
import countries from './data/countries.json';

const mapResult = (index) => {
    return ( title ) => {
        return [
            title && title.toLowerCase(),
            index[title] && index[title].thumbnail && index[title].thumbnail
                .replace('https:', '').replace('//upload.wikimedia.org/wikipedia/commons/', '')
        ];
    }
}
const index = {
    countries: Object.keys(countries).map(mapResult(countries)),
    destinations: Object.keys(destinations).map(mapResult(destinations)),
};

console.log('Updating JSON');
fs.writeFileSync(`${__dirname}/../public/index.json`, JSON.stringify(index));
