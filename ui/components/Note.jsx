import preact, { h } from 'preact';

export default function ( { children, isprivate, id }) {
    const className = isprivate ? 'somedaynotenote--private' : 'somedaynote';
    return <div id={id} class={className}>{children}</div>
}