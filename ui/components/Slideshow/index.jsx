import preact, { h } from 'preact';

export default function ( {children, commons, className} ) {
    const slides = children || [];
    return (
        <div class={`slideshow ${className}`} data-commons={commons}>
            {slides}
            {slides.length === 0 && <div class="slideshow__slide">
                    <a class="slideshow__slide__caption"></a>
                </div>}
        </div>
    );
};
