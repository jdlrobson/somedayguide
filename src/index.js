import loadJS from 'fg-loadjs';
import './index.css';

let searchindex = false;
let maploaded = false;
let mapdisplayed = false;
const LOCAL_NOTE = window.location.pathname;
const IMG_PREFIX = '//upload.wikimedia.org/wikipedia/commons/';

window.loadJS = loadJS;

function hide(overlay, visibility) {
    if ( visibility ) {
        overlay.style.visibility = 'hidden';
    } else {
        overlay.style.display = 'none';
    }
}

function show(overlay, visibility) {
    if ( visibility ) {
        overlay.style.visibility = 'visible';
    } else {
        overlay.style.display = '';
    }
}

function empty(node) {
    while ( node.firstChild ) {
        node.removeChild( node.firstChild );
    }
}

/**
 * Fold accents in a string
 * @param {string} str
 * @return {string}
 */
function accentFold(str) {
    return str.replace(/[éēěè]/g, 'e' )
        .replace(/[àāǎá]/g, 'a' )
        .replace(/[ǒóōòô]/g, 'o' )
        .replace(/[ūǚúùǔ]/g, 'u' )
        .replace(/[īìíǐ]/g, 'i' );
}

function matches(str) {
    return function ( obj ) {
        return accentFold(obj[0]).indexOf(str) > -1;
    }
}

function titleToLink(title, root) {
    return `${root}/${encodeURIComponent(title)}`;
}

function cardlist(links) {
    const ul = document.createElement('ul');
    ul.innerHTML = `${links.map(({ title, url, thumbnail }, i) => `<li class="cardlist__item">
    <div class="cardlist__item__thumb" style="background-image:url(${thumbnail});"></div>
    <a class="cardlist__item__link" href="${url}">${title}</a>`).join('')}`;
    return ul;
}

function searchoverlay() {
    const overlay = document.createElement('div');
    overlay.setAttribute('class', 'overlay overlay--search');
    overlay.innerHTML = `
        <div class="overlay__mask"></div>
        <div class="overlay__content">
            <input placeholder="Where do you want to go today?" class="overlay__input">
            <div class="overlay__results"></div>
        </div>
    `;
    const resultsNode = overlay.querySelector('.overlay__results');
    const mask = overlay.querySelector('.overlay__mask');
    const input = overlay.querySelector('input');
    mask.addEventListener('click', function ( ev ) {
        input.value = '';
        empty(resultsNode);
        hide(overlay);
    });
    input.addEventListener('input', (ev) => {
        const
            matchFn = matches(accentFold(ev.target.value.toLowerCase())),
            results = searchindex.countries.filter(matchFn).map((obj) => {
                    const t = decodeURIComponent(obj[0]).replace(/_/g, ' ');
                    return {
                        title: t,
                        thumbnail: `${IMG_PREFIX}${obj[1]}`,
                        url: titleToLink(t, '/country')
                    };
                })
                .concat(
                    searchindex.destinations.filter(matchFn).map((obj) => {
                        const t = decodeURIComponent(obj[0]).replace(/_/g, ' ');
                        return {
                            title: t,
                            thumbnail: `${IMG_PREFIX}${obj[1]}`,
                            url: titleToLink(t, '/destination')
                        };
                    })
                );
        empty(resultsNode);
        resultsNode.appendChild(cardlist(results, '/country'));
    });
    hide(overlay);
    document.body.appendChild(overlay);
    return overlay;
}

// Setup climate
document.querySelectorAll('.climate__select').forEach( function ( climate ) {
    climate.removeAttribute('disabled');
    climate.addEventListener('change', function () {
        this.setAttribute('value', this.value);
    });
} );

function setup() {
    if (!searchindex) {
        searchindex = { countries: [], destinations: [] };
        return fetch('/index.json').then((resp) => resp.json()).then((json)=>{
            searchindex = json;
        });
    } else {
        return Promise.resolve();
    }
}

// Enable search
if ( fetch ) {
    const search = searchoverlay();
    document.querySelectorAll('.map__search').forEach((node) => {
        node.addEventListener('click', (ev) => {
            setup();
            show(search);
            const input = search.querySelector('input');
            input.focus();
            window.scrollTo(0,0);
            ev.stopPropagation();
            ev.preventDefault();
        });
    })
}

function togglemap() {
    const map = document.querySelector('.map');
    const overlay = map.querySelector('.map__overlay');
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
        setup().then( function () {
            loadJS('/map.js', function () {
                window.initMap(data, titleToLink, searchindex.destinations);
            });
            maploaded = true;
        });
    } else {
        togglemap();
    }
});


function setupLocalEditing() {
    const localNote = document.querySelector('#local-edit [contenteditable]'),
        note = localStorage.getItem(LOCAL_NOTE);
    if (note && localNote) {
        localNote.textContent = note;
        localNote.addEventListener('input', function (ev) {
            localStorage.setItem(LOCAL_NOTE, this.textContent);
        })
    }
}
setupLocalEditing();
