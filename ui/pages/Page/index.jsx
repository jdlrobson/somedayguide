import preact, { h } from 'preact';
import NavigationBar from '../../components/NavigationBar';
import Map from '../../components/Map';

export default function ( {
    lat, lon, zoom,
    title, subtitle = 'guide to', children, childrenLeft, childrenRight
} ) {
    return (
        <div class="page">
            <div class="page__column-one">
                {childrenLeft}
            </div>
            <div class="page__column-two">
                <NavigationBar />
                <Map
                    lat={lat}
                    lon={lon}
                    zoom={zoom}
                    subtitle={subtitle}
                    place={title}
                />
                <div class="content">{children}</div>
            </div>
            <div class="page__column-three">
                {childrenRight}
            </div>
        </div>
    )
};
