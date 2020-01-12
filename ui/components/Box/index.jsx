import preact, { h } from 'preact';
import  { getClassName } from '../utils';

export default function ( { children, title, id, modifiers = [] } ) {
    return (
        <div class="box" id={id}>
            <div class="box__title">{title}</div>
            <div class={getClassName('box__content', modifiers)}>
                {children}
            </div>
        </div>
    );
};
