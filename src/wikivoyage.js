import { render, h } from 'preact';
import searchindex from './searchindex';

const SELECTOR_OF_NODES_TO_DELETE = [
    '.mw-kartographer-maplink', 'figure', 'dl', 'style',
    '.mw-kartographer-container',
].join(',');
let wikivoyagesections;

function removeNodes(node, selector) {
    Array.from(node.querySelectorAll(selector)).forEach((node) => {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    })
}

function removeRelativeLinks(node, index) {
    Array.from(node.querySelectorAll('a[rel="mw:WikiLink"]')).forEach((node) => {
        if (node.parentNode) {
            const href = node.getAttribute('href');
            const title = (href.split('./')[1] || '').replace(/_/g, ' ').toLowerCase();
            if ( title && index.includes(title) ) {
                node.setAttribute('href', `/destination/${title}`);
            } else {
                const newNode = document.createElement('span');
                newNode.innerHTML = node.innerHTML;
                node.parentNode.replaceChild(newNode, node);
            }
        }
    })
}
function getSubSections(sectionNode) {
    const subsections = Array.from(sectionNode.querySelectorAll('section'));
    return subsections.map((s) => {
        const heading = s.querySelector('h3');
        return {
            title: heading && heading.textContent,
            id: s.getAttribute( 'data-mw-section-id' ),
            html: s.innerHTML
        };
    }).filter((t)=>t.title);
}

function fetchTitleSections(title) {
    const url = `https://en.wikivoyage.org/api/rest_v1/page/html/${encodeURIComponent(title)}`;
    if ( wikivoyagesections ) {
        return Promise.resolve( wikivoyagesections );
    }
    return Promise.all([fetch(url).then((r)=>r.text()), searchindex()]).then(([text, index]) => {
        const d = document.createElement('div');
        d.innerHTML = text;
        removeNodes(d, SELECTOR_OF_NODES_TO_DELETE);
        removeRelativeLinks(d, index);
        const sections = Array.from ( d.childNodes ).filter((n) => n.tagName === 'SECTION');
        return Array.from(sections);
    }).then((sections) => {
        const topsections = [];
        sections.forEach((node) => {
            const heading = node.querySelector('h2');
            let child = node.firstChild;
            let html = '';
            while ( child && child.nextSibling ) {
                // break the loop when we reach a section
                if ( child.tagName ) {
                    if ( child.tagName.toUpperCase() === 'SECTION' ) {
                        child = null;
                        break;
                    }
                }
                html += child.outerHTML || child.textContent;
                child = child.nextSibling;
            }
            topsections.push( { title: heading ? heading.textContent : '',
                id: node.getAttribute( 'data-mw-section-id' ),
                html, subsections: getSubSections(node) })
        });
        wikivoyagesections = topsections;
        return topsections;
    });
}

function editLink(title, id) {
    const url  =`https://en.wikivoyage.org/wiki/${title}?action=edit${id ? `&section=${id}` : ''}`;
    return <a class="subsectiontabs__edit"
        href={url}>Edit on Wikivoyage</a>;
}

function renderSection(node, title, section, subsection) {
    let view;
    const html = section.html;
    const subsections = section.subsections;
    const loadedSubSection = subsections.filter((s)=>s.title === subsection)[0];
    const btnClick = (sectiontitle) => {
        return () => {
            renderSection(node, title, section, sectiontitle)
        };
    };

    if ( subsections.length ) {
        view = (
            <div class="subsectiontabs">
                <div class="subsectiontabs__tabs">{
                    subsections.map((s) => <button
                        class="note__button" onClick={btnClick(s.title)}>{s.title}</button>)
                }</div>
                <div>
                    {!loadedSubSection && <p>Click a tab to view information.</p>}
                    {loadedSubSection && <div dangerouslySetInnerHTML={{__html: loadedSubSection.html}} />}
                    {loadedSubSection && editLink(title, loadedSubSection.id)}
                </div>
            </div>
        );;
    } else {
        view = (
            <div>
                <div dangerouslySetInnerHTML={{__html: html}} />
                {editLink(title, section.id)}
            </div>
        );
    }
    render(view, node)
}

export function loadWikivoyageSection(node, title, regex) {
    node.innerHTML = '';
    render(<div>Loading</div>, node)
    fetchTitleSections(title).then((sections) => {
        const getinsections = sections.filter((s) => s.title && s.title.toLowerCase().match(regex));
        if (getinsections[0]) {
            renderSection(node, title, getinsections[0]);
        }
    });
}
