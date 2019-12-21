import preact, { h } from 'preact';
import Page from '../Page';
import Note from '../../components/Note';

export default function ( {} ) {
    return (
        <Page subtitle='we will find'
            title='this page.'>
            <Note>This page doesn't exist yet. Sorry about that.</Note>
        </Page>
    )
};
