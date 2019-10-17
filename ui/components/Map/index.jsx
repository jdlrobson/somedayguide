import preact, { h } from 'preact';
import NavigationBar from '../../components/NavigationBar';

const MAP_URL = ( lat, lon, zoom ) => `https://maps.wikimedia.org/img/osm-intl,${zoom},${lat},${lon},1000x500.png?lang=en`;

export default function ( { place, lat = 0, lon = 0, id, zoom = 10,
    subtitle = 'we will see', parent, parentLink
} ) {
    return (
        <div class="map">
            <div class="map__overlay" style={
                {'background-image': `url("${MAP_URL(lat, lon, zoom)}")`}
            }>
                <h1 class="map__overlay__heading">
                    <a href="/">
                        <img  class="map__overlay__logo"
                            src="/images/someday-map.png" alt="Someday" height="146" width="400"/>
                    </a>
                </h1>
                <div class="map__overlay__subtitle">{subtitle}</div>
                <h2 class="map__overlay__page-title">{place}</h2>
                <a class="map__overlay__parent" href={parentLink}>{parent}</a>
            </div>
            <button class="map__launch-icon"
                data-zoom={zoom} data-title={place}
                data-lat={lat} data-lon={lon}>Launch map</button>
            <div class="map__canvas" id={id}></div>
            <div class="map__search">
                <span class="map__search__cta">Somewhere else</span>
                <div role="button" class="map__search__icon">
                    Search</div>
            </div>
        </div>
    );
};
