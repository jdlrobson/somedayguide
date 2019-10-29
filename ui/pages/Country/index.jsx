import preact, { h } from 'preact';
import Page from '../Page';
import Box from '../../components/Box';
import Card from '../../components/Card';
import InstagramEmbed from '../../components/InstagramEmbed';
import Slideshow from '../../components/Slideshow';

export default function ( props ) {
    const { summary, airports = [], sights = [], links = [], personalNote, blogs = [],
            instagram,
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
            {sights.sort((s1,s2)=> (s1.claims || 0 ) < s2.claims || 0 ? -1 : 1).map((sight) => <Card modifier="condensed" {...sight}
                href={`https://en.wikipedia.org/wiki/${sight.title}`}/>)}
        </Box>
    ];

    return (
        <Page title={title} lat={lat} lon={lon} zoom={5}
            childrenLeft={childrenLeft} childrenRight={childrenRight}>
            <div class="note" dangerouslySetInnerHTML={ { __html: summary } } />
            {personalNote &&<div class="note">
                <h4 class="note__heading">Personal note</h4>
                <div dangerouslySetInnerHTML={ { __html: personalNote } } />
            </div>}
            {instagram && instagram.length > 0 && <InstagramEmbed id={instagram[0]} />}
            <div class="note note--private" id="local-edit">
                <p contentEditable>What's on your mind?</p>
            </div>
            <div class="note">
            {blogs.length > 0 && <h4 class="note__heading">Our travel journal</h4>}
            {blogs.length > 0 &&
                blogs.map((blog) =>
                    <Card modifier="note" {...blog}/>)
            }
            </div>
        </Page>
    );
};
