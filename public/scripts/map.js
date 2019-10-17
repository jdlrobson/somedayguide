window.initMap = function (props) {
    loadCSS('/scripts/leaflet/leaflet.css')
    loadJS('/scripts/leaflet/leaflet.js', function () {
        var map = L.map('map').setView([props.lat, props.lon], props.zoom);
        L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png?lang=en', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        if ( props.lat !== '0' && props.lon !== '0' ) {
            L.marker([props.lat, props.lon]).addTo(map)
                .bindPopup(props.title)
                .openPopup();
        }
    });
};
