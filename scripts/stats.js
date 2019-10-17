import destinations_json from './data/destinations.json';
import next from './data/next.json';

const destinations = Object.keys(destinations_json);
const no_climate = destinations.filter((key) => destinations_json[key].climate && destinations_json[key].climate.length === 0);
const lacking_sights = destinations.filter((key) => destinations_json[key].sights.length < 2);
const lacking_gonext = destinations.filter((key) => !next[key] || next[key].length < 2);

console.log(`Do not have a climate widget: ${no_climate.length}/${destinations.length}`);
console.log(`Lacking sights: ${lacking_sights.length}/${destinations.length}`);
console.log(`Lacking next: ${lacking_gonext.length}/${destinations.length}`);
