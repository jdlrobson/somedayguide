import searchoverlay from './components/searchoverlay.js';
import { show } from './components/utils';

let loadedAdditionalSearch;
window.initSearch = function (index) {
    const search = searchoverlay(index, function () {
        if (loadedAdditionalSearch) {
            return;
        }
        loadedAdditionalSearch = true;
        return fetch('/index--sights.json').then((r) => r.json())
            .then((sights) => {
                Object.keys(sights).forEach((s) => {
                    sights[s].forEach((d) => {
                        index.push(`s:${s}:${d}`)
                    });
                });
            })
    });
    show(search);
    const input = search.querySelector('input');
    input.focus();
    window.scrollTo(0,0);
};
