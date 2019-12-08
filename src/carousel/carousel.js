const LIMIT = 50;
// List of phrases we do not want to see in categories
const CATEGORY_BLACKLIST = [
    'universities and colleges',
    'player',
    'science',
    'protests',
    'demonstrations',
    'for the common good',
    'media of',
    'to be categorised',
    'svg ',
    'zoology',
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
let subcategories = [];
const COMMONS_API = 'https://commons.wikimedia.org/w/api.php?action=query&origin=*&formatversion=2&format=json';

function extractImages(data) {
    const imagePages = data && data.query && data.query.pages || [];
    allImages = allImages.concat(
        imagePages.filter( ( page ) =>
            !hasForbiddenCategory(
                    ( page.categories || [] ).map( cat => cat.title )
            )
            // Note: when using categorymembers - a member may be another category!
            && page.thumbnail
        ).map( ( page ) => {
            const thumb = page.thumbnail;
            return {
                thumbnail__source: `${page.title.replace( / /g, '_' )}`,
                thumbnail: thumb.source
            };
        } )
    );
    return data;
}

function extractSubCategories(data) {
    subcategories = subcategories.concat(
        ( data && data.query && data.query.pages || [] ).filter((page) => page.thumbnail === undefined)
            .map((page) => page.title)
    );
    return data;
}

function loadImagesFromCategory(category) {
    const url = `${COMMONS_API}&prop=pageimages&generator=categorymembers&piprop=thumbnail%7Cname&pithumbsize=320&pilimit=50&gcmtitle=${encodeURIComponent(category)}&gcmlimit=50`;
    return fetch(url)
        .then(( resp )=>resp.json())
        .then(extractImages)
        .then(extractSubCategories)
}

function loadImagesFromLocation(lat, lon) {
    allImages = [];
    const url = `${COMMONS_API}&prop=pageimages%7Ccategories&generator=geosearch&pithumbsize=400&pilimit=${LIMIT}&cllimit=max&ggscoord=${lat}%7C${lon}&ggsradius=10000&ggslimit=${LIMIT}&ggsnamespace=6`;
    return fetch(url)
        .then(( resp )=>resp.json())
        .then(extractImages);
}

function slide(element, increment) {
    const sourceElement = element.querySelector('.slideshow__slide__caption');
    index = index + increment;
    // if we scrolled through half the images fetch some more if available!
    if (subcategories.length && index > allImages.length / 2) {
        loadImagesFromCategory(subcategories.pop());
    }
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
    // prefetch the next
    if (allImages[index + 1 ]) {
        const img = document.createElement('img');
        img.src = allImages[index + 1 ].thumbnail;
    }
}

export default function carouselClickhandler(element, lat, lon, commonscategory) {
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
            if ( commonscategory ) {
                loadImagesFromCategory(`Category:${commonscategory}`).then(() => {
                    if (allImages.length === 0) {
                        element.previousSibling.parentNode.removeChild(element.previousSibling);
                        element.nextSibling.parentNode.removeChild(element.nextSibling);
                    }
                    slide(element, increment);
                });
            } else {
                loadImagesFromLocation(lat, lon).then(() => {
                    if (allImages.length === 0) {
                        element.previousSibling.parentNode.removeChild(element.previousSibling);
                        element.nextSibling.parentNode.removeChild(element.nextSibling);
                    }
                    slide(element, increment);
                });
            }
        } else {
            slide(element, increment);
        }
    };
}