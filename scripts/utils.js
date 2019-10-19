import fetch from 'node-fetch';
const CHECK_THUMBNAILS = false;

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
        'Q6784672', 'Q620471',
        'Q2177636',
        'Q7830262',
        'Q7930614',
        'Q28659128',
        'Q16858213',
        'Q667509',
        'Q2989400',
        'Q2577883',
        'Q3191695',
        'Q605291',
        'Q1758856',
        'Q659103',
        'Q2590631',
        'Q2706302',
        'Q15584664',
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
        // first-level administrative country subdivision
        'Q10864048',
        // chile
        'Q25412763',
        // border town
        'Q902814',
        // muncip
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
        'Q7930989',
        // human settlement
        'Q486972'
    ].filter((key) => claims.includes(key)).length > 0;
}

export function isInstanceOfNationalPark(claims ) {
    return [
        'Q20537528',
        'Q20489083',
        'Q1317754',
        'Q20488347',
        'Q18618832',
        'Q18618819',
        'Q46169',
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

export function getThumbnail(title) {
    return CHECK_THUMBNAILS ? fetch(`https://en.wikipedia.org/api/rest_v1/page/media/${encodeURIComponent(title)}`)
        .then((resp) => resp.json())
        .then((json) => {
            const thumb = json.items.map((item) => {
                return {
                    thumbnail: item.thumbnail && item.thumbnail.source,
                    thumbnail__source: item.titles && item.titles.canonical
                };
            }).filter((item) => item.thumbnail && item.thumbnail.indexOf('svg') === -1)[0] || {};
            console.log(`Updating SVG thumbnail for ${title}`);
            return thumb;
        })
        .catch((err) => {
            console.log(`${err} while trying to get ${title}`)
            return Promise.resolve();
        }) : Promise.resolve();
}

export function getSummary(title, project='wikipedia') {
    return fetch(`https://en.${project}.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)
        .then((resp) => resp.json())
        .then((json) => {
            return {
                title,
                wb: json.wikibase_item,
                description: json.description,
                thumbnail: json.thumbnail && json.thumbnail.source,
                thumbnail__source: json.originalimage && json.originalimage.source.split('/').slice(-1)[0],
                summary: json.extract
            };
        })
        .catch((err) => {
            console.log(`${err} while trying to get ${title}`)
            return Promise.resolve();
        })
}
