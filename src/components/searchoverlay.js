
import { hide, empty, accentFold, titleToLink } from './utils';
import cardlist from './cardlist.js';

function isDestination(str) {
    return str.indexOf(':') === -1;
}

function matches(str) {
    return function (otherStr) {
        const strToMatch = !isDestination(otherStr) ? otherStr.split(':')[1] : otherStr;
        return accentFold(strToMatch).indexOf(str) === 0;
    }
}

export default function searchoverlay(searchindex, ifNoResults) {
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
    function doSearch(matchFn, tryAgain) {
        const
            results = searchindex.filter(matchFn).map((str) => {
                    let prefix, title, url, tmp, thumbnail;
                    if (isDestination(str)) {
                        title = str;
                        prefix = '/destination';
                        url = titleToLink(title, prefix);
                        thumbnail = `/thumbnails${prefix}/${title}`;
                    } else if (str[0] === 'c') {
                        title = str.slice(2);
                        prefix = '/country';
                        url = titleToLink(title, prefix);
                        thumbnail = `/thumbnails${prefix}/${title}`;
                    } else if (str[0] === 's') {
                        tmp = str.split(':');
                        title = `${tmp[1]} (${tmp[2]})`;
                        prefix = '/destination';
                        url = titleToLink(tmp[2], prefix);
                        thumbnail = `/thumbnails${prefix}/${tmp[2]}`;
                    }
                    return {
                        title, thumbnail, url
                    };
                }).slice(0, 10);
        if (results.length === 0 && !tryAgain) {
            ifNoResults(searchindex).then(function () {
                doSearch(matchFn, true);
            });
        }
        empty(resultsNode);
        resultsNode.appendChild(cardlist(results, '/country'));
    }
    input.addEventListener('input', (ev) => {
        const matchFn = matches(accentFold(ev.target.value.toLowerCase()));
        doSearch(matchFn);
    });
    hide(overlay);
    document.body.appendChild(overlay);
    return overlay;
}
