import preact, { h } from 'preact';
import NavigationBar from '../../components/NavigationBar';
import Map from '../../components/Map';
import Footer from '../../components/Footer';

export default function ( {
    lat, lon, zoom, parent, parentLink,
    title, subtitle, children, childrenLeft, childrenRight
} ) {
    return (
        <div class="page">
            <div class="page__column page__column--one">
                {childrenLeft}
            </div>
            <div class="page__column page__column--two">
                <NavigationBar />
                <Map id="map"
                    parent={parent}
                    parentLink={parentLink}
                    lat={lat}
                    lon={lon}
                    zoom={zoom}
                    subtitle={subtitle}
                    place={title}
                />
                <div class="content">{children}</div>
            </div>
            <div class="page__column page__column--three">
                {childrenRight}
            </div>
            <Footer class="page__column--span" title={title} />
        </div>
    )
};
