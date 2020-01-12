import preact, { h } from 'preact';
import Page from '../Page';
import Box from '../../components/Box';
import Card from '../../components/Card';
import InstagramEmbed from '../../components/InstagramEmbed';
import Slideshow from '../../components/Slideshow';
import Note from '../../components/Note';
import PrivateNote from '../../components/PrivateNote';
import CommonsSlideshow from '../../components/Slideshow/CommonsSlideshow';

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
    const { summary, airports = [], sights = [], links = [], personalNote, blogs = [],
            instagram, neighbors, wb, commons, info, wikipedia,
            title, lat, lon, thumbnail, destinations = [], thumbnail__source } = props;

    const childrenRight = [
        <CommonsSlideshow
            commons={commons}
            slides={[{ src: thumbnail, href: thumbnail__source } ]}></CommonsSlideshow>,
        neighbors && <Box title="Nearby countries" modifiers={['cards']}>
            {neighbors.map((country) =><Card modifier="condensed" {...country}
                href={`/country/${country.title}`}/> )}
        </Box>,
        // Electrical is ommitted as if you have a universal adapter it shouldn't matter..
        <Box title="Good to know">
            <div>{info && info.currency && <span>
                <span>💰 </span>
                <a href={`https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=${info.currency}`}>
                    {info.currency}
                </a></span>}
            </div>
            <div>{info && info.tel && <span>📞 {info.tel}</span>}</div>
            <div>{info && info.languages && <span>🗣️ </span>}
                {info && info.languages && info.languages.map((lang) => <span>{lang} </span>)}
            </div>
        </Box>,
        <Box title="Airports">
            <ul>{airports.map((code) => <li><a href={`https://www.rome2rio.com/map/${code}%20airport`}>{code}</a></li>)}</ul>
        </Box>,
        <Box title="Useful links">
            <ul>{links.map((link) =><li><a href={link.href}>{link.text}</a></li> )}</ul>
        </Box>
    ];
    const claimSort = (s1,s2)=> (s1.claims || 0 ) > s2.claims || 0 ? -1 : 1;
    const childrenLeft = [
        <Box title={`Destinations (${destinations.length})`} id="destinations" modifiers={['cards']}>
            {destinations.sort(claimSort).map((place) => <Card modifier="condensed" {...place}/>)}
        </Box>,
        <Box title={`Sights (${sights.length})`} id="sights" modifiers={['cards']}>
            {sights.sort(claimSort).map((sight) => <Card modifier="condensed" {...sight}
                href={`/sights/${sight.wb}`}/>)}
        </Box>
    ];

    return (
        <Page title={title} lat={lat} lon={lon} zoom={5} wikibase={wb}
            childrenLeft={childrenLeft} childrenRight={childrenRight}>
            <Note id="personal">
                <div dangerouslySetInnerHTML={ { __html: personalNote ||
                    automatedPersonalNote(title, instagram, blogs) } } />
            </Note>
            <Note>
                <h4 class="note__heading">{title}</h4>
                <div dangerouslySetInnerHTML={ { __html: summary } } />
            </Note>
            <PrivateNote />
            <Note id="blogs">
            {blogs.length > 0 && <h4 class="note__heading">Our travel journal</h4>}
            {blogs.length > 0 &&
                blogs.map((blog) =>
                    <Card modifier={["note", "blogs"]} {...blog}/>)
            }
            </Note>
            <Note>
            {(instagram.length > 0) &&
                <h4 class="note__heading">Our Instagrams</h4>}
            </Note>
            {instagram.length > 0 &&
                <Slideshow className="slideshow--ig">{
                instagram.map((id) => <InstagramEmbed className="slideshow__slide"/>)
            }</Slideshow>}
        </Page>
    );
};
