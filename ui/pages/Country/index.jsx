import preact, { h } from 'preact';
import Page from '../Page';
import Box from '../../components/Box';
import Card from '../../components/Card';
import Slideshow from '../../components/Slideshow';

export default function ( props ) {
    const { summary, airports = [], sights = [], links = [],
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
        <Box title="Destinations">
            {destinations.map((place) => <Card modifier="condensed" {...place}/>)}
        </Box>,
        <Box title="Sights">
            {sights.map((sight) => <Card modifier="condensed" {...sight}
                href={`https://en.wikipedia.org/wiki/${sight.title}`}/>)}
        </Box>
    ];

    return (
        <Page title={title} lat={lat} lon={lon}
            childrenLeft={childrenLeft} childrenRight={childrenRight}>
            <div class="note" dangerouslySetInnerHTML={ { __html: summary } } />
            <div class="note">
                <p contentEditable>You will go there someday...</p>
            </div>
        </Page>
    );
};
