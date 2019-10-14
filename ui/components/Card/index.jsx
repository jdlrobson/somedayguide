import preact, { h } from 'preact';

const getClassName = (className, modifier) => {
    return [ className, modifier && `${className}--${modifier}` ].filter((c)=>c !== undefined).join(' ');
}

export default function ( { title, href, summary, thumbnail, modifier, description } ) {
    return (
        <div class={getClassName('card', modifier)}>
            <a class="card__link" href={href || `/destination/${title}.html`} aria-hidden="true"></a>
            <div class={getClassName('card__thumb', modifier)}
                style={
                    thumbnail ? {
                        'background-image': `url(${thumbnail})`
                    } : {}
                }
            ></div>
            <div class={getClassName('card__text', modifier)}>
                <h3 class={getClassName('card__text__heading')}>{title.replace(/_/g, ' ')}</h3>
                <p class={getClassName('card__text__summary', modifier)}>
                    {description || summary}
                </p>
            </div>
        </div>
    );
};
