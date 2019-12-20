import preact, { h } from 'preact';
import Slideshow from './index';

const getHref = (titleOrUrl) => {
    if( titleOrUrl.indexOf('https') === -1 ) {
        return `https://commons.wikimedia.org/wiki/File:${titleOrUrl}`;
    } else {
        return titleOrUrl;
    }
};

const CommonsSlideShow = ( { commons, slides } ) => {
    return <Slideshow commons={commons} className="slideshow--commons">
        {
            slides.map(({src, href})=>{
                return <div class="slideshow__slide"
                    style={{'background-image': `url(${src})`}}>
                    {href && <a class="slideshow__slide__caption"
                        href={getHref(href)}>
                        Source: Wikimedia commons
                    </a>}
                </div>
            })
        }
    </Slideshow>
};

export default CommonsSlideShow;
