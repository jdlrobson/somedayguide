import preact, { h } from 'preact';
import Page from '../Page';
import Box from '../../components/Box';
import Card from '../../components/Card';
import Slideshow from '../../components/Slideshow';
import Climate from '../../components/Climate';

export default function ( props ) {
    const { summary, climate, sights,
            title, lat, lon, thumbnail, next = [], thumbnail__source } = props;

    const childrenRight = [
        <Slideshow slides={[{ src: thumbnail, href: thumbnail__source } ]}></Slideshow>,
        <Box title="Climate">
            <Climate data={climate.length ? climate : undefined} />
        </Box>
    ];
    const childrenLeft = [
        <Box title="Go next">
            {next.map((place) => <Card modifier="condensed" {...place}/>)}
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
