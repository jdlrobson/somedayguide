import preact, { h } from 'preact';
import Page from '../Page';
import Box from '../../components/Box';
import Card from '../../components/Card';
import Slideshow from '../../components/Slideshow';
import CardGrid from '../../components/CardGrid';
import Climate from '../../components/Climate';

export default function ( props ) {
    const { summary, climate, sights,
            title, lat, lon, thumbnail, next = [], thumbnail__source } = props,
            slides = thumbnail ? [{ src: thumbnail, href: thumbnail__source } ] : [];

    const childrenRight = [
        <Slideshow slides={slides}></Slideshow>,
        <Box title="Climate">
            <Climate data={climate.length ? climate : undefined} />
        </Box>
    ];
    const childrenLeft = [
        <Box title="Go next">
            {next.map((place) => <Card modifier="condensed" {...place}/>)}
        </Box>
    ];

    return (
        <Page title={title} lat={lat} lon={lon}
            childrenLeft={childrenLeft} childrenRight={childrenRight}>
            <div class="note" dangerouslySetInnerHTML={ { __html: summary } } />
            <div class="note">
                <p contentEditable>You will go there someday...</p>
            </div>
            <CardGrid>
            {sights.map((sight) => <Card modifier="condensed" {...sight}
                thumbnail={sight.thumbnail && sight.thumbnail.replace(/[0-9]+px/, '400px')}
                href={`https://en.wikipedia.org/wiki/${sight.title}`}/>)}
            </CardGrid>
        </Page>
    );
};
