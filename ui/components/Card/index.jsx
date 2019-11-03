import preact, { h } from 'preact';

const getClassName = (className, modifier, additional) => {
    return [ className, modifier && `${className}--${modifier}`, additional ].filter((c)=>c !== undefined).join(' ');
}

function toFriendlyDistance(km) {
    if ( km < 1 ) {
        return `${Math.floor(km * 1000)}m`
    } else if (km < 10) {
        return `${km.toFixed(1)}km`
    } else {
        return `${Math.floor(km)}km`
    }
}

export default function ( { title, distance, href,
        lat, lon, summary, thumbnail, modifier, description, children } ) {
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
                { distance !== undefined && <p class={getClassName('card__text__distance', modifier)}>
                    {toFriendlyDistance(distance)}
                </p>}
                <span class={getClassName('card__text__geodata', modifier, 'geodata')}>
                    <span class='latitude'>{lat}</span>
				    <span class='longitude'>{lon}</span>
                </span>
            </div>
            {children}
        </div>
    );
};
