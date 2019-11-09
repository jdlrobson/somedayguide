import preact, { h } from 'preact';
import Page from '../Page';
import Box from '../../components/Box';
import Card from '../../components/Card';
import Slideshow from '../../components/Slideshow';
import InstagramEmbed from '../../components/InstagramEmbed';
import Climate from '../../components/Climate';

export default function ( props ) {
    const { summary, climate, sights, links = [], country, blogs = [], personalNote,
            instagram, wb, commons,
            title, lat, lon, thumbnail, next = [], thumbnail__source } = props,
            sightInstagrams = sights.map((sight) => sight.instagram).filter((ig) => ig)
                // reduce into existing list
                .reduce((a, b) => a.concat(b), [] ),
            slides = thumbnail ? [{ src: thumbnail, href: thumbnail__source } ] : [];

    const childrenRight = [
        <Slideshow slides={slides} commons={commons}></Slideshow>,
        <Box title="Climate">
            <Climate data={climate && climate.length ? climate : undefined} />
        </Box>,
        <Box title="Useful links">
            <ul>{links.map((link) =><li><a href={link.href}>{link.text}</a></li> )}</ul>
        </Box>
    ];
    const childrenLeft = [
        <Box title="Go next" id="destinations">
            {next.sort((p1, p2)=>p1.distance < p2.distance ? -1 : 1)
                .map((place) => <Card modifier="condensed" {...place}/>)}
        </Box>,
        <Box title="Sights" id="sights">
            {sights.sort((s1, s2) => {
                    return s1.distance < s2.distance ? -1 : 1
                }).map((sight) => <Card modifier="condensed" {...sight}
                thumbnail={sight.thumbnail && sight.thumbnail.replace(/[0-9]+px/, '400px')}
                href={`https://en.wikipedia.org/wiki/${sight.title}`}/>)}
        </Box>
    ];

    return (
        <Page title={title} lat={lat} lon={lon} parent={country} wikibase={wb}
            parentLink={`/country/${country}`}
            childrenLeft={childrenLeft} childrenRight={childrenRight}>
            <div class="note" dangerouslySetInnerHTML={ { __html: summary } } />
            {personalNote &&<div class="note">
                <h4 class="note__heading">Personal note</h4>
                <div dangerouslySetInnerHTML={ { __html: personalNote } } />
            </div>}
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
            <div class="note">
            {(instagram.length > 0 || sightInstagrams.length > 0) &&
                <h4 class="note__heading">Our Instagrams</h4>}
            {instagram.length > 0 && instagram.map((id) => <InstagramEmbed id={id} />)}
            {sightInstagrams.map((id) => <InstagramEmbed id={id} />)}
            </div>
        </Page>
    );
};
