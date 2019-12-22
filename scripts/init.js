import fs from 'fs';
import render from 'preact-render-to-string';
import preact, { h } from 'preact';
import Home from '../ui/pages/Home';
import Page from '../ui/pages/Page';
import Destination from '../ui/pages/Destination';
import SummaryPage from '../ui/pages/SummaryPage';
import DashboardPage from '../ui/pages/DashboardPage';
import Country from '../ui/pages/Country';
import NotFound from '../ui/pages/NotFound';
import places_json from './data/destinations.json';
import next_json from './data/next.json';
import countries_json from './data/countries.json';
import regions_json from './data/regions.json';
import sights_json from './data/sights.json';
import blogs_json from './data/blogs.json';
const mustache = require( 'mustache' );
import { getGithubWikiData, withDistance } from './utils';
import { no_climate, lacking_sights, lacking_gonext } from './stats';
const template = fs.readFileSync( __dirname + '/index.mustache' ).toString();
const MODE = process.env.MODE;

const sitemap = [];

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
    sitemap.push( { title: data.page_title, href: `/${filename}` } );
    data.analyticsHTML = analyticsHTML;
    fs.writeFileSync( `public/${filename}`, mustache.render( template, data ) );
}

const destinations = Object.keys(places_json);
console.log(`Generate ${destinations.length} destinations...`);
destinations.forEach((title) => {
    const place = getGithubWikiData(title, places_json[title]);
    const next = next_json[title] || [];
    const sights = (place.sights || []).map((sight) => {
        return getGithubWikiData(sight, sights_json[sight]);
    })
        .filter((sight) => sight)
        .map(withDistance(place.lat, place.lon));

    if ( place.sights && sights.length !== place.sights.length ) {
        const missing = place.sights.filter((s) => !sights.map(sobj=>sobj.title).includes(s));
        console.log(`data integrity problem in sights for ${title}: ${missing.join(',')}`);
    }

    renderPage( `destination/${place.title}.html`, {
        page_title: `${title} - World Travel Guide - someday you will see it all`,
        url: `https://somedayguide.com/destination/${title}`,
        img: place.thumbnail,
        view: render( <Destination {...place}
            sights={sights}
            blogs={(place.blogs || []).map((id) => blogs_json[id])}
            next={next.filter((title) => !!places_json[title]).map((title) => places_json[title])
                .map(withDistance(place.lat, place.lon))} /> ),
        description: `Guide to ${place.title}`
    } );
});

const countries = Object.keys(countries_json);
console.log(`Generate ${countries.length} countries...`);
countries.forEach((title) => {
    const country = getGithubWikiData(title, countries_json[title]),
        neighbors = country.neighbors ? country.neighbors.map((title) => countries_json[title]).filter((c) => c !== undefined) : undefined;

    // remove destinations without an image...
    const destinations = country.destinations
        .map((title) => places_json[title] || {})
        .filter((d) => d.thumbnail)
        // destinations should link to places that exist.
        .filter((d) => places_json[d.title])
        // destinations should not point to countries...
        .filter((d) => countries_json[d.title] === undefined
            // e.g. Singapore, Monaco etc..
            || d.title === title);

    // a country's sights will be the concatenation of all its destinations...
    const sights = destinations.reduce((previousValue, dest) => {
        return previousValue.concat(dest.sights || []);
    }, [])
    // removing duplicates
    .filter((s, i, arr) => arr.indexOf(s) === i )
    .map((sightKey) => sights_json[sightKey])
    // sorted by number of claims and limited to 150.
    .sort((a, b) => a.claims < b.claims ? 1 : -1).slice(0, 150);

    renderPage( `country/${title}.html`, {
        page_title: `${title} - someday guide to the world`,
        url: `https://somedayguide.com/country/${title}`,
        img: country.thumbnail,
        view: render( <Country {...country}
            neighbors={neighbors}
            blogs={(country.blogs || []).map((id) => blogs_json[id])}
            destinations={destinations}
            sights={sights}
        /> ),
        description: `Guide to ${title}`
    } );
});

console.log(`Generate country index.html`);
renderPage( 'country/index.html', {
    page_title: 'Someday guide to all the countries in the world',
    url: 'https://somedayguide.com/',
    img: 'https://somedayguide.com/images/someday-map.png',
    view: render( <Home places={Object.keys(countries_json).map((key) => countries_json[key])} /> ),
    description: 'Jon and Linz\'s guide to the world'
} );

console.log(`Generate regions`);
Object.keys(regions_json).forEach((region) => {
    renderPage( `region/${region}.html`, {
        page_title: 'Someday guide to all the regions in the world',
        url: `https://somedayguide.com/region/${region}`,
        img: 'https://somedayguide.com/images/someday-map.png',
        view: render( <Home title={region} places={regions_json[region].countries.filter((key) => countries_json[key] !== undefined)
            .map((key) => countries_json[key])} /> ),
        description: 'Jon and Linz\'s guide to the world'
    });
});

console.log(`Generate index.html`);
const randomPlaces = Object.keys(places_json).sort(()=>Math.random() < 0.5 ? -1 : 1)
    .slice(0, 30).map((key) => getGithubWikiData(key, places_json[key]));

// Render home page.
renderPage( 'index.html', {
    page_title: 'Someday guide to the world',
    url: 'https://somedayguide.com/',
    img: 'https://somedayguide.com/images/someday-map.png',
    view: render( <Home linkPrefix = '/destination/' places={randomPlaces} /> ),
    description: 'Jon and Linz\'s guide to the world'
} );


renderPage( '404.html', {
    page_title: '4 oh no 4',
    view: render( <NotFound /> )
} );

// render sitemap
renderPage( 'sitemap.html', {
    page_title: 'Someday guide sitemap',
    url: 'https://somedayguide.com/',
    img: 'https://somedayguide.com/images/someday-map.png',
    view: render(
        <Page>
        <h1>Sitemap</h1>
        <p>Where do you want to go today?</p>
        {sitemap.map((link) =>
            <a href={link.href}>{link.title} </a>
        )}</Page>
    ),
    description: 'Jon and Linz\'s guide to the world'
} );

renderPage( 'dashboard.html', {
    page_title: 'My dashboard',
    url: 'https://somedayguide.com/',
    img: 'https://somedayguide.com/images/someday-map.png',
    view: render(
        <DashboardPage />
    ),
    description: 'Jon and Linz\'s guide to the world'
} );


// tools
renderPage( 'tools/summary.html', {
    page_title: 'Summary',
    url: 'https://somedayguide.com/',
    img: 'https://somedayguide.com/images/someday-map.png',
    view: render(
        <SummaryPage {...{ no_climate, lacking_sights, lacking_gonext }} />
    ),
    description: 'Jon and Linz\'s guide to the world'
} );

fs.writeFileSync(`public/sitemap.txt`, sitemap.map((link) => `https://somedayguide.com/${link.href}`).join('\n'));
