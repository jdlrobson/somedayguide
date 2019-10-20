import destinations_json from './data/destinations.json';
import sights_json from './data/sights.json';
import countries_json from './data/countries.json';
import next from './data/next.json';
const MIN_SIGHTS = 2;

const usedsights = new Set();

Object.keys(countries_json).map((country) => countries_json[country].sights).forEach((sights) => {
    sights.forEach((sight)=> {
        usedsights.add(sight);
    });
});

Object.keys(destinations_json).map((place) => destinations_json[place].sights).forEach((sights) => {
    sights.forEach((sight)=> {
        usedsights.add(sight);
    });
});

const unusedsights = Object.keys(sights_json).filter((sight) => {
    return !usedsights.has(sight);
});
const destinations = Object.keys(destinations_json);
const no_climate = destinations.filter((key) => !destinations_json[key].climate || destinations_json[key].climate.length === 0);
const lacking_sights = destinations.filter((key) => (destinations_json[key].sights || []).length < MIN_SIGHTS);
const lacking_gonext = destinations.filter((key) => !next[key] || next[key].length < MIN_SIGHTS);
const nosightsnonext = lacking_gonext.filter((title) =>
    no_climate.indexOf(title) > -1 && lacking_sights.indexOf(title) > -1);

console.log(`Do not have a climate widget: ${no_climate.length}/${destinations.length}`);
console.log(`Total sights: ${Object.keys(sights_json).length}`);
console.log(`Lacking sights: ${lacking_sights.length}/${destinations.length}`);
console.log(`Lacking next: ${lacking_gonext.length}/${destinations.length}`);
console.log(`Lacking all: ${nosightsnonext.length}`);
console.log(`Unused sights: ${unusedsights.length}`);

export {
    unusedsights,
    nosightsnonext
}
