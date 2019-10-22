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
import regions_json from './data/regions.json';
import sights_json from './data/sights.json';
import blogs_json from './data/blogs.json';
const mustache = require( 'mustache' );
import { renderer, getPersonalNote } from './utils';
const template = fs.readFileSync( __dirname + '/index.mustache' ).toString();
const MODE = process.env.MODE;

const analyticsHTML = MODE === 'production' ?
`<!-- Global site tag (gtag.js) - Google Analytics -->
		<script async src="https://www.googletagmanager.com/gtag/js?id=UA-129740290-1"></script>
		<script>
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', 'UA-129740290-1');
		</script>` : '';

console.log(`Mode is ${MODE}`);

function renderPage( filename, data ) {
    data.analyticsHTML = analyticsHTML;
    fs.writeFileSync( `public/${filename}`, mustache.render( template, data ) );
}

const destinations = Object.keys(places_json);
console.log(`Generate ${destinations.length} destinations...`);
destinations.forEach((title) => {
    const place = places_json[title];
    const next = next_json[title] || [];
    const sights = (place.sights || []).map((sight) => sights_json[sight])
        .filter((sight) => sight);
    if ( place.sights && sights.length !== place.sights.length ) {
        console.log(`data integrity problem in sights for ${title}`);
    }

    renderPage( `destination/${place.title}.html`, {
        page_title: title,
        url: `https://somedayguide.com/destination/${title}`,
        img: place.thumbnail,
        view: render( <Destination {...place}
            sights={sights}
            blogs={(place.blogs || []).map((id) => blogs_json[id])}
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
            blogs={(country.blogs || []).map((id) => blogs_json[id])}
            destinations={destinations}
            personalNote={getPersonalNote(title)}
            sights={sights}
        /> ),
        description: `Guide to ${title}`
    } );
});

console.log(`Generate country index.html`);
renderPage( 'country/index.html', {
    page_title: 'Someday guide',
    url: 'https://somedayguide.com/',
    img: 'https://somedayguide.com/images/someday-map.png',
    view: render( <Home places={Object.keys(countries_json).map((key) => countries_json[key])} /> ),
    description: 'Jon and Linz\'s guide to the world'
} );

console.log(`Generate regions`);
Object.keys(regions_json).forEach((region) => {
    renderPage( `region/${region}.html`, {
        page_title: 'Someday guide',
        url: `https://somedayguide.com/region/${region}`,
        img: 'https://somedayguide.com/images/someday-map.png',
        view: render( <Home title={region} places={regions_json[region].countries.filter((key) => countries_json[key] !== undefined)
            .map((key) => countries_json[key])} /> ),
        description: 'Jon and Linz\'s guide to the world'
    });
});

console.log(`Generate index.html`);
const randomPlaces = Object.keys(places_json).sort(()=>Math.random() < 0.5 ? -1 : 1)
    .slice(0, 100).map((key) => places_json[key]);

// Render home page.
renderPage( 'index.html', {
    page_title: 'Someday guide',
    url: 'https://somedayguide.com/',
    img: 'https://somedayguide.com/images/someday-map.png',
    view: render( <Home linkPrefix = '/destination/' places={randomPlaces} /> ),
    description: 'Jon and Linz\'s guide to the world'
} );


renderPage( '404.html', {
    page_title: '4 oh no 4',
    view: render( <NotFound /> )
} );
