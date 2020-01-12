import preact, { h } from 'preact';
import Note from './Note';

export default function () {
    return <Note isprivate={true} id="local-edit">
        <h4 class="note__heading">Your notes (private)</h4>
        <p contentEditable class="note__editable">What's on your mind? (you can type here notes just for you and they will show on your <a href="/dashboard">dashboard</a>)</p>
    </Note>
}
