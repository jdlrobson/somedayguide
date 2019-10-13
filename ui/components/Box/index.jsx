import preact, { h } from 'preact';

export default function ( { children, title } ) {
    return (
        <div class="box">
            <div class="box__title">{title}</div>
            <div class="box__content">
            {children}
            </div>
        </div>
    );
};
