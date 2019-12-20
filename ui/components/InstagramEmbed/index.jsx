import preact, { h } from 'preact';

export default function ( { id, className } ) {
    return <div class={className}>
            <blockquote class="instagram-media"
            data-instgrm-captioned
            data-instgrm-permalink={`https://www.instagram.com/p/${id}/?utm_source=ig_embed&amp;utm_campaign=loading`}
            data-instgrm-version="12"
            style="max-width: 470px; box-sizing: border-box; height: 690px;background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"
            ><div style="padding:16px;">
                <a href={`https://www.instagram.com/p/${id}/?utm_source=ig_embed&amp;utm_campaign=loading`}>View on Instagram</a>
            </div>
        </blockquote>
    </div>;
}
