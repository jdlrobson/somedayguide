import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const GEOSEARCHAPI = 'https://en.wikivoyage.org/w/api.php?action=query&format=json&formatversion=2&prop=coordinates%7Cpageprops%7Cpageprops%7Cpageimages%7Cdescription&colimit=max&generator=geosearch&ggsradius=20000&ggsnamespace=0&ggslimit=50&ppprop=displaytitle&piprop=thumbnail&pithumbsize=150&pilimit=50&origin=*';

function addMarker(map, props, titleToLink, iconProps = {
    iconUrl: '/images/marker-icon.png',
    zIndexOffset: 1,
    iconSize: [29, 40]
}) {
    const href = titleToLink(props.title, '/destination');
    return L.marker([props.lat, props.lon], {
        icon: L.icon(iconProps)
    }).addTo(map)
        .bindPopup(`<a href="${href}">${props.title}</a>`);
}

function onExplore(map, titleToLink, validDestinations) {
    const center = map.getCenter();
     fetch( `${GEOSEARCHAPI}&ggscoord=${center.lat}|${center.lng}` )
                .then( ( resp )=>resp.json() )
                .then( ( data ) => {
                    const pages = ( data && data.query && data.query.pages ) || [];
                    pages.map((page) => {
                        const coords = (page.coordinates && page.coordinates[0]) || {};
                        return {
                            title: page.title,
                            lon: coords.lon,
                            lat: coords.lat
                        };
                    }).filter((page) => {
                        return validDestinations.indexOf(page.title.toLowerCase()) > -1;
                    }).forEach((props) => {
                        addMarker(map, props, titleToLink);
                    });
                } );
}

function addToMapFromMarkup(map, selector, titleToLink, iconProps) {
    document.querySelectorAll(selector).forEach((node) => {
        var lat = node.querySelector('.geodata .latitude');
        var lon = node.querySelector('.geodata .longitude');
        var title = node.querySelector('.card__text__heading');
        if ( lat && lon ) {
            addMarker(map, {
                title: title && title.textContent,
                lat: lat && lat.textContent,
                lon: lon && lon.textContent,
            }, titleToLink, iconProps);
        }
    });
}

/**
 * @param {object} props
 * @param {Function} titleToLink
 * @param {array} validDestinations
 */
window.initMap = function (props, titleToLink, validDestinations) {
    var marker,
        map = L.map('map').setView([props.lat, props.lon], props.zoom);
    L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png?lang=en', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    addToMapFromMarkup(map, '#sights .geo', () => '#', {
        iconUrl: '/images/sight-icon.png',
        iconSize: [20, 20]
    });
    if ( props.lat !== '0' && props.lon !== '0' ) {
        marker = addMarker(map, props, titleToLink);
        marker.openPopup();
    }
    addToMapFromMarkup(map, '#destinations .geo, #grid .geo', titleToLink);
    map.on('dragend', function () {
        onExplore(map, titleToLink, validDestinations);
    })
};
