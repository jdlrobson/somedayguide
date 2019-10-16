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
import sights_json from './data/sights.json';
const mustache = require( 'mustache' );
const template = fs.readFileSync( __dirname + '/index.mustache' ).toString();

function renderPage( filename, data ) {
    fs.writeFileSync( `public/${filename}`, mustache.render( template, data ) );
}

const destinations = Object.keys(places_json);
console.log(`Generate ${destinations.length} destinations...`);
destinations.forEach((title) => {
    const place = places_json[title];
    const next = next_json[title] || [];
    const sights = place.sights.map((sight) => sights_json[sight])
        .filter((sight) => sight);
    if ( sights.length !== place.sights.length ) {
        console.log(`data integrity problem in sights for ${title}`);
    }

    renderPage( `destination/${place.title}.html`, {
        page_title: title,
        url: `https://somedayguide.com/destination/${title}`,
        img: place.thumbnail,
        view: render( <Destination {...place}
            sights={sights}
            next={next.filter((title) => !!places_json[title]).map((title) => places_json[title])} /> ),
        description: `Guide to ${place.title}`
    } );
});

const countries = Object.keys(countries_json);
console.log(`Generate ${countries.length} countries...`);
countries.forEach((title) => {
    const country = countries_json[title];

    // remove destinations without an image...
    const destinations = country.destinations
        .map((title) => places_json[title] || {})
        .filter((d) => d.thumbnail)
        // destinations should link to places that exist.
        .filter((d) => places_json[d.title])
        // destinations should not point to countries...
        .filter((d) => countries_json[d.title] === undefined);

    const sights = country.sights.map((sight) => sights_json[sight])
        .filter((sight) => sight);
    if ( sights.length !== country.sights.length ) {
        console.log(`data integrity problem in sights for ${title}`);
    }
    renderPage( `country/${title}.html`, {
        page_title: title,
        url: `https://somedayguide.com/country/${title}`,
        img: country.thumbnail,
        view: render( <Country {...country}
            destinations={destinations}
            sights={sights}
        /> ),
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
