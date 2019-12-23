import preact, { h } from 'preact';
import Page from './Page';
import Note from '../components/Note';

const OfflinePage = () => {
    return <Page>
        <Note>
            <h2 class="note__heading">Page not available offline.</h2>
            <p>
                <a href="/dashboard">View dashboard.</a>
            </p>
        </Note>
    </Page>
};

export default OfflinePage;
