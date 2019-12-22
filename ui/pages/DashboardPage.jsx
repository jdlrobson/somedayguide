import preact, { h } from 'preact';
import Page from './Page';
import Note from '../components/Note';

const DashboardPage = (props) => {
    return <Page>
        <Note>
            <h1>My Dashboard</h1>
        </Note>
        <div id="dashboard">
            <noscript>This page requires JavaScript</noscript>
        </div>
    </Page>
};

export default DashboardPage;
