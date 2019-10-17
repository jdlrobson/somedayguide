import preact, { h } from 'preact';

export default function ( { children, title, id } ) {
    return (
        <div class="box" id={id}>
            <div class="box__title">{title}</div>
            <div class="box__content">
            {children}
            </div>
        </div>
    );
};
