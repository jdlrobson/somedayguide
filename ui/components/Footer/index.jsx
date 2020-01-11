import preact, { h } from 'preact';

export default function ( props ) {
    const { title, wikibase } = props;
    return <footer class={props.class}>
        Someday guide is a <a href="https://jdlrobson.com">Jon Robson</a> and <a href="https://linzybearswings.wordpress.com">Linz Lim</a> production with data mashed together
        from <a href='https://en.wikipedia.org/'>Wikipedia
        </a>{wikibase && <span>, <a href={`https://wikidata.org/wiki/${wikibase}`}>Wikidata</a></span>}
        {props.nowikivoyage ? '.' : <span> and <a
        href={`https://en.wikivoyage.org/wiki/${title}`}>Wikivoyage</a>.</span>}
        <br/>
        An open web is a happy web. If anything looks wrong click
        the <a href={`https://en.wikivoyage.org/wiki/${title}?action=edit`}>edit button</a> and/or 
        let us known by submitting an issue on <a href="https://github.com/jdlrobson/somedayguide/issues">Github</a>. 
        Curious what we've got here? Check out the <a href="/sitemap">sitemap</a>.
    </footer>;
}
