import { extractElements } from './utils';
const MONTHS = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

/**
 * @param {number} val
 * @rturn {string}
 */
function fix( num ) {
	return parseFloat( num.toFixed( 1 ), 10 );
}

/**
 * @param {number} val
 * @rturn {string}
 */
export function fromFahrenheitToCelcius( val ) {
	return fix( ( val - 32 ) * 5 / 9 );
}

/**
 * @param {number} val
 * @rturn {string}
 */
export function fromInchesToMm( val ) {
	return val ? fix( val / 0.0393700787402 ) : undefined;
}

/**
 * Check if imperial in a lazy fashion and convert to celcius
 * @param {Object} data
 * @rturn {Object}
 */
function checkImperial( data ) {
	// assuming that over 58C is pretty hot, so it will be F.
	const negTemps = data.filter( ( row ) => row.high < 0 || row.low < 0 ).length > 0;
	const imperial = !negTemps && data.filter( ( row ) => row.high > 55 ).length > 0;

	if ( imperial ) {
		return data.map( ( row ) => {
			return Object.assign( {}, row, {
				high: fromFahrenheitToCelcius( row.high ),
				low: fromFahrenheitToCelcius( row.low ),
				precipitation: fromInchesToMm( row.precipitation )
			} );
		} );
	} else {
		return data;
	}
}

/**
 * 
 * @param {Object} climate object
 * @param {string} title of page
 * @return {string} of wikitext
 */
export function climateToWikiText( climate, title ) {
	let text = '{{Climate|\n';
	climate.forEach( ( month ) => {
		const monthKey = month.heading.toLowerCase();
		Object.keys( month ).filter( ( key ) => key !== 'heading' ).forEach( ( key ) => {
			// map to param name
			const param = monthKey + key.replace( 'itation', '' );
			text += '\n|' + param + ' = ' + month[ key ];
		} );
	} );
	text += `\n|description=Source: [[w:${title}#Climate|Wikipedia]]\n`;
	return text + '}}';
}

/**
 * @param {Document} document 
 * @param {string} text 
 * @return {Element}
 */
function nodeWithHTML( document, text ) {
	const node = document.createElement('div');
	node.innerHTML = text;
	return node;
}

function extractFromTable(table) {
	const rows = table.querySelectorAll( 'tr' );
	let secondRow = rows[ 1 ];
	if ( !secondRow ) {
		return null;
	}
	const columns = secondRow.querySelectorAll('td');
	// correction for ukranian wikipedia
	if ( columns && columns[1] && columns[1].textContent === 'Л' ) {
		secondRow = rows[2];
	}
	const data = Array.from( secondRow.querySelectorAll( 'td' ) ).map( ( col, i ) => {
		const spans = col.querySelectorAll( 'span,small' );
		const values = Array.from( spans ).map( ( span ) => span.textContent )
			.filter( ( val ) => val.trim() !== '' )
			// convert minus like characters to Math compatible.
			.map((s) => s.replace(/[−]/, '-'));

		return {
			heading: MONTHS[ i ],
			precipitation: parseFloat( values[ 0 ] ),
			high: parseInt( values[ 1 ], 10 ),
			low: parseInt( values[ 2 ], 10 )
		};
	} );
	if ( data.length ) {
		return checkImperial( data );
	}
}
/**
 * 
 * @param {Element} element
 */
export function climateExtractionNew( element ) {
	let ext = extractElements( element, [
		'.climate-table table.infobox table.infobox',
		'.wikitable',
		// e.g. Taganga (Template:climate chart)
		'table.infobox table.infobox'
	].join( ',' ) );
	if ( ext.extracted.length > 0 ) {
		return extractFromTable(ext.extracted[ 0 ]);
	} else {
		// last ditch effort e.g. ukranian wikipedia
		ext = extractElements( element, 'table' );
		if ( ext.extracted.length === 1 ) {
			return extractFromTable(ext.extracted[ 0 ]);
		}
	}
	return;
}

/**
 * @param {Document} document 
 * @param {string} text representing HTML
 */
export function climateExtractionWikipedia( document, text ) {
	const matches = extractElements( nodeWithHTML( document, text ), 'table tr' );
	let climate = [];
	matches.extracted.forEach( ( tr ) => {
		const th = Array.from( tr.querySelectorAll( 'th' ) );
		const td = Array.from( tr.querySelectorAll( 'td' ) );
		if ( climate.length === 0 && th.length === 14 ) {
			climate = th.map( ( th ) => ( { heading: th.textContent.trim() } ) ).slice( 1, 13 );
		} else if ( th.length === 1 ) {
			const legend = th[ 0 ].textContent.toLowerCase();
			const vals = td.slice( 0, 12 );
			let key;
			if ( legend.indexOf( 'average high' ) > -1 ) {
				key = 'high';
			} else if ( legend.indexOf( 'average low' ) > -1 ) {
				key = 'low';
			} else if (
				legend.indexOf( 'rainfall' ) > -1 ||
				legend.indexOf( 'average precipitation mm ' ) > -1 ||
				legend.indexOf( 'average precipitation inches' ) > -1
			) {
				key = 'precipitation';
			}
			if ( key ) {
				climate.forEach( ( item, i ) => {
					let val = vals[ i ].textContent.replace( /\(.*\)/g, '' );
					const negate = val.match( /[-−]/ );
					const finalVal = parseFloat( val.replace( /[-−]/g, '' ) );
					item[ key ] = negate ? -finalVal : finalVal;
				} );
			}
		}
	} );
	if ( !climate.length ) {
		// try the other known format..
		climate = climateExtractionNew( nodeWithHTML( document, text ) );
	}
	return climate && climate.length && climate[1] ? checkImperial(climate) : false;
}

export function isClimateSection(section) {
	return [
		'climate',
		'клімат'
	].filter((climateSection) => {
		return section.line && section.line.toLowerCase().indexOf( climateSection ) > -1
	}).length > 0;
}

export function climateExtraction(host, from) {
	const url = `https://${host}/api/rest_v1/page/mobile-sections/${encodeURIComponent( from )}`;

	return fetch( url )
		.then( ( resp ) => resp.json() )
		.then( ( json ) => {
			if ( !json || !json.remaining || !json.remaining.sections) {
				return null;
			}
			const climate = json.remaining.sections.filter(isClimateSection);
			if ( climate.length ) {
				while ( climate.length ) {
					const climateData = climateExtractionWikipedia( document, climate.pop().text );
					if ( climateData && climateData[1] ) {
						return climateData;
					}
				}
			}

			// try lead as last attempt e.g. ceb wikipedia
			return climateExtractionWikipedia( document, json.lead.sections[0].text ) || null;
		} );
}
