function saveNoteToStorage(note) {
    chrome.storage.sync.get('notes', (data) => {
        const notes = data.notes || [];
        notes.push(note);
        chrome.storage.sync.set({ notes }, () => {
            addNoteToUI(note);
            document.getElementById('noteForm').reset();
        });
    });
}

function saveReminderToStorage(reminder) {
    chrome.storage.sync.get('reminders', (data) => {
        const reminders = data.reminders || [];
        reminders.push(reminder);
        chrome.storage.sync.set({ reminders }, () => {
            addReminderToUI(reminder);
            document.getElementById('reminderForm').reset();
            scheduleReminder(reminder);
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

function loadReminders() {
    chrome.storage.sync.get('reminders', (data) => {
        if (data.reminders) {
            const remindersList = document.getElementById('remindersList');
            remindersList.innerHTML = '';
            data.reminders.forEach(reminder => {
                addReminderToUI(reminder);
                scheduleReminder(reminder);
            });
        }
    });
}

function exportData() {
    chrome.storage.sync.get(['notes', 'reminders'], (data) => {
        const exportData = JSON.stringify(data);
        const blob = new Blob([exportData], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'notas_y_recordatorios.json';
        a.click();
    });
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const importedData = JSON.parse(e.target.result);
            chrome.storage.sync.set(importedData, () => {
                loadNotes();
                loadReminders();
            });
        };
        reader.readAsText(file);
    };
    input.click();
}
