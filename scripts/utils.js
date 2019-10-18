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
        // oasis
        'Q43742',
        // tourist attraction
        'Q484170',
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
        // salt mine
        'Q40551',
        // biosphere reserve
        'Q158454',
        // desert
        'Q8514',
        // valley
        'Q39816',
        // forest
        'Q4421',
        // bend in river
        'Q17018380',
        // protected area
        'Q473972',
        // arch site
        'Q839954',
        // mountain
        'Q8502',
        // swamp
        'Q166735',
        // plains
        'Q160091',
        // game reserve
        'Q1714375',
        // savanna
        'Q42320',
        // reserve
        'Q20268453',
        // range
        'Q46831'
    ].filter((key) => claims.includes(key)).length > 0
}

export function isInstanceOfCity(claims ) {
    return [
        // munc dom
        'Q6005581',
        // tunisia
        'Q41067667',
        // portugal
        'Q15647906',
        // sweden
        'Q127448',
        'Q12813115',
        // peninsular
        'Q34763',
        // province of phil
        'Q24746',
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
        // human settlement
        'Q486972'
    ].filter((key) => claims.includes(key)).length > 0;
}

export function isInstanceOfNationalPark(claims ) {
    return [
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

