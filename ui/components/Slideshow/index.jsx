import preact, { h } from 'preact';

export default function ( {slides} ) {
    return (
        <div class="slideshow">
            {slides.map(({src, href})=>{
                return <div class="slideshow__slide"
                    style={{'background-image': `url(${src})`}}>
                    <a class="slideshow__slide__caption"
                        href={href}>
                        Source: Wikimedia commons
                    </a>
                </div>
            })}
        </div>
    );
};
