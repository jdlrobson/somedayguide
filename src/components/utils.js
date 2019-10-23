export function hide(overlay, visibility) {
    if ( visibility ) {
        overlay.style.visibility = 'hidden';
    } else {
        overlay.style.display = 'none';
    }
}

export function show(overlay, visibility) {
    if ( visibility ) {
        overlay.style.visibility = 'visible';
    } else {
        overlay.style.display = '';
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
        .replace(/[àāǎá]/g, 'a' )
        .replace(/[ǒóōòô]/g, 'o' )
        .replace(/[ūǚúùǔ]/g, 'u' )
        .replace(/[īìíǐ]/g, 'i' );
}

export function matches(str) {
    return function ( obj ) {
        return accentFold(obj[0]).indexOf(str) > -1;
    }
}

export function titleToLink(title, root) {
    return `${root}/${encodeURIComponent(title)}`;
}
