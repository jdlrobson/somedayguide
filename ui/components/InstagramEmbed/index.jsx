import preact, { h } from 'preact';

export default function ( { id, className } ) {
    return <div class={className}>
            <img src={`https://instagram.com/p/${id}/media/?size=l`}
                alt="Jon and Linzy Instagram photo" />
            <a class="slideshow__slide__caption"
                href={`https://instagram.com/p/${id}`}>View on Instagram</a>
    </div>;
}
