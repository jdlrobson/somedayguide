const LOCAL_NOTE = window.location.pathname;

export default function setupLocalEditing() {
    const localNote = document.querySelector('#local-edit [contenteditable]'),
        note = localStorage.getItem(LOCAL_NOTE);
    if (note && localNote) {
        localNote.textContent = note;
        localNote.addEventListener('input', function (ev) {
            localStorage.setItem(LOCAL_NOTE, this.textContent);
        })
    }
}
