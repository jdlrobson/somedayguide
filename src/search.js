import searchoverlay from './components/searchoverlay.js';
import { show } from './components/utils';

let loadedAdditionalSearch;
window.initSearch = function (index) {
    const search = searchoverlay(index, function () {
        if (loadedAdditionalSearch) {
            return Promise.resolve();
        }
        loadedAdditionalSearch = true;
        return fetch('/index--sights.json').then((r) => r.json())
            .then((sights) => {
                return index.concat(sights);
            })
    });
    show(search);
    const input = search.querySelector('input');
    input.focus();
    window.scrollTo(0,0);
};
