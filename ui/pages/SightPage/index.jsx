import preact, { h } from 'preact';
import Page from '../Page';
import Note from '../../components/Note';
import Card from '../../components/Card';
import Box from '../../components/Box';
import CommonsSlideshow from '../../components/Slideshow/CommonsSlideshow';

export default function ( props ) {
    const { description, title, lat, lon, wb, country, thumbnail, thumbnail__source,
            commons, summary, destinations
        } = props,
        slides = thumbnail ? [{ src: thumbnail, href: thumbnail__source } ] : [];

    const childrenRight = [
        <CommonsSlideshow slides={slides} commons={commons}></CommonsSlideshow>
    ];
    const childrenLeft = [
        destinations.length && <Box title="Nearby" id="destinations">
            {destinations.sort((p1, p2)=>p1.distance < p2.distance ? -1 : 1)
                .map((place) => <Card modifier="condensed" {...place}/>)}
        </Box>,
    ];

    return (
        <Page title={title} lat={lat} lon={lon} parent={country} wikibase={wb} nowikivoyage={true}
            parentLink={`/country/${country}`}
            childrenLeft={childrenLeft} childrenRight={childrenRight}>
            <Note><div dangerouslySetInnerHTML={ { __html: summary || description } } /></Note>
        </Page>
    );
};
