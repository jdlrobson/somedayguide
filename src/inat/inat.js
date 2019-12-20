const container = document.querySelector('#nature .box__content');
import { h, render } from 'preact';
const coordData = document.querySelector('.map [data-lat]').dataset;

function getBoundingBox( latitude, longitude ) {
    const delta = 20;
	const nelat = latitude + delta / 111;
	const swlat = latitude - delta / 111;
	const nelng = longitude + delta / 111;
	const swlng = longitude - delta / 111;
    return {
        swlat,
        swlng, 
        nelat,
        nelng
    };
}

const bb = getBoundingBox(
    parseFloat(coordData.lat, 10),
    parseFloat(coordData.lon)
);

const qs = Object.keys(bb).map(key => key + '=' + bb[key]).join('&');
container.innerHTML = '';
fetch(`https://api.inaturalist.org/v1/observations/?${qs}&per_page=100&out_of_range=1`).then((r) => r.json())
    .then((json)=> {
        const unique = json.results.filter((res, i, original) => {
            return original.findIndex((a) => {
                return a.community_taxon_id === res.community_taxon_id;
            }) === i;
        })
        const observations = unique.map((observation) => {
            try {
                return {
                    src: observation.observation_photos[0].photo.url,
                    alt: `${observation.species_guess} (${observation.observation_photos[0].photo.attribution})`,
                    url: `https://www.inaturalist.org/observations/${observation.id}`};
            } catch (e) {
                return false;
            }
        }).filter((o) => o)

        render(<ul>
            {observations.map(({url, src, alt}) =>
                <a target='_blank' href={url}><img src={src} alt={alt} title={alt}/></a>)}
        </ul>, container);
    })
