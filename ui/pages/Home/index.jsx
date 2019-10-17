import preact, { h } from 'preact';
import Page from '../Page';
import CardGrid from '../../components/CardGrid';
import Card from '../../components/Card';

export default function ( { places } ) {
    return (
        <Page subtitle="guide to" zoom={1}
            title="the world">
            <CardGrid>
                {places.map((place) =>
                    <Card title={place.title}
                        href={place.href || `/country/${place.title}`}
                        description={place.description} thumbnail={place.thumbnail} />)}
            </CardGrid>
        </Page>
    )
};
