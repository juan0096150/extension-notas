chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'REMINDER_DATA') {
        document.getElementById('reminderTitle').textContent = message.data.title;
        document.getElementById('reminderDescription').textContent = message.data.description;
    }
});

document.getElementById('closeButton').addEventListener('click', () => {
    window.close();
});