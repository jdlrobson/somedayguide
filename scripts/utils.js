import fetch from 'node-fetch';
import destinations_json from './data/destinations.json';
import countries_json from './data/countries.json';
import sights_json from './data/sights.json';
import countrywb_json from './data/countrywb.json';
import marked from 'marked';
import fs from 'fs';
import { climateExtraction } from '../src/tools/climate';

const renderer = new marked.Renderer();

export function listwithout(list, title) {
    return list.filter((t) => t !== title);
}

const getImageSource = (text) => {
    if (text.indexOf('flickr') > -1) {
        return 'flickr';
    } else if (text.indexOf('wikimedia.org')) {
        return 'wikimedia';
    } else {
        return 'original'
    }
}

const getUrl = (text) => {
    if ( countries_json[text] ) {
        return `/country/${text}`;
    } else if ( destinations_json[text] ) {
        return `/destination/${text}`;
    } else if ( sights_json[text] ) {
        return `https://en.wikipedia.org/wiki/${text}`
    } else {
        return '';
    }
};

renderer.strong = function (text) {
    const link = getUrl(text);
    return link ? `<a href="${link}">${text}</a>` : `<strong>${text}</strong>`;
};

renderer.image = function (href, title, text) {
    return `<div class="note__image">
        <img src="${href}" class="note__image__thumbnail" />
        <a href="${text}" class="note__image__caption">Source: ${getImageSource(text)}</a>
    </div>`
};

let parseddata;
function resetParsedData() {
    parseddata = { links: [], ig: [], sights: [] };
}
renderer.link = function (href, _, text) {
    const igmatch = href.match(/instagram\.com\/p\/([^\/]+)/)
    const wikimatch = href.match(/\.wikidata\.org\/wiki\/([^\/]+)/)
    if (igmatch) {
        parseddata.ig.push(igmatch[1]);
    } else if (wikimatch) {
        parseddata.sights.push(wikimatch[1].replace(/_/g, ' '));
    } else {
        parseddata.links.push({ href, text });
    }
    return '';
}
export { renderer };

export function getGithubWikiData(title, props) {
    resetParsedData();
    let path = `${__dirname}/../somedayguide.wiki/${title.toLowerCase().replace(/ /g, '-')}.md`;
    if ( !fs.existsSync(path) && title.indexOf(' ') > -1 ) {
        // try with '-' character.
        path = `${__dirname}/../somedayguide.wiki/${title}.md`;
    }
    const note = fs.existsSync(path) ? fs.readFileSync(path) : undefined;
    const personalNote = note && marked(note.toString(), { renderer })
        .replace(/\<p\>[ \n]*\<\/p\>/g,'').trim();

    return Object.assign({}, props, {
        links: (props.links || []).concat(parseddata.links),
        sights: (props.sights || []).concat(parseddata.sights),
        instagram: parseddata.ig,
        personalNote: personalNote || undefined
    });
}

export function extractCard(place, json) {
    const coords = json.coordinates;
    // Don't override an existing thumbnail choice
    if ( json.thumbnail && !place.thumbnail ) {
        place.thumbnail = json.thumbnail.source;
        if ( json.originalimage ) {
            place.thumbnail__source = json.originalimage.source;
        } else {
            place.thumbnail__source = json.thumbnail.source;
        }
    }
    if ( coords ) {
        place.lat = coords.lat;
        place.lon = coords.lon;
    }
    place.title = json.title;
    place.summary = json.extract_html;
    place.description = json.description;
    return place;
}

export function getMissingKeys(obj, keys) {
    const placeKeys = Object.keys(obj);
    return keys.filter((key) => placeKeys.indexOf(key) === - 1 );
};

/**
 * @param {string} entity e.g. Q1
 * @return {Promise}
 */
export function getEntityData(entity) {
    const localpath = `${__dirname}/data/claims/ed_${entity}.json`;
    if (fs.existsSync(localpath)) {
        return Promise.resolve(JSON.parse(fs.readFileSync(localpath).toString()));
    }
    return fetch(`https://www.wikidata.org/wiki/Special:EntityData/${entity}.json`)
        .then((resp) => resp.json())
        .then((json) => {
            fs.writeFileSync(localpath, JSON.stringify(json));
            return json;
        });
}

