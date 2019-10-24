import destinations_json from './data/destinations.json';
import sights_json from './data/sights.json';
import countries_json from './data/countries.json';
import next from './data/next.json';
const MIN_SIGHTS = 2;
const MIN_GO_NEXT = 2;
const MIN_SIGHTS_COUNTRY = 2;
const MIN_SIGHT_USAGES_TO_BE_POPULAR = 2;
const MIN_DESTINATIONS_COUNTRY = 4;

const sightCount = {};

const countries = Object.keys(countries_json)
Object.keys(countries_json).map((country) => countries_json[country].sights).forEach((sights) => {
    sights.forEach((sight)=> {
        if ( !sightCount[sight] ) {
            sightCount[sight] = 1;
        } else {
            sightCount[sight] = sightCount[sight] + 1;
        }
    });
});

Object.keys(destinations_json).map((place) => destinations_json[place].sights).forEach((sights) => {
    sights.forEach((sight)=> {
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
const sightsnothumb = Object.keys(sights_json).filter((sight) => {
    return !sights_json[sight].thumbnail;
});
const sightsnolonglat = Object.keys(sights_json).filter((sight) => {
    return !sights_json[sight].lat;
});
const destinations = Object.keys(destinations_json);
const destinationsnothumb = destinations.filter((t) => {
    return !destinations_json[t].thumbnail;
});
const no_climate = destinations.filter((key) => !destinations_json[key].climate || destinations_json[key].climate.length === 0);
const lacking_sights = destinations.filter((key) => (destinations_json[key].sights || []).length < MIN_SIGHTS);
const lacking_gonext = destinations.filter((key) => !next[key] || next[key].length < MIN_GO_NEXT);
const nosightsnonext = lacking_gonext.filter((title) =>
    no_climate.indexOf(title) > -1 && lacking_sights.indexOf(title) > -1);
const countrylackingsights = countries.filter((title) => {
    return (countries_json[title].sights || []).length < MIN_SIGHTS_COUNTRY;
});
const countrylackingdestinations = countries.filter((title) => {
    return (countries_json[title].destinations || []).length < MIN_DESTINATIONS_COUNTRY;
});
const unpopularsights = Object.keys(sightCount).filter((sight) => sightCount[sight] < MIN_SIGHT_USAGES_TO_BE_POPULAR);
console.log(`Do not have a climate widget: ${no_climate.length}/${destinations.length}`);
console.log(`Total sights: ${Object.keys(sights_json).length}`);
console.log(`Destinations lacking sights: ${lacking_sights.length}/${destinations.length}`);
console.log(`Countries lacking sights: ${countrylackingsights.length}`);
console.log(`Countries lacking destinations: ${countrylackingdestinations.length}`);
console.log(`Lacking next: ${lacking_gonext.length}/${destinations.length}`);
console.log(`Lacking all: ${nosightsnonext.length}`);
console.log(`Unused sights: ${unusedsights.length}`);
console.log(`Unpopular sights: ${unpopularsights.length}`);
console.log(`Sights without thumbnail: ${sightsnothumb.length}`);
console.log(`Sights without lon/lat: ${sightsnolonglat.length}`);
console.log(`Destinations without thumbnail: ${destinationsnothumb.length}`);

export {
    lacking_gonext,
    countrylackingdestinations,
    countrylackingsights,
    unusedsights,
    nosightsnonext
}
