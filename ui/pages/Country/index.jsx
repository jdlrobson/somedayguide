import preact, { h } from 'preact';
import Page from '../Page';
import Box from '../../components/Box';
import Card from '../../components/Card';
import CardGrid from '../../components/CardGrid';
import Slideshow from '../../components/Slideshow';

export default function ( props ) {
    const { summary, airports = [], sights = [], links = [], personalNote,
            title, lat, lon, thumbnail, destinations = [], thumbnail__source } = props;

    const childrenRight = [
        <Slideshow slides={[{ src: thumbnail, href: thumbnail__source } ]}></Slideshow>,
        <Box title="Airports">
            <ul>{airports.map((code) => <li><a href={`https://www.rome2rio.com/map/${code}%20airport`}>{code}</a></li>)}</ul>
        </Box>,
        <Box title="Useful links">
            <ul>{links.map((link) =><li><a href={link.href}>{link.text}</a></li> )}</ul>
        </Box>
    ];
    const childrenLeft = [
        <Box title="Destinations" id="destinations">
            {destinations.map((place) => <Card modifier="condensed" {...place}/>)}
        </Box>,
        <Box title="Sights" id="sights">
            {sights.map((sight) => <Card modifier="condensed" {...sight}
                href={`https://en.wikipedia.org/wiki/${sight.title}`}/>)}
        </Box>
    ];

    return (
        <Page title={title} lat={lat} lon={lon} zoom={5}
            childrenLeft={childrenLeft} childrenRight={childrenRight}>
            <div class="note" dangerouslySetInnerHTML={ { __html: summary } } />
            <div class="note">
                <h4 class="note__heading">Personal note</h4>
                <div dangerouslySetInnerHTML={ { __html: personalNote } } />
            </div>
            <div class="note note--private" id="local-edit">
                <p contentEditable>What's on your mind?</p>
            </div>
        </Page>
    );
};
