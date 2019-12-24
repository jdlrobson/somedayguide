export function hide(overlay, visibility) {
    if ( overlay.length ) {
        overlay.forEach(function (node) {
            hide(node, visibility);
        });
    } else {
        if ( visibility ) {
            overlay.style.visibility = 'hidden';
        } else {
            overlay.style.display = 'none';
        }
    }
}

export function show(overlay, visibility) {
    if ( overlay.length ) {
        overlay.forEach(function (node) {
            show(node, visibility);
        });
    } else {
        if ( visibility ) {
            overlay.style.visibility = 'visible';
        } else {
            overlay.style.display = '';
        }
    }
}

export function empty(node) {
    while ( node.firstChild ) {
        node.removeChild( node.firstChild );
    }
}

/**
 * Fold accents in a string
 * @param {string} str
 * @return {string}
 */
export function accentFold(str) {
    return str.replace(/[éēěè]/g, 'e' )
        .replace(/[åàāǎáã]/g, 'a' )
        .replace(/ñ/g, 'n')
        .replace(/[ǒóōòô]/g, 'o' )
        .replace(/[ūǚúùǔ]/g, 'u' )
        .replace(/[īìíǐ]/g, 'i' );
}

export function titleToLink(title, root) {
    return `${root}/${encodeURIComponent(title)}`;
}
