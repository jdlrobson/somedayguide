import fs from 'fs';
import render from 'preact-render-to-string';
import preact, { h } from 'preact';
import Home from '../ui/pages/Home';
import Destination from '../ui/pages/Destination';
import Country from '../ui/pages/Country';
import places_json from './data/places.json';
import climate_json from './data/climate.json';
import sights_json from './data/sights.json';
import next_json from './data/next.json';
import countries_json from './data/countries.json';
const mustache = require( 'mustache' );
const template = fs.readFileSync( __dirname + '/index.mustache' ).toString();

function renderPage( filename, data ) {
    fs.writeFileSync( `public/${filename}`, mustache.render( template, data ) );
}

const places = places_json.places;
const index = {};
places.map(({title, thumbnail, description}) => {
    index[title] = {
        thumbnail, description
    };
});

places.forEach((place) => {
    console.log(`Generate ${place.title}...`);
    const title = place.title,
        next = next_json[title] || [];

    renderPage( `destination/${title}.html`, {
        page_title: title,
        url: `https://somedayguide.com/destination/${title}`,
        img: place.thumbnail,
        view: render( <Destination {...place}
            climate={climate_json[title]}
            sights={sights_json[title] || []}
            next={next.map((title)=>Object.assign({}, index[title], { title }))} /> ),
        description: `Guide to ${place.title}`
    } );
});

console.log('Generate countries...')
Object.keys(countries_json).forEach((title) => {
    const country = countries_json[title];
    console.log(`Generate ${title}...`);

    renderPage( `country/${title}.html`, {
        page_title: title,
        url: `https://somedayguide.com/country/${title}`,
        img: country.thumbnail,
        view: render( <Country {...country} /> ),
        description: `Guide to ${title}`
    } );
});

console.log(`Generate index.html`);
// Render home page.
renderPage( 'index.html', {
    page_title: 'Someday guide',
    url: 'https://somedayguide.com/',
    img: 'https://somedayguide.com/images/someday-map.png',
    view: render( <Home places={Object.keys(countries_json).map((key) => countries_json[key])} /> ),
    description: 'Jon and Linz\'s guide to the world'
} );
