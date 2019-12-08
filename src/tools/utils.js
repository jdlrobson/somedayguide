function isNodeEmpty( node ) {
	const text = node && node.textContent && node.textContent.replace( /[↵ \n\t]/gi, '' );
	return text.trim().length === 0;
}

/**
 * 
 * @param {Element} document containing html
 * @param {string} selector
 * @param {boolean} [doNotRemove]
 */
export function extractElements( document, selector, doNotRemove ) {
	var extracted = [];

	Array.prototype.forEach.call( document.querySelectorAll( selector ), function ( node ) {
		var parentNode = node.parentNode;
		extracted.push( node );
		if ( !doNotRemove ) {
			parentNode.removeChild( node );
			if ( isNodeEmpty( parentNode ) && parentNode.parentNode ) {
				parentNode.parentNode.removeChild( parentNode );
			}
		}
	} );
	return {
		extracted: extracted,
		document: document,
		// if body is empty it will also be removed!
		html: document.body ? document.body.innerHTML : ''
	};
}