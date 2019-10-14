import fs from 'fs';
import render from 'preact-render-to-string';
import preact, { h } from 'preact';
import Home from '../ui/pages/Home';
import Destination from '../ui/pages/Destination';
import Country from '../ui/pages/Country';
import NotFound from '../ui/pages/NotFound';
import places_json from './data/destinations.json';
import next_json from './data/next.json';
import countries_json from './data/countries.json';
const mustache = require( 'mustache' );
const template = fs.readFileSync( __dirname + '/index.mustache' ).toString();

function renderPage( filename, data ) {
    fs.writeFileSync( `public/${filename}`, mustache.render( template, data ) );
}

Object.keys(places_json).forEach((title) => {
    const place = places_json[title];
    console.log(`Generate ${place.title}...`);
    const next = next_json[title] || [];

    renderPage( `destination/${place.title}.html`, {
        page_title: title,
        url: `https://somedayguide.com/destination/${title}`,
        img: place.thumbnail,
        view: render( <Destination {...place}
            next={next.filter((title) => !!places_json[title]).map((title) => places_json[title])} /> ),
        description: `Guide to ${place.title}`
    } );
});

console.log('Generate countries...')
Object.keys(countries_json).forEach((title) => {
    const country = countries_json[title];
    console.log(`Generate ${title}...`);

    // remove destinations without an image...
    country.destinations = country.destinations
        .map((title) => places_json[title] || {})
        .filter((d) => d.thumbnail)
        // destinations should link to places that exist.
        .filter((d) => places_json[d.title])
        // destinations should not point to countries...
        .filter((d) => countries_json[d.title] === undefined);

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

renderPage( '404.html', {
    page_title: '4 oh no 4',
    view: render( <NotFound /> )
} );
