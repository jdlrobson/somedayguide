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
    place.title = json.displaytitle || json.title;
    place.summary = json.extract_html;
    place.description = json.description;
    return place;
}

export function getMissingKeys(obj, keys) {
    const placeKeys = Object.keys(obj);
    return keys.filter((key) => placeKeys.indexOf(key) === - 1 );
};
