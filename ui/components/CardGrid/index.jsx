import preact, { h, cloneElement } from 'preact';

export default function ( { children, id } ) {
    return (
        <div class="card-grid" id={id}>
            {children.map((child) => cloneElement(child, { modifier: 'card-grid' }))}
        </div>
    );
};
