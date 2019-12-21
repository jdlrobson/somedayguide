import { render, h } from 'preact';

let wikivoyagesections;

function removeNodes(node, selector) {
    Array.from(node.querySelectorAll(selector)).forEach((node) => {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    })
}

function removeRelativeLinks(node) {
    Array.from(node.querySelectorAll('a[rel="mw:WikiLink"]')).forEach((node) => {
        if (node.parentNode) {
            const newNode = document.createElement('span');
            newNode.innerHTML = node.innerHTML;
            node.parentNode.replaceChild(newNode, node);
        }
    })
}
function getSubSections(sectionNode) {
    const subsections = Array.from (sectionNode.querySelectorAll('section'));
    return subsections.map((s) => {
        const heading = s.querySelector('h3,h4,h5,h6');
        return {
            title: heading && heading.textContent,
            id: s.getAttribute( 'data-mw-section-id' ),
            html: s.innerHTML
        };
    });
}

function fetchTitleSections(title) {
    const url = `https://en.wikivoyage.org/api/rest_v1/page/html/${encodeURIComponent(title)}`;
    if ( wikivoyagesections ) {
        return Promise.resolve( wikivoyagesections );
    }
    return fetch(url).then((r)=>r.text()).then((text) => {
        const d = document.createElement('div');
        d.innerHTML = text;
        removeNodes(d, '.mw-kartographer-maplink, figure, dl');
        removeRelativeLinks(d);
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

function renderSection(node, section, subsection) {
    let view;
    const html = section.html;
    const subsections = section.subsections;
    const loadedSubSection = subsections.filter((s)=>s.title === subsection)[0];
    const btnClick = (title) => {
        return () => {
            renderSection(node, section, title)
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
                    {loadedSubSection && <a class="subsectiontabs__edit"
                        href={`https://en.wikivoyage.org/wiki/Barcelona?action=edit&section=${loadedSubSection.id}`}>Edit on Wikivoyage</a>}
                </div>
            </div>
        );;
    } else {
        view = <div dangerouslySetInnerHTML={{__html: html}} />;
    }
    render(view, node)
}

export function loadWikivoyageSection(node, title, regex) {
    node.innerHTML = '';
    render(<div>Loading</div>, node)
    fetchTitleSections(title).then((sections) => {
        const getinsections = sections.filter((s) => s.title && s.title.toLowerCase().match(regex));
        if (getinsections[0]) {
            renderSection(node, getinsections[0]);
        }
    });
}
