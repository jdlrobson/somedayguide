import searchoverlay from './components/searchoverlay.js';
import { show } from './components/utils';

window.initSearch = function (index) {
    const search = searchoverlay(index);
    show(search);
    const input = search.querySelector('input');
    input.focus();
    window.scrollTo(0,0);
};
