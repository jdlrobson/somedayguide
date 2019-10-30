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
                window.initMap(data, titleToLink, index.destinations);
            });
            maploaded = true;
        });
    } else {
        togglemap();
    }
});

function setupSlideshow() {
    const slideshow = document.querySelector('.slideshow');
    const leftArrow = document.createElement('div');
    leftArrow.setAttribute('class', 'slideshow__arrow--left');
    const rightArrow = document.createElement('div');
    rightArrow.setAttribute('class', 'slideshow__arrow--right');
    slideshow.prepend(leftArrow);
    slideshow.appendChild(rightArrow);
    const data = document.querySelector('.map__launch-icon').dataset;
    const handleCarousel = carouselClickhandler(
        document.querySelector('.slideshow__slide'),
        data.lat, data.lon
    );
    leftArrow.addEventListener('click', handleCarousel);
    rightArrow.addEventListener('click', handleCarousel);
}

localediting();

setupSlideshow();