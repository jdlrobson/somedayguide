import loadJS from 'fg-loadjs';
import './index.css';
import localediting from './localediting.js';
import searchindex from './searchindex.js';
import { show, hide, titleToLink } from './components/utils';
import './index--js.css';
import carouselClickhandler from './carousel/carousel.js';

let maploaded = false;
let mapdisplayed = false;

// Setup climate
document.querySelectorAll('.climate__select').forEach( function ( climate ) {
    climate.removeAttribute('disabled');
    climate.addEventListener('change', function () {
        this.setAttribute('value', this.value);
    });
} );

// Enable search
if ( fetch ) {
    document.querySelectorAll('.map__search').forEach((node) => {
        node.addEventListener('click', (ev) => {
            searchindex().then(function (index) {
                loadJS('/search.js', function () {
                    window.initSearch(index);
                });
            });
            ev.stopPropagation();
            ev.preventDefault();
        });
    })
}

function togglemap() {
    const map = document.querySelector('.map');
    const overlay = map.querySelectorAll('.map__overlay');
    const canvas = map.querySelector('.map__canvas');
    if ( mapdisplayed ) {
        show(overlay, true);
        hide(canvas, true);
    } else {
        hide(overlay, true);
        show(canvas, true);
    }
    mapdisplayed = !mapdisplayed;
}

document.querySelector('.map__launch-icon').addEventListener('click', function () {
    const data = this.dataset;

    if ( !maploaded ) {
        togglemap();
        searchindex().then(function (index) {
            loadJS('/map.js', function () {
                window.initMap(data, titleToLink, index);
            });
            maploaded = true;
        });
    } else {
        togglemap();
    }
});

function setupSlideshow(slideshow, handleCarousel) {
    const childNodes = Array.from(slideshow.childNodes);
    childNodes.slice(1).forEach((node) => { node.style.display = 'none'; })
    let range = childNodes.length;
    let index = 0;
    let lastIndex = 0;
    const normalise = () => {
        if (index > range - 1) {
            index = 0;
        }
        if (index < 0) {
            index = range - 1;
        }
    };
    const leftArrow = document.createElement('div');
    leftArrow.setAttribute('class', 'slideshow__arrow--left');
    const rightArrow = document.createElement('div');
    rightArrow.setAttribute('class', 'slideshow__arrow--right');
    slideshow.prepend(leftArrow);
    slideshow.appendChild(rightArrow);
    leftArrow.addEventListener('click', (ev) => {
        lastIndex = index;
        index--;
        normalise(index);
        handleCarousel(ev, childNodes[lastIndex], childNodes[index]);
    });
    rightArrow.addEventListener('click', (ev) => {
        lastIndex = index;
        index++;
        normalise(index);
        handleCarousel(ev, childNodes[lastIndex], childNodes[index]);
    });
}

function setupCommonsSlideshow(slideshow) {
    if ( slideshow ) {
        const data = document.querySelector('.map__launch-icon').dataset;
        const handleCarousel = carouselClickhandler(
            slideshow.querySelector('.slideshow__slide'),
            data.lat, data.lon, slideshow.dataset.commons
        );
        setupSlideshow(slideshow, handleCarousel);
    }
}

localediting();
setupCommonsSlideshow(document.querySelector('.slideshow--commons'));
document.querySelectorAll('.slideshow--ig').forEach((node) => {
    setupSlideshow(node, function (ev, lastNode, node) {
        lastNode.style.display = 'none';
        node.style.display = 'block';
    })
})

const nature = document.querySelector('#nature button');
function setupNature(btn) {
    btn.addEventListener('click', function () {
        loadJS('/inat.js');
    });
    // load after 5s.
    setTimeout(function () {
        loadJS('/inat.js');
    }, 5000);
}

if ( nature ) {
    setupNature(nature);
}

if('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('/sw.js')
             .then(function() { console.log("Service Worker Registered"); });
}
