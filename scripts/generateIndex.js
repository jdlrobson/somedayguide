import fs from 'fs';
import destinations from './data/destinations.json';
import countries from './data/countries.json';

const index = [];
const indexSights = {};

Object.keys(destinations).forEach((d) => {
    const dkey = d.toLowerCase();
    index.push(dkey);
    destinations[d].sights.forEach((s) => {
        const skey = s.toLowerCase();
        indexSights[skey] = indexSights[skey] || [];
        indexSights[skey].push(dkey);
    });
});
Object.keys(countries).forEach((c) => {
    index.push(`c:${c.toLowerCase()}`);
});

console.log('Updating JSON');
fs.writeFileSync(`${__dirname}/../public/index.json`, JSON.stringify(index));
fs.writeFileSync(`${__dirname}/../public/index--sights.json`, JSON.stringify(indexSights));

const thumbs = Object.keys(countries).map(
        (key) => [`/thumbnails/country/${key}`, countries[key].thumbnail ]
    )
    .concat(
        Object.keys(destinations).map(
            (key) => [`/thumbnails/destination/${key}`, `https:${destinations[key].thumbnail}` ]
        )
    ).filter((redirectrule) => redirectrule[1] !== undefined);

// redirects (in future why don't we download these?)
fs.writeFileSync(`${__dirname}/../_redirects`,
    thumbs.map((redirectrule) => redirectrule.join(' ')).join('\n')
);
