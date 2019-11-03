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
export default function setupLocalEditing() {
    const localNote = document.querySelector('#local-edit [contenteditable]'),
        note = localStorage.getItem(LOCAL_NOTE);
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
