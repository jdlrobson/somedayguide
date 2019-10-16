// https://github.com/filamentgroup/loadCSS
!function(e){"use strict"
var n=function(n,t,o){function i(e){return f.body?e():void setTimeout(function(){i(e)})}var d,r,a,l,f=e.document,s=f.createElement("link"),u=o||"all"
return t?d=t:(r=(f.body||f.getElementsByTagName("head")[0]).childNodes,d=r[r.length-1]),a=f.styleSheets,s.rel="stylesheet",s.href=n,s.media="only x",i(function(){d.parentNode.insertBefore(s,t?d:d.nextSibling)}),l=function(e){for(var n=s.href,t=a.length;t--;)if(a[t].href===n)return e()
setTimeout(function(){l(e)})},s.addEventListener&&s.addEventListener("load",function(){this.media=u}),s.onloadcssdefined=l,l(function(){s.media!==u&&(s.media=u)}),s}
"undefined"!=typeof exports?exports.loadCSS=n:e.loadCSS=n}("undefined"!=typeof global?global:this)


let searchindex = false;

function hide(overlay) {
    overlay.setAttribute('style', 'display:none');
}

function show(overlay) {
    overlay.setAttribute('style', '');
}

function empty(node) {
    while ( node.firstChild ) {
        node.removeChild( node.firstChild );
    }
}
function matches(str) {
    return function ( title ) {
        return title.toLowerCase().indexOf(str) > -1;
    }
}

function titleToLink(title, root) {
    return `${root}/${encodeURIComponent(title)}`;
}

function cardlist(links) {
    const ul = document.createElement('ul');
    ul.innerHTML = `${links.map(({ title, url }) => `<li class="cardlist__item">
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
            matchFn = matches(ev.target.value.toLowerCase()),
            results = searchindex.countries.filter(matchFn).map((title) => {
                    const t = decodeURIComponent(title).replace(/_/g, ' ');
                    return {
                        title: t,
                        url: titleToLink(t, '/country')
                    };
                })
                .concat(
                    searchindex.destinations.filter(matchFn).map((title) => {
                        const t = decodeURIComponent(title).replace(/_/g, ' ');
                        return {
                            title: t,
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


if ( fetch ) {
    const search = searchoverlay();
    document.querySelectorAll('.map__search').forEach((node) => {
        node.addEventListener('click', (ev) => {
            show(search);
            if (!searchindex) {
                searchindex = { countries: [], destinations: [] };
                loadCSS('/index--js.css');
                fetch('/index.json').then((resp) => resp.json()).then((json)=>{
                    searchindex = json;
                });
            }
            const input = search.querySelector('input');
            input.scrollIntoView();
            setTimeout( function () {
                input.focus();
            }, 0 );
            ev.stopPropagation();
            ev.preventDefault();
        });
    })
}