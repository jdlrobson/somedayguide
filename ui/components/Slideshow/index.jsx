import preact, { h } from 'preact';

const getHref = (titleOrUrl) => {
    if( titleOrUrl.indexOf('https') === -1 ) {
        return `https://commons.wikimedia.org/wiki/File:${titleOrUrl}`;
    } else {
        return titleOrUrl;
    }
};
export default function ( {slides, commons} ) {
    return (
        <div class="slideshow" data-commons={commons}>
            {slides && slides.map(({src, href})=>{
                return <div class="slideshow__slide"
                    style={{'background-image': `url(${src})`}}>
                    {href && <a class="slideshow__slide__caption"
                        href={getHref(href)}>
                        Source: Wikimedia commons
                    </a>}
                </div>
            })}
            {slides.length === 0 && <div class="slideshow__slide">
                    <a class="slideshow__slide__caption"></a>
                </div>}
        </div>
    );
};
