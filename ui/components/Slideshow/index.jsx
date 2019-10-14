import preact, { h } from 'preact';

const getHref = (titleOrUrl) => {
    if( titleOrUrl.indexOf('https') === -1 ) {
        return `https://commons.wikimedia.org/wiki/${titleOrUrl}`;
    } else {
        return titleOrUrl;
    }
};
export default function ( {slides} ) {
    return (
        <div class="slideshow">
            {slides.map(({src, href})=>{
                if ( !href ) {
                    console.log('\n\nMissing href for ' + src);
                }
                return <div class="slideshow__slide"
                    style={{'background-image': `url(${src})`}}>
                    {href && <a class="slideshow__slide__caption"
                        href={getHref(href)}>
                        Source: Wikimedia commons
                    </a>}
                </div>
            })}
        </div>
    );
};
