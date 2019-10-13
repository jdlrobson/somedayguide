import preact, { h, cloneElement } from 'preact';

export default function ( { children } ) {
    return (
        <div class="card-grid">
            {children.map((child) => cloneElement(child, { modifier: 'card-grid' }))}
        </div>
    );
};
