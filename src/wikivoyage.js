import { render, h } from 'preact';
import searchindex from './searchindex';
import { fetchTitleSections } from '../scripts/rest-utils';



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
    fetchTitleSections(title, searchindex).then((sections) => {
        const getinsections = sections.filter((s) => s.title && s.title.toLowerCase().match(regex));
        if (getinsections[0]) {
            renderSection(node, title, getinsections[0]);
        }
    });
}
