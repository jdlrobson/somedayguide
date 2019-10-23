
import { hide, empty, accentFold, matches, titleToLink } from './utils';
import cardlist from './cardlist.js';
const IMG_PREFIX = '//upload.wikimedia.org/wikipedia/commons/';

export default function searchoverlay(searchindex) {
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
