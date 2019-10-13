import preact, { h } from 'preact';
import NavigationBar from '../../components/NavigationBar';

const MAP_URL = ( lat, lon, zoom ) => `https://maps.wikimedia.org/img/osm-intl,${zoom},${lat},${lon},1000x500.png?lang=en`;

export default function ( { place, lat = 0, lon = 0, zoom = 10, subtitle } ) {
    return (
        <div class="map">
            <div class="map__bg" style={
                {'background-image': `url("${MAP_URL(lat, lon, zoom)}")`}
            }>
                <div>
                    <h1 class="map__bg__heading">
                        <a href="/">
                            <img src="/images/someday-map.png" alt="Someday" height="146" width="400"/>
                        </a>
                    </h1>
                    <div class="map__bg__subtitle">{subtitle}</div>
                    <h2 class="map__bg__page-title" id="section_0">{place}</h2>
                    <button class="map__bg__launch-icon">Launch map</button>
                </div>
            </div>
            <div class="map__search">
                <span class="map__search__cta">Somewhere else</span>
                <div role="button" class="map__search__icon">
                    Search</div>
            </div>
        </div>
    );
};
