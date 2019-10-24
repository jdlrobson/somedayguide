import fetch from 'node-fetch';
import destinations_json from './data/destinations.json';
import countries_json from './data/countries.json';
import sights_json from './data/sights.json';
import marked from 'marked';
import fs from 'fs';

const CHECK_THUMBNAILS = false;
const renderer = new marked.Renderer();

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

export { renderer };

export function getPersonalNote(title) {
    let path = `${__dirname}/../somedayguide.wiki/${title}.md`;
    if ( !fs.existsSync(path) && title.indexOf(' ') > -1 ) {
        // try with '-' character.
        path = `${__dirname}/../somedayguide.wiki/${title.replace(/ /g, '-')}.md`;
    }
    const note = fs.existsSync(path) ? fs.readFileSync(path) : undefined;
    return note && marked(note.toString(), { renderer });
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

export function getClaims(entity, property) {
    return fetch(`https://wikidata.org/w/api.php?action=wbgetclaims&format=json&entity=${entity}&property=${property}&props=`)
        .then((resp) => resp.json())
        .then((json) => {
            const claims = Object.keys(json.claims || {}).map((key) => json.claims[key])[0];
            return (claims || []).map((claim) => claim.mainsnak &&
                claim.mainsnak.datavalue &&
                claim.mainsnak.datavalue.value &&
                claim.mainsnak.datavalue.value.id);
        });
};

export function getClaimValue(value) {
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

export function getWikidata(entity, property) {
    return getClaims(entity, property).then((values) => {
            return getClaimValue(values[0]);
    });
}

export function isInstanceOfSight( claims ) {
    return [
        // activity
        'Q1914636',
        // heritage
        'Q30634609',
        // dark sky preserve
        'Q3457162',
        // highland
        'Q878223',
        // natural region
        'Q1970725',
        // concentration camp
        'Q153813',
        // coral reef
        'Q11292',
        // heritage site
        'Q38048753',
        // ski resort
        'Q130003',
        // lake
        'Q23397',
        // oasis
        'Q43742',
        // tourist attraction
        'Q570116',
        // rift lake
        'Q6341928',
        // power station
        'Q15911738',
        // street
        'Q79007',
        // czech
        'Q5153359', 'Q15978299', 'Q7841907',
        // nomansland
        'Q312461',
        // atoll
        'Q11774746',
        // body water
        'Q15324',
        // coast
        'Q93352',
        // fort
        'Q1785071',
        // crater lake
        'Q204324',
        // strict nature reserve of Madagascar
        'Q20489120',
        'Q179049',
        // salt mine
        'Q40551',
        // biosphere reserve
        'Q158454',
        // volcano
        'Q212057',
        'Q169358',
        // desert
        'Q8514',
        // valley
        'Q39816',
        // forest
        'Q4421',
        'Q144019',
        // canyon
        'Q150784',
        // pilgramage
        'Q15135589',
        // bend in river
        'Q17018380',
        'Q43197',
        // protected area
        'Q473972',
        // natural landscape
        'Q1286517',
        // arch site
        'Q839954',
        // waterfall
        'Q34038',
        // mountain
        'Q8502',
        'Q1437459',
        'Q133056',
        // swamp
        'Q166735',
        // plains
        'Q160091',
        // game reserve
        'Q1714375',
        // savanna
        'Q42320',
        // trail
        'Q628179',
        // river
        'Q4022',
        // hill station
        'Q2393184',
        // sea
        'Q165',
        // vegetation
        'Q2083910',
        // bay
        'Q39594',
        // beach
        'Q40080',
        // castle
        'Q1064905',
        // reserve
        'Q20268453',
        // range
        'Q46831',
        // headland cape
        'Q191992', 'Q185113',
        // country side
        'Q175185',
        // ethnic people
        'Q41710',
        // private island
        'Q2984210'
    ].filter((key) => claims.includes(key)).length > 0
}

export function isInstanceOfCity(claims ) {
    return [
        'Q6784672', 'Q620471', 'Q3257686', 'Q572784',
        'Q2177636', 'Q56436498',
        'Q7830262', 'Q1357964',
        'Q7930614', 'Q24698',
        'Q28659128',
        'Q16858213', 'Q498162',
        'Q667509', 'Q747074', 'Q191093', 'Q180673', 'Q765865',
        'Q2989400', 'Q748149', 'Q59341087',
        'Q2577883', 'Q10742', 'Q216712', 'Q643589',
        'Q3191695', 'Q11828004', 'Q844713', 'Q1289426',
        'Q605291', 'Q13212489',
        'Q1758856', 'Q735428', 'Q1070990',
        'Q659103',
        'Q2590631',
        'Q2706302','Q104157',
        'Q15584664',
        // state
        'Q7275',
        // suburb
        'Q188509',
        // village
        'Q532',
        // capital
        'Q5119',
        // neth
        'Q2039348',
        // port city
        'Q2264924',
        // district
        'Q2292572',
        'Q59136',
        // canton
        'Q1146429',
        // first-level administrative country subdivision
        'Q10864048',
        // chile
        'Q25412763',
        // border town
        'Q902814',
        // muncip
        'Q24764',
        'Q6005581',
        'Q3556889',
        // tunisia
        'Q41067667',
        // portugal
        'Q15647906',
        // sweden
        'Q127448',
        'Q12813115',
        // peninsular
        'Q34763',
        // provinces
        'Q24746',
        'Q83116',
        'Q1025116',
        // commune
        'Q3266850',
        // district
        'Q2198484',
        // region
        'Q82794',
        // town
        'Q3957',
        // commune of benin
        'Q1780506',
        // city
        'Q515',
        'Q29946056',
        'Q1093829',
        'Q7930989',
        'Q1549591',
        // human settlement
        'Q486972'
    ].filter((key) => claims.includes(key)).length > 0;
}

export function isInstanceOfNationalPark(claims ) {
    return [
        'Q728904', 'Q20626607',
        'Q20537528', 'Q2006279',
        'Q20489083', 'Q18618843',
        'Q1896949',
        'Q1317754',
        'Q20488347',
        'Q18618832',
        'Q18618819',
        'Q46169',
        'Q1132998',
        'Q34918903',
        // finland
        'Q14215551',
        // zambia
        'Q1408593',
        // national park of brazil
        'Q167946'
    ].filter((key) => claims.includes(key)).length > 0
}

export function isInstanceOfIsland(claims ) {
    return [
        // arciphelog
        'Q33837',
        'Q23442',
        // island group
        'Q1402592'
    ].filter((key) => claims.includes(key)).length > 0
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
                wb: json.wikibase_item,
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
        var distance, a,
                toRadians = Math.PI / 180,
                deltaLat, deltaLng,
                startLat, endLat,
                haversinLat, haversinLng,
                radius = 6371.01; // radius of Earth in km

        if ( from.lat === to.lat && from.lon === to.lon ) {
                distance = 0;
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
        return distance;
}

export function getNearby(title, titles, radius) {
    const place = destinations_json[title],
        from = place && { lat: place.lat, lon: place.lon };

    if ( !place || !place.lat ) {
        console.log(title, '!!');
        return [];
    } else {
        return titles.filter((k) => {
            const d = destinations_json[k];
            const dist = d && d.lat &&
                calculateDistance(from, { lat: d.lat, lon: d.lon } );
            return dist && dist > 0 && dist <  radius;
        });
    }
}

export function getNearbyUntilHave(title, titles, number, distance = 160) {
    let nearby = getNearby(title, titles, distance),
        page = destinations_json[title];

    if ( page && page.lat && nearby.length < number ) {
        return getNearbyUntilHave(title, titles, number, distance + 20);
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
