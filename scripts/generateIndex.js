import fs from 'fs';
import fetch from 'node-fetch';
import destinations from './data/destinations.json';
import countries from './data/countries.json';

const mapResult = (index) => {
    return ( title ) => {
        return {
            title,
            thumbnail: index[title] && index[title].thumbnail
        };
    }
}
const index = {
    countries: Object.keys(countries).map(mapResult(countries)),
    destinations: Object.keys(destinations).map(mapResult(destinations))
};

console.log('Updating JSON');
fs.writeFileSync(`${__dirname}/../public/index.json`, JSON.stringify(index));
