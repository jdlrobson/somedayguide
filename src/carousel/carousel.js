const LIMIT = 50;
// List of phrases we do not want to see in categories
const CATEGORY_BLACKLIST = [
    'cars',
    'insects on ',
    'airport',
    // a favorite activity but not interesting
    'footprints on sand',
    'aircraft',
    'aviation',
    'airbus'
];

export function hasForbiddenCategory( categories ) {
    return categories.filter( ( title ) => {
            // Filter list of categories to ones that we like
            const lc = title.toLowerCase();
            return CATEGORY_BLACKLIST.filter( bad => lc.indexOf( bad ) > -1 ).length;
    } ).length > 0;
}

let index = 0;
let allImages;

function loadImages(lat, lon,) {
    allImages = [];
    const url = `https://commons.wikimedia.org/w/api.php?action=query&origin=*&formatversion=2&format=json&prop=pageimages%7Ccategories&generator=geosearch&pithumbsize=400&pilimit=${LIMIT}&cllimit=max&ggscoord=${lat}%7C${lon}&ggsradius=10000&ggslimit=${LIMIT}&ggsnamespace=6`;
    return fetch(url)
        .then( ( resp )=>resp.json() )
        .then( ( data ) => {
            const imagePages = data && data.query && data.query.pages || [];
            allImages = allImages.concat(
                imagePages.filter( ( page ) =>
                    !hasForbiddenCategory(
                            ( page.categories || [] ).map( cat => cat.title )
                    )
                ).map( ( page ) => {
                    const thumb = page.thumbnail;
                    return {
                        thumbnail__source: `${page.title.replace( / /g, '_' )}`,
                        thumbnail: thumb.source
                    };
                } )
            );
        } );
}

function slide(element, increment) {
    const sourceElement = element.querySelector('.slideshow__slide__caption');
    index = index + increment;
    if (index > allImages.length - 1) {
        index = 0;
    } else if ( index < 0 ) {
        index = allImages.length - 1;
    }
    const image = allImages[index];
    if ( image ) {
        element.style['background-image'] = `url(${image.thumbnail})`;
        sourceElement.setAttribute('href', `https://commons.wikimedia.org/wiki/${image.thumbnail__source}`);
        sourceElement.textContent = 'Source: Wikimedia commons';
    }
}

export default function carouselClickhandler(element, lat, lon) {
    const currentImage = element.style['background-image'] || '';
    const thumbnail = currentImage.replace('url(\"','').slice(0, -2);
    const sourceElement = element.querySelector('.slideshow__slide__caption');
    const thumbnail__source = sourceElement.getAttribute('href');

    return (ev) => {
        const increment = ev.target.getAttribute('class') === 'slideshow__arrow--right' ? 1 : -1;
        if (allImages === undefined) {
            allImages = [
                {
                    thumbnail,
                    thumbnail__source
                }
            ];
            loadImages(lat, lon).then(() => {
                if (allImages.length === 0) {
                    element.previousSibling.parentNode.removeChild(element.previousSibling);
                    element.nextSibling.parentNode.removeChild(element.nextSibling);
                }
                slide(element, increment);
            });
        } else {
            slide(element, increment);
        }
    };
}