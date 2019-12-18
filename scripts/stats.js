import destinations_json from './data/destinations.json';
import sights_json from './data/sights.json';
import countries_json from './data/countries.json';
import next from './data/next.json';
const MIN_SIGHTS = 2;
const MIN_GO_NEXT = 1;
const MIN_SIGHT_USAGES_TO_BE_POPULAR = 2;
const MIN_DESTINATIONS_COUNTRY = 4;
const MIN_DESTINATIONS_CITYLIKE_COUNTRY = 1;

const sightCount = {};
const countries = Object.keys(countries_json)

Object.keys(destinations_json).map((place) => destinations_json[place].sights).forEach((sights) => {
    (sights || []).forEach((sight)=> {
        if ( !sightCount[sight] ) {
            sightCount[sight] = 1;
        } else {
            sightCount[sight] = sightCount[sight] + 1;
        }
    });
});

const unusedsights = Object.keys(sights_json).filter((sight) => {
    return !sightCount[sight];
});
const destinations = Object.keys(destinations_json);

const no_climate = destinations.filter((key) => !destinations_json[key].climate || destinations_json[key].climate.length === 0);
const lacking_sights = destinations.filter((key) => (destinations_json[key].sights || []).length < MIN_SIGHTS);
const lacking_gonext = destinations.filter((key) => !next[key] || next[key].length < MIN_GO_NEXT);

export {
    lacking_gonext,
    no_climate,
    lacking_sights,
    unusedsights
}
