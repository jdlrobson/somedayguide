import preact, { h } from 'preact';
import Page from '../Page';
import CardGrid from '../../components/CardGrid';
import Card from '../../components/Card';

export default function ( { places, title, linkPrefix = '/country/' } ) {
    return (
        <Page zoom={1}
            title={title || "the world"}>
            <CardGrid id="grid">
                {places.map((place) =>
                    <Card {...place}
                        href={`${linkPrefix}${place.title}`} />)}
            </CardGrid>
        </Page>
    )
};
