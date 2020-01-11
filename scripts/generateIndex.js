import fs from 'fs';
import destinations from './data/destinations.json';
import countries from './data/countries.json';
import sights from './data/sights.json';

const index = [];
const indexSights = [];
const sightsRedirects = [];

Object.keys(destinations).forEach((d) => {
    const dkey = d.toLowerCase();
    index.push(dkey);
    destinations[d].sights.forEach((s) => {
        const skey = s.toLowerCase();
        indexSights[skey] = indexSights[skey] || [];
        indexSights[skey].push(dkey);

        // add redirect
        sightsRedirects.push([
            `/destination/${d.replace(/ /, '%20')}/sight/${sights[s].title.replace(/ /, '%20')}`,
            `/sights/${skey}`
        ].join(' '));
    });
});
Object.keys(countries).forEach((c) => {
    index.push(`c:${c.toLowerCase()}`);
});
Object.keys(sights).forEach((s) => {
    indexSights.push(`s:${sights[s].title.toLowerCase()}:${s.toLowerCase()}`);
});

console.log('Updating JSON');
fs.writeFileSync(`${__dirname}/../public/index.json`, JSON.stringify(index));
fs.writeFileSync(`${__dirname}/../public/index--sights.json`, JSON.stringify(indexSights));

const getThumb = (thumbnail) => {
    if (thumbnail && thumbnail.indexOf('//') === 0) {
        return 'https:' + thumbnail;
    } else {
        return thumbnail;
    }
}
const thumbs = Object.keys(countries).map(
        (key) => [`/thumbnails/country/${key.toLowerCase()}`, getThumb(countries[key].thumbnail)]
    )
    .concat(
        Object.keys(destinations).map(
            (key) => [`/thumbnails/destination/${key.toLowerCase()}`, getThumb(destinations[key].thumbnail)]
        )
    ).filter((redirectrule) => redirectrule[1] !== undefined);

// redirects (in future why don't we download these?)
fs.writeFileSync(`${__dirname}/../public/_redirects`,
    thumbs.map((redirectrule) => redirectrule.join(' ')).concat( [
        '/tools/climate/* /tools/climate.html'
    ] ).concat( sightsRedirects ).join('\n')
);
