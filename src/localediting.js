const LOCAL_NOTE = window.location.pathname;

function enableAdminMode() {
    document.body.classList.add('body--admin-enabled');
    const path = window.location.pathname.split('/');
    const title = path[path.length-1];
    const a = document.createElement('a');
    a.setAttribute('href', `https://github.com/jdlrobson/somedayguide/wiki/${title.toLowerCase()}`);
    a.textContent = 'Edit';
    const note = document.querySelectorAll('.note');
    // not home page
    if (note.length > 0) {
        note[0].appendChild(a);
    }
}

let lastKeys = [];
if (localStorage.getItem('admin--flag')) {
    enableAdminMode();
}

function deleteNote(uri) {
    return (ev) => {
        const parent = ev.target.parentNode;
        localStorage.removeItem(uri);
        parent.parentNode.removeChild(parent);
    };
}

function renderDashboard(notes) {
    // render my notes
    const dashboard = document.getElementById('dashboard');
    if (dashboard) {
        notes.forEach((uri) => {
            const node = document.createElement('div');
            node.setAttribute('class', 'somedaynote');
            const split = uri.split('/');
            const del = document.createElement('button');
            del.textContent = 'delete';
            const heading = document.createElement('a');
            heading.setAttribute('href', uri);
            heading.textContent = decodeURIComponent(split[split.length-1]);
            const note = document.createElement('div');
            note.textContent = localStorage.getItem(uri) || 'No note';
            node.appendChild(heading);
            node.appendChild(note);
            node.appendChild(del);
            del.addEventListener('click', deleteNote(uri));
            dashboard.appendChild(node);
        })
    }
}
export default function setupLocalEditing() {
    const localNote = document.querySelector('#local-edit [contenteditable]'),
        note = localStorage.getItem(LOCAL_NOTE),
        notes = Object.keys(localStorage).filter((key) => key.indexOf('--') === -1),
        dashboardLink = document.querySelector('.menu__link--dashboard');

    if (notes.length && dashboardLink) {
        dashboardLink.style.display = '';
    }
    renderDashboard(notes);
    if (!localNote) {
        return;
    }
    if (note) {
        localNote.textContent = note;
    }
    localNote.addEventListener('input', function (ev) {
        localStorage.setItem(LOCAL_NOTE, this.textContent);
        lastKeys.push(ev.data);
        if (lastKeys.length > 9) {
            if (lastKeys.join('').indexOf('adminbear') > -1) {
                localStorage.setItem('admin--flag', 1);
                enableAdminMode();
            }
            lastKeys = lastKeys.slice(1);
        }
    })
}
