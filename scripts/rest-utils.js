const SELECTOR_OF_NODES_TO_DELETE = [
    '.mw-kartographer-maplink', 'figure', 'dl', 'style',
    '.mw-kartographer-container',
].join(',');

export function removeNodes(node, selector) {
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

export function fetchTitleSections(title, options = {}) {
    const host = options.host ||  'https://en.wikivoyage.org';
    const searchindex = options.searchindex || ( () => Promise.resolve([]) );
    const url = `${host}/api/rest_v1/page/html/${encodeURIComponent(title)}`;
    console.log(url);
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
        return topsections;
    });
}

export function toDocumentNode(html) {
    const d = document.createElement('div');
    d.innerHTML = html;
    return d;
}

export function filterForSection(section, fuzzy) {
    const lsection = section.toLowerCase();
    return (sections) => {
        return sections.filter((s) => fuzzy ? s.title.toLowerCase().indexOf(lsection) > -1
            : s.title.toLowerCase() === lsection)[0];
    };
}

export function fetchSection(title, section, options) {
    return fetchTitleSections(title, options).then(filterForSection(section));
}