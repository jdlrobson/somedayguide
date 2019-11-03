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
                        href={`${linkPrefix}${place.title}`}>
                    {place.blogs && place.blogs.length > 0 && <span class="card__blog-flag">b</span>}
                    {place.personalNote && <span class="card__personal-note-flag">p</span>}
                    </Card>)}
            </CardGrid>
        </Page>
    )
};
