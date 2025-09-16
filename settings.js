document.addEventListener('DOMContentLoaded', () => {
    const settingsButton = document.getElementById('settings-button');
    const settingsModal = document.getElementById('settings-modal');
    const closeButton = settingsModal.querySelector('.close-button');
    const saveSettingsButton = document.getElementById('save-settings');
    const eventNameInput = document.getElementById('event-name');
    const countdownDateInput = document.getElementById('countdown-date');
    const themeSelect = document.getElementById('theme-select');
    const titleElement = document.querySelector('.title');
    const subtitleElement = document.getElementById('subtitle');
    const containerElement = document.querySelector('.container');
    const tileElements = document.querySelectorAll('.tile');


    // Handle custom color inputs
    const colorInputs = document.querySelectorAll('input[type="color"]');
    colorInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            document.documentElement.style.setProperty(`--${e.target.id}`, e.target.value);
        });
    });



    // Apply theme to body and main elements
    function applyTheme(theme) {
        const themes = [
            'theme-dark', 'theme-light',
            'theme-blue', 'theme-green', 'theme-red', 'theme-purple', 'theme-aqua', 'theme-orange',
            'theme-pink', 'theme-teal', 'theme-brown', 'theme-lime', 'theme-indigo', 'theme-custom',
        ];

        document.body.classList.remove(...themes);


        if (themes.includes('theme-' + theme)) {
            document.body.classList.add('theme-' + theme);
        } else {
            document.body.classList.add('theme-dark');
        }

        if (theme === 'custom') {
        }


    }

    // Load settings from local storage
    function loadSettings() {
        const savedEventName = localStorage.getItem('eventName');
        const savedCountdownDate = localStorage.getItem('countdownDate');
        const savedTheme = localStorage.getItem('theme') || 'dark';

        if (!savedEventName) {
            localStorage.setItem("eventName", "Something Big is Coming"); // Default value for input
        }

        if (!savedCountdownDate) {
            localStorage.setItem("countdownDate", "2025-11-29T00:00"); // Default to Nov. 29, 2025
        } else {
            try {
                let testDate = new Date(savedCountdownDate).getDate()
            } catch (error) {
                localStorage.setItem("countdownDate", "2025-11-29T00:00"); // Default to Nov. 29, 2025
            }
        }

        themeSelect.value = savedTheme;
        applyTheme(savedTheme);

        // restore custom colors
        colorInputs.forEach(input => {
            const savedColor = localStorage.getItem(input.id);
            if (savedColor) {
                document.documentElement.style.setProperty(`--${input.id}`, savedColor);
                //document.documentElement.style.setProperty(`--${input.id}`, savedColor);
                input.value = savedColor;
            }
        });


        updateCountdownDisplay();
    }

    // Save settings to local storage
    function saveSettings() {
        localStorage.setItem('eventName', eventNameInput.value);
        localStorage.setItem('countdownDate', countdownDateInput.value);
        localStorage.setItem('theme', themeSelect.value);

        // Save custom colors
        colorInputs.forEach(input => {
            localStorage.setItem(input.id, input.value);
        });
        
        settingsModal.style.display = 'none'; // Hide modal after saving
        applyTheme(themeSelect.value);
        updateCountdownDisplay();
    }

    // Update countdown display based on current settings
    function updateCountdownDisplay() {
        const eventName = localStorage.getItem('eventName'); // Get event name from local storage
        const countdownDate = localStorage.getItem('countdownDate');
        const targetDate = new Date(countdownDate).getTime();
        const now = new Date().getTime();

        let distance = targetDate - now;

        let countdownText = "Countdown to";
        if (distance < 0) {
            distance = Math.abs(distance);
            countdownText = "Time since";
            // Update title for past events
            if (eventName) {
                titleElement.textContent = `${eventName} (Passed)`;
            } else {
                titleElement.textContent = "Something Big Happened";
            }
        } else {
            // Update title for future events
            if (eventName) {
                titleElement.textContent = eventName;
            } else {
                titleElement.textContent = "Something Big is Coming";
            }
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerHTML = days;
        document.getElementById("hours").innerHTML = hours;
        document.getElementById("minutes").innerHTML = minutes;
        document.getElementById("seconds").innerHTML = seconds;

        const targetDateObj = new Date(countdownDate);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = targetDateObj.toLocaleDateString(undefined, options);
        const dayOfWeek = targetDateObj.toLocaleDateString(undefined, { weekday: 'long' });
        subtitleElement.textContent = `${countdownText} ${formattedDate} (${dayOfWeek})`;
    }

    settingsButton.addEventListener('click', () => {
        settingsModal.style.display = 'block';
        // Load current values into the form when opening
        eventNameInput.value = localStorage.getItem('eventName') || titleElement.textContent;
        countdownDateInput.value = localStorage.getItem('countdownDate') || '';
        themeSelect.value = localStorage.getItem('theme') || 'dark';
        customThemeSettings.style.display = themeSelect.value === 'custom' ? 'grid' : 'none';
    });

    closeButton.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    saveSettingsButton.addEventListener('click', saveSettings);
    themeSelect.addEventListener('change', (e) => {
        customThemeSettings.style.display = themeSelect.value === 'custom' ? 'grid' : 'none';
        applyTheme(e.target.value);
    });

    // Initial load of settings and update countdown
    loadSettings();

    // Update the countdown every 1 second
    setInterval(updateCountdownDisplay, 1000);
});
