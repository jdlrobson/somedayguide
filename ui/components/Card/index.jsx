import preact, { h } from 'preact';

const getClassName = (className, modifier, additional) => {
    return [ className, modifier && `${className}--${modifier}`, additional ].filter((c)=>c !== undefined).join(' ');
}

export default function ( { title, href, lat, lon, summary, thumbnail, modifier, description } ) {
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
            <div class={getClassName('card__text', modifier, 'geo')}>
                <h3 class={getClassName('card__text__heading')}>{title.replace(/_/g, ' ')}</h3>
                <p class={getClassName('card__text__summary', modifier)}>
                    {description || summary}
                </p>
                <span class={getClassName('card__text__geodata', modifier, 'geodata')}>
                    <span class='latitude'>{lat}</span>
				    <span class='longitude'>{lon}</span>
                </span>
            </div>
        </div>
    );
};
