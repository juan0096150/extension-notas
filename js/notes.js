function initializeNotes() {
    const noteForm = document.getElementById('noteForm');
    const notesList = document.getElementById('notesList');
    const fileInput = document.getElementById('noteFile');

    noteForm.addEventListener('submit', handleNoteSubmit);
    notesList.addEventListener('click', handleNoteAction);

    loadNotes();
}

function handleNoteSubmit(e) {
    e.preventDefault();
    const noteTitle = document.getElementById('noteTitle').value;
    const noteContent = document.getElementById('noteContent').value;
    const file = document.getElementById('noteFile').files[0];
    const noteLink = document.getElementById('noteLink').value;

    const newNote = {
        title: noteTitle,
        content: noteContent,
        file: null,
        link: noteLink
    };

    if (file) {
        handleFileUpload(file, (fileData) => {
            newNote.file = fileData;
            saveNoteToStorage(newNote);
        });
    } else {
        saveNoteToStorage(newNote);
    }
}

function handleNoteAction(event) {
    const target = event.target;
    if (target.classList.contains('edit-note')) {
        editNote(target.closest('li').dataset.title);
    } else if (target.classList.contains('delete-note')) {
        deleteNote(target.closest('li').dataset.title);
    } else if (target.classList.contains('preview-file')) {
        previewFile(JSON.parse(target.dataset.file));
    }
}

function addNoteToUI(note) {
    const notesList = document.getElementById('notesList');
    const li = document.createElement('li');
    li.dataset.title = note.title;
    li.innerHTML = `
        <span>${note.title}</span>
        <p>${note.content}</p>
        ${note.link ? `<a href="${note.link}" target="_blank">Ver enlace</a>` : ''}
        ${note.file ? `<button class="preview-file" data-file='${JSON.stringify(note.file)}'>Previsualizar archivo</button>` : ''}
        <button class="edit-note"><i class="fas fa-edit"></i> Editar</button>
        <button class="delete-note"><i class="fas fa-trash"></i> Eliminar</button>
    `;
    notesList.appendChild(li);
}

function editNote(title) {
    chrome.storage.sync.get('notes', (data) => {
        const notes = data.notes || [];
        const noteToEdit = notes.find(note => note.title === title);
        if (noteToEdit) {
            document.getElementById('noteTitle').value = noteToEdit.title;
            document.getElementById('noteContent').value = noteToEdit.content;
            document.getElementById('noteLink').value = noteToEdit.link || '';
            deleteNote(title);
        }
    });
}

function deleteNote(title) {
    chrome.storage.sync.get('notes', (data) => {
        const notes = data.notes || [];
        const updatedNotes = notes.filter(note => note.title !== title);
        chrome.storage.sync.set({ notes: updatedNotes }, () => {
            const notesList = document.getElementById('notesList');
            notesList.innerHTML = '';
            updatedNotes.forEach(note => addNoteToUI(note));
        });
    });
}

function loadNotes() {
    chrome.storage.sync.get('notes', (data) => {
        if (data.notes) {
            const notesList = document.getElementById('notesList');
            notesList.innerHTML = '';
            data.notes.forEach(note => addNoteToUI(note));
        }
    });
}
