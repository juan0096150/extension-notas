function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeColor = document.getElementById('themeColor');
    const body = document.body;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    const savedColor = localStorage.getItem('themeColor');

    if (savedTheme) {
        body.classList.add(savedTheme);
    }

    if (savedColor) {
        document.documentElement.style.setProperty('--primary-color', savedColor);
        themeColor.value = savedColor;
    }

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const currentTheme = body.classList.contains('dark-mode') ? 'dark-mode' : '';
        localStorage.setItem('theme', currentTheme);
        updateThemeToggleIcon();
    });

    // Color picker functionality
    themeColor.addEventListener('input', (e) => {
        const color = e.target.value;
        document.documentElement.style.setProperty('--primary-color', color);
        localStorage.setItem('themeColor', color);
    });

    updateThemeToggleIcon();
}

function updateThemeToggleIcon() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}
