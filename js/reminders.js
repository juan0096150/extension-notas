function initializeReminders() {
    const reminderForm = document.getElementById('reminderForm');
    const remindersList = document.getElementById('remindersList');

    reminderForm.addEventListener('submit', handleReminderSubmit);
    remindersList.addEventListener('click', handleReminderAction);

    loadReminders();
}

function handleReminderSubmit(e) {
    e.preventDefault();
    const reminderTitle = document.getElementById('reminderTitle').value;
    const reminderDescription = document.getElementById('reminderDescription').value;
    const reminderDateTime = document.getElementById('reminderDateTime').value;

    const newReminder = {
        title: reminderTitle,
        description: reminderDescription,
        dateTime: new Date(reminderDateTime).getTime()
    };

    saveReminderToStorage(newReminder);
}

function handleReminderAction(event) {
    const target = event.target;
    if (target.classList.contains('edit-reminder')) {
        editReminder(target.closest('li').dataset.title);
    } else if (target.classList.contains('delete-reminder')) {
        deleteReminder(target.closest('li').dataset.title);
    }
}

function addReminderToUI(reminder) {
    const remindersList = document.getElementById('remindersList');
    const li = document.createElement('li');
    li.dataset.title = reminder.title;
    li.innerHTML = `
        <span>${reminder.title}</span>
        <p>${reminder.description}</p>
        <p>Fecha: ${new Date(reminder.dateTime).toLocaleString()}</p>
        <button class="edit-reminder"><i class="fas fa-edit"></i> Editar</button>
        <button class="delete-reminder"><i class="fas fa-trash"></i> Eliminar</button>
    `;
    remindersList.appendChild(li);
}

function editReminder(title) {
    chrome.storage.sync.get('reminders', (data) => {
        const reminders = data.reminders || [];
        const reminderToEdit = reminders.find(reminder => reminder.title === title);
        if (reminderToEdit) {
            document.getElementById('reminderTitle').value = reminderToEdit.title;
            document.getElementById('reminderDescription').value = reminderToEdit.description;
            document.getElementById('reminderDateTime').value = new Date(reminderToEdit.dateTime).toISOString().slice(0, 16);
            deleteReminder(title);
        }
    });
}

function deleteReminder(title) {
    chrome.storage.sync.get('reminders', (data) => {
        const reminders = data.reminders || [];
        const updatedReminders = reminders.filter(reminder => reminder.title !== title);
        chrome.storage.sync.set({ reminders: updatedReminders }, () => {
            const remindersList = document.getElementById('remindersList');
            remindersList.innerHTML = '';
            updatedReminders.forEach(reminder => addReminderToUI(reminder));
        });
    });
}

function scheduleReminder(reminder) {
    const currentTime = Date.now();
    const timeUntilReminder = reminder.dateTime - currentTime;

    if (timeUntilReminder > 0) {
        setTimeout(() => {
            const audio = new Audio(chrome.runtime.getURL('alarm.mp3'));
            audio.play().catch(error => console.error("Error al reproducir el sonido: ", error));

            chrome.windows.create({
                url: 'reminder-alert.html',
                type: 'popup',
                width: 400,
                height: 200
            }, (window) => {
                chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
                    if (tabId === window.tabs[0].id && changeInfo.status === 'complete') {
                        chrome.tabs.sendMessage(window.tabs[0].id, {
                            type: 'REMINDER_DATA',
                            data: reminder
                        });
                        chrome.tabs.onUpdated.removeListener(listener);
                    }
                });
            });
        }, timeUntilReminder);
    }
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
