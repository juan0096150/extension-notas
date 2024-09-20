document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializeNotes();
    initializeReminders();
    initializeCalculator();
    initializeExportImport();
    initializeTheme();
});

function initializeExportImport() {
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');

    exportBtn.addEventListener('click', exportData);
    importBtn.addEventListener('click', importData);
}