/**
 * Lookup a title across wikis using its wikibase id.
 * @param {string} qcode e.g. Q1
 * @param {string} sitecode e.g. enwiki
 * @return {Promise} resolving with the title on sitecode wiki
 */
export function getSiteLink(qcode, sitecode) {
    return getEntityData(qcode).then((entity) => {
        try {
            return entity.entities[qcode].sitelinks[sitecode].title;
        } catch (e) {
            return null;
        }
    })
}


export function getAllClaims(entity) {
    const localpath = `${__dirname}/data/claims/${entity}.json`;
    if (fs.existsSync(localpath)) {
        return Promise.resolve(JSON.parse(fs.readFileSync(localpath).toString()));
    }
    return fetch(`https://wikidata.org/w/api.php?action=wbgetclaims&format=json&entity=${entity}&props=`)
        .then((resp) => resp.json())
        .then((json) => {
            const claims = {};
            const jsonClaims = json.claims || {};

            Object.keys(jsonClaims).forEach((key) => {
                claims[key] = (jsonClaims[key] || []).map((claim) => {
                    const snak = claim.mainsnak,
                        dv = snak && snak.datavalue || {},
                        value = dv.value || {};

                    return value.id || value;
                });
            });
            fs.writeFileSync(localpath, JSON.stringify(claims));
            return claims;
        });
}

export function getClaimValue(value) {
    // may already have value
    if ( typeof value === 'string' && !value.match(/Q[0-9]+/) ) {
        return Promise.resolve(value);
    }
    if (countrywb_json[value]) {
        return Promise.resolve(countrywb_json[value]);
    }
    return fetch(`https://wikidata.org/w/api.php?action=wbgetentities&format=json&ids=${value}&sites=enwiki&titles=&props=descriptions%7Clabels&languages=en`)
        .then((resp) => resp.json())
        .then((json) => {
            if ( json.error ) {
                return false;
            } else {
                const entities = Object.keys(json.entities);
                const entity = json.entities[entities[0]];
                return entity && entity.labels && entity.labels.en.value;
            }
        });
};

export function listToClaimValues(list) {
    return Promise.all(
        list.map((qcode) => getClaimValue(qcode))
    );
}

export function getWikidataClaim(entity, property) {
    return getAllClaims(entity).then((claims) => {
       return claims[property] || [];
    });
}

export function getWikidata(entity, property) {
    return getWikidataClaim(entity, property).then((values) => {
        return getClaimValue(values[0]);
    });
}

export function badthumbnail(thumbnail) {
    return !thumbnail || thumbnail.indexOf('.svg') > -1 ||
        // Fixes: #24
        thumbnail.indexOf('fileicon-ogg.png') > -1;
}

export function getThumbnail(title, lastsync) {
    const DAY = 1000 * 60 * 60 * 24;
    // if last checked in under
    if ( lastsync && (new Date() - new Date(lastsync)) < DAY * 30 ) {
        return Promise.resolve({});
    }
    return fetch(`https://en.wikipedia.org/api/rest_v1/page/media/${encodeURIComponent(title)}`)
        .then((resp) => resp.json())
        .then((json) => {
            const thumb = ( json.items || [] ).map((item) => {
                return {
                    thumbnail: item.thumbnail && item.thumbnail.source,
                    thumbnail__source: item.titles && item.titles.canonical
                };
            }).filter((item) => !badthumbnail(item.thumbnail))[0] || {};
            console.log(`Updating SVG thumbnail for ${title} to ${thumb.thumbnail}`);
            thumb.lastsync = new Date().toISOString();
            console.log(`return ${thumb.lastsync}`);
            return thumb;
        })
        .catch((err) => {
            console.log(`${err} while trying to get ${title}`)
            return Promise.resolve();
        });
}

