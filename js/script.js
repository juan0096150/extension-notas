document.addEventListener('DOMContentLoaded', () => {
    const noteForm = document.getElementById('noteForm');
    const notesList = document.getElementById('notesList');
    const reminderForm = document.getElementById('reminderForm');
    const remindersList = document.getElementById('remindersList');
    const fileInput = document.getElementById('noteFile');
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Tab functionality
    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                button.classList.add('active');
                document.getElementById(`${tabName}Section`).classList.add('active');
            });
        });
    }

    // Add note event
    noteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const noteTitle = document.getElementById('noteTitle').value;
        const noteContent = document.getElementById('noteContent').value;
        const file = fileInput.files[0];
        const noteLink = document.getElementById('noteLink').value;
        
        const newNote = { 
            title: noteTitle, 
            content: noteContent, 
            file: null,
            link: noteLink
        };

        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                newNote.file = {
                    name: file.name,
                    type: file.type,
                    data: reader.result
                };
                saveNoteToStorage(newNote);
            };
            reader.readAsDataURL(file);
        } else {
            saveNoteToStorage(newNote);
        }
    });

    // Add reminder event (unchanged)
    reminderForm.addEventListener('submit', (e) => {
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
    });

    // Event listeners for edit and delete buttons (unchanged)
    notesList.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('edit-note')) {
            editNote(target.closest('li').dataset.title);
        } else if (target.classList.contains('delete-note')) {
            deleteNote(target.closest('li').dataset.title);
        }
    });

    remindersList.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('edit-reminder')) {
            editReminder(target.closest('li').dataset.title);
        } else if (target.classList.contains('delete-reminder')) {
            deleteReminder(target.closest('li').dataset.title);
        }
    });

    // Load notes and reminders from storage
    loadNotesAndReminders();

    // Function to add note to UI
    function addNoteToUI(note) {
        const li = document.createElement('li');
        li.dataset.title = note.title;
        li.innerHTML = `
            <span>${note.title}</span>
            <p>${note.content}</p>
            ${note.link ? `<a href="${note.link}" target="_blank">Ver enlace</a>` : ''}
            ${note.file ? `<button class="preview-file" data-file="${note.file.data}">Previsualizar archivo</button>` : ''}
            <button class="edit-note"><i class="fas fa-edit"></i> Editar</button>
            <button class="delete-note"><i class="fas fa-trash"></i> Eliminar</button>
        `;
        notesList.appendChild(li);

        // Add event listener for file preview
        if (note.file) {
            li.querySelector('.preview-file').addEventListener('click', () => previewFile(note.file));
        }
    }

    function addReminderToUI(reminder) {
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

    // Save note to storage (unchanged)
    function saveNoteToStorage(note) {
        chrome.storage.sync.get('notes', (data) => {
            const notes = data.notes || [];
            notes.push(note);
            chrome.storage.sync.set({ notes }, () => {
                addNoteToUI(note);
                noteForm.reset();
            });
        });
    }

    // Save reminder to storage (unchanged)
    function saveReminderToStorage(reminder) {
        chrome.storage.sync.get('reminders', (data) => {
            const reminders = data.reminders || [];
            reminders.push(reminder);
            chrome.storage.sync.set({ reminders }, () => {
                addReminderToUI(reminder);
                reminderForm.reset();
                scheduleReminder(reminder);
            });
        });
    }

    // Edit note (unchanged)
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

    // Delete note (unchanged)
    function deleteNote(title) {
        chrome.storage.sync.get('notes', (data) => {
            const notes = data.notes || [];
            const updatedNotes = notes.filter(note => note.title !== title);
            chrome.storage.sync.set({ notes: updatedNotes }, () => {
                notesList.innerHTML = '';
                updatedNotes.forEach(note => addNoteToUI(note));
            });
        });
    }

    // Edit reminder (unchanged)
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

    // Delete reminder (unchanged)
    function deleteReminder(title) {
        chrome.storage.sync.get('reminders', (data) => {
            const reminders = data.reminders || [];
            const updatedReminders = reminders.filter(reminder => reminder.title !== title);
            chrome.storage.sync.set({ reminders: updatedReminders }, () => {
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
                    // Usamos chrome.tabs.onUpdated para asegurarnos de que la ventana esté cargada
                    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
                        if (tabId === window.tabs[0].id && changeInfo.status === 'complete') {
                            chrome.tabs.sendMessage(window.tabs[0].id, {
                                type: 'REMINDER_DATA',
                                data: reminder
                            });
                            // Removemos el listener después de que el mensaje ha sido enviado
                            chrome.tabs.onUpdated.removeListener(listener);
                        }
                    });
                });
            }, timeUntilReminder);
        }
    }

    function loadNotesAndReminders() {
        chrome.storage.sync.get(['notes', 'reminders'], (data) => {
            if (data.notes) {
                notesList.innerHTML = '';
                data.notes.forEach(note => addNoteToUI(note));
            }
            if (data.reminders) {
                remindersList.innerHTML = '';
                data.reminders.forEach(reminder => {
                    addReminderToUI(reminder);
                    scheduleReminder(reminder);
                });
            }
        });
    }

    // New function to preview files
    function previewFile(file) {
        const previewWindow = window.open('', '_blank');
        previewWindow.document.write(`
            <html>
                <head>
                    <title>Vista previa del archivo</title>
                </head>
                <body>
                    ${file.type.startsWith('image/') 
                        ? `<img src="${file.data}" alt="Vista previa">`
                        : `<iframe src="${file.data}" width="100%" height="100%"></iframe>`
                    }
                </body>
            </html>
        `);
    }

    // Export functionality
    exportBtn.addEventListener('click', () => {
        chrome.storage.sync.get(['notes', 'reminders'], (data) => {
            const exportData = JSON.stringify(data);
            const blob = new Blob([exportData], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'notas_y_recordatorios.json';
            a.click();
        });
    });

    // Import functionality
    importBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const importedData = JSON.parse(e.target.result);
                chrome.storage.sync.set(importedData, () => {
                    loadNotesAndReminders();
                });
            };
            reader.readAsText(file);
        };
        input.click();
    });

    // Funcionalidad de la calculadora
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.calc-btn');
    const equalsButton = document.getElementById('equals');
    const clearButton = document.getElementById('clear');

    let currentOperation = '';
    let firstOperand = null;
    let waitingForSecondOperand = false;

    function updateDisplay() {
        display.value = currentOperation;
    }

    function clear() {
        currentOperation = '';
        firstOperand = null;
        waitingForSecondOperand = false;
        updateDisplay();
    }

    function inputDigit(digit) {
        if (waitingForSecondOperand) {
            currentOperation = digit;
            waitingForSecondOperand = false;
        } else {
            currentOperation = currentOperation === '0' ? digit : currentOperation + digit;
        }
        updateDisplay();
    }

    function inputDecimal() {
        if (!currentOperation.includes('.')) {
            currentOperation += '.';
            updateDisplay();
        }
    }

    function handleOperator(operator) {
        const inputValue = parseFloat(currentOperation);

        if (firstOperand === null) {
            firstOperand = inputValue;
        } else if (waitingForSecondOperand) {
            currentOperation = inputValue.toString();
            updateDisplay();
            return;
        } else {
            const result = performCalculation(firstOperand, inputValue, currentOperation);
            currentOperation = parseFloat(result.toFixed(7));
            firstOperand = result;
        }

        waitingForSecondOperand = true;
        currentOperation = operator;
        updateDisplay();
    }

    function performCalculation(firstOperand, secondOperand, operator) {
        switch (operator) {
            case '+':
                return firstOperand + secondOperand;
            case '-':
                return firstOperand - secondOperand;
            case '*':
                return firstOperand * secondOperand;
            case '/':
                return firstOperand / secondOperand;
            default:
                return secondOperand;
        }
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('operator')) {
                handleOperator(button.textContent);
            } else if (button.textContent === '.') {
                inputDecimal();
            } else {
                inputDigit(button.textContent);
            }
        });
    });

    equalsButton.addEventListener('click', () => {
        if (firstOperand !== null && operator) {
            const result = performCalculation(firstOperand, parseFloat(currentValue), operator);
            currentValue = String(result);
            operator = null;
            firstOperand = null;
            updateDisplay();
        }
    });

    clearButton.addEventListener('click', clear);

    // Asegúrate de que la funcionalidad de las pestañas también incluya la calculadora
    const calculatorTab = document.querySelector('[data-tab="calculator"]');
    const calculatorSection = document.getElementById('calculatorSection');

    calculatorTab.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        calculatorTab.classList.add('active');
        calculatorSection.classList.add('active');
    });
});