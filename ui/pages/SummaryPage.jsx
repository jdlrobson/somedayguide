import preact, { h } from 'preact';
import Page from './Page';
import Note from '../components/Note';

const titleToItem = (t) => <li><a href={`/destination/${t}`}>{t}</a></li>;

const SummaryPage = ( { no_climate, lacking_sights, lacking_gonext } ) => {
    return <Page>
        <Note>
            <h1>Summary</h1>
        </Note>
        <div>
            <Note>
                <h2>No climate data</h2>
                {
                    <ul>{no_climate.map(titleToItem)}</ul>
                }
            </Note>
            <Note>
                <h2>No sights</h2>
                {
                    <ul>{lacking_sights.map(titleToItem)}</ul>
                }
            </Note>
            <Note>
                <h2>No go next</h2>
                {
                    <ul>{lacking_gonext.map(titleToItem)}</ul>
                }
            </Note>
        </div>
    </Page>
};

export default SummaryPage;