export function getSummary(title, project='wikipedia') {
    const url = `https://en.${project}.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    return fetch(url, { redirect: 'follow' })
        .then((resp) => resp.json())
        .then((json) => {
            return {
                title,
                wb: json.wikibase_item || false,
                lat: json.coordinates && json.coordinates.lat,
                lon: json.coordinates && json.coordinates.lon,
                description: json.description,
                thumbnail: json.thumbnail && json.thumbnail.source,
                thumbnail__source: json.originalimage && json.originalimage.source.split('/').slice(-1)[0],
                summary: json.extract
            };
        })
        .catch((err) => {
            console.log(`${err} while trying to get ${title}`)
            return Promise.resolve({});
        })
}

export function calculateDistance( from, to ) {
    var a,
        toRadians = Math.PI / 180,
        deltaLat, deltaLng,
        startLat, endLat,
        haversinLat, haversinLng,
        radius = 6371.01; // radius of Earth in km

    if ( !from || !to || !from.lat || !to.lat ) {
        return -1;
    } else if ( from.lat === to.lat && from.lon === to.lon ) {
        return 0;
    } else {
        deltaLat = ( to.lon - from.lon ) * toRadians;
        deltaLng = ( to.lat - from.lat ) * toRadians;
        startLat = from.lat * toRadians;
        endLat = to.lat * toRadians;

        haversinLat = Math.sin( deltaLat / 2 ) * Math.sin( deltaLat / 2 );
        haversinLng = Math.sin( deltaLng / 2 ) * Math.sin( deltaLng / 2 );

        a = haversinLat + Math.cos( startLat ) * Math.cos( endLat ) * haversinLng;
        return 2 * radius * Math.asin( Math.sqrt( a ) );
    }
}

export function findNear(from, titles, radius) {
    return titles.filter((k) => {
        const d = destinations_json[k];
        const dist = d && d.lat &&
            calculateDistance(from, { lat: d.lat, lon: d.lon } );
        return dist && dist > 0 && dist <  radius;
    });
}

export function findClosest(lat, lon, radius = 200) {
    const from = { lat, lon };
    return findNear(from, Object.keys(destinations_json), radius);
};

export function getNearby(title, titles, radius) {
    const place = destinations_json[title],
        from = place && { lat: place.lat, lon: place.lon };

    if ( !place || !place.lat ) {
        console.log(title, '!!');
        return [];
    } else {
        return findNear(from, titles, radius);
    }
}

export function getNearbyUntilHave(title, titles, number, distance = 160, maxDistance = 200000) {
    let nearby = getNearby(title, titles, distance),
        page = destinations_json[title];

    if ( distance < maxDistance && page && page.lat && nearby.length < number ) {
        return getNearbyUntilHave(title, titles, number, distance + 20, maxDistance);
    } else {
        return nearby;
    }
}

export function withDistance(lat, lon) {
    if ( !lat || !lon ) {
        return ((item) => item);
    } else {
        const from = { lat, lon };
        return (item) => {
            if ( !item.lat || !item.lon ) {
                return item;
            } else {
                return Object.assign({}, item, {
                    distance: calculateDistance( from, {
                        lat: item.lat,
                        lon: item.lon
                    } )
                });
            }
        }
    }
}

/**
 * Find climate data for a place.
 * @param {Object} destination
 * @param {string[]} wikis list of wikipedias to try.
 * @return {Promise} resolving to true or false if one is found
 */
export function findClimate( destination, wikis = [ 'en', 'uk', 'ceb' ], project = 'wikipedia' ) {
    const qcode = destination.wb;
    const wikicode = wikis.pop();
    const tryNextWiki = () => {
        if ( wikis.length ) {
            return findClimate(destination, wikis);
        } else {
            return false;
        }
    };
    return (
        project === 'wikipedia' && qcode ? getSiteLink(qcode, `${wikicode}wiki`) :
        Promise.resolve(destination.title)
    ).then((wtitle) => {
        if ( wtitle ) {
            return climateExtraction(`${wikicode}.${project}.org`, wtitle).then((climate) => {
                if ( climate ) {
                    destination.climate = climate;
                    destination.climate__source = wikicode;
                    return true;
                } else {
                    return tryNextWiki();
                }
            }, function (e) {
                return tryNextWiki();
            });
        } else {
            return tryNextWiki();
        }
    })
}
