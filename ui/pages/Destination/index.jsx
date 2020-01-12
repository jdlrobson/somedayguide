import preact, { h } from 'preact';
import Page from '../Page';
import Box from '../../components/Box';
import Card from '../../components/Card';
import Slideshow from '../../components/Slideshow';
import Note from '../../components/Note';
import PrivateNote from '../../components/PrivateNote';
import CommonsSlideshow from '../../components/Slideshow/CommonsSlideshow';
import InstagramEmbed from '../../components/InstagramEmbed';
import Climate from '../../components/Climate';

const automatedPersonalNote = (title, instagram, blogs) => {
    if ( blogs.length ) {
        return `Get to know ${title} and make your own plans for someday by reading <a href="#blogs">our blogs</a>.`;
    } else if ( instagram.length ) {
        return `We have visited ${title} but haven't got round to putting something here. Checkout our Instagrams in the meantime.`;
    } else {
        return `Someday we will visit ${title} or begin to dream about going there! However, for now its not on our radar.
<a href="#tips">Let us know in the comments</a> if you think that should change!`;
    }
};

export default function ( props ) {
    const { summary, climate, sights, links = [], country, blogs = [], personalNote,
            instagram, wb, commons, body, wikipedia,
            title, lat, lon, thumbnail, next = [], thumbnail__source } = props,
            sightInstagrams = sights.map((sight) => sight.instagram).filter((ig) => ig)
                // reduce into existing list
                .reduce((a, b) => a.concat(b), [] ),
            slides = thumbnail ? [{ src: thumbnail, href: thumbnail__source } ] : [];

    const childrenRight = [
        <CommonsSlideshow slides={slides} commons={commons}></CommonsSlideshow>,
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
        <Box title={`Sights (${sights.length})`} id="sights">
            {sights.sort((s1, s2) => {
                    return s1.distance < s2.distance ? -1 : 1
                }).map((sight) => <Card modifier="condensed" {...sight}
                thumbnail={sight.thumbnail && sight.thumbnail.replace(/[0-9]+px/, '400px')}
                href={`/sights/${sight.wb}`}/>)}
        </Box>,
        <Box title={`Nature`} id="nature">
        <button class="note__button">Connect with nature</button>
        </Box>
    ];

    return (
        <Page title={title} lat={lat} lon={lon} parent={country} wikibase={wb}
            parentLink={`/country/${country}`}
            childrenLeft={childrenLeft} childrenRight={childrenRight}>
            <Note id="personal">
                <div dangerouslySetInnerHTML={ { __html: personalNote || automatedPersonalNote(title, instagram, blogs) } } />
            </Note>
            <Note>
                <h4 class="note__heading">{title}</h4>
                <div dangerouslySetInnerHTML={ { __html: summary } } />
                <div dangerouslySetInnerHTML={ { __html: body } } />
                {wikipedia && <footer class="somedaynote__footer">
                    Source: <a href={`https://en.wikipedia.org/wiki/${wikipedia}`}>wikipedia</a>
                </footer>}
            </Note>
            <PrivateNote/>
            <Note id="blogs">
            {blogs.length > 0 && <h4 class="note__heading">Our travel journal</h4>}
            {blogs.length > 0 &&
                blogs.map((blog) =>
                    <Card modifier="note" {...blog}/>)
            }
            </Note>
            {(instagram.length > 0 || sightInstagrams.length > 0) &&
                <Note><h4 class="note__heading">Our Instagrams</h4></Note>}
            {instagram.length > 0 &&
                <Slideshow className="slideshow--ig">{
                instagram.concat( sightInstagrams ).map((id) => <InstagramEmbed id={id} className="slideshow__slide"/>)
            }</Slideshow>}
            <Note>
                <h4 class="note__heading">Information for getting there</h4>
                <div id="get-in">
                    <p>When someday comes you'll need to get in.</p>
                    <button class="note__button">View information</button>
                </div>
            </Note>
            <Note>
                <h4 class="note__heading">Information for getting around</h4>
                <div id="get-around">
                    <p>When someday comes you'll need to be able to get around.</p>
                    <button class="note__button">View information</button>
                </div>
            </Note>
            <Note id="tips">
                <h4 class="note__heading">Your tips and questions</h4>
                <p>Let us know your best tips about {title}.</p>
                <button class="note__button" disabled>See and add tips</button>
                <div id="disqus_thread"></div>
            </Note>
        </Page>
    );
};
