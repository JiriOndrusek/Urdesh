// Utility to manage cookies
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + value + ";expires=" + date.toUTCString() + ";path=/";
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
    return null;
}

// Load timer state from cookies
let timer = getCookie('timer') ? parseInt(getCookie('timer')) : 20 * 60; // Default to 20 minutes
let interval;

// Functions to display time and start/reset timer
function displayTime() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    document.getElementById('timer-display').textContent =
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (interval) return; // Prevent starting multiple intervals
    interval = setInterval(() => {
        timer--;
        setCookie('timer', timer, 1); // Save timer state
        displayTime();
        if (timer <= 0) {
            clearInterval(interval);
            interval = null;
            // Optionally, you might want to delete the cookie when timer ends
            setCookie('timer', '', -1); // Delete cookie after timer expires
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(interval);
    interval = null;
    timer = 20 * 60; // Reset to 20 minutes
    setCookie('timer', timer, 1); // Update cookie with new timer value
    displayTime();
}

// Button actions for adding time and toggling color
document.getElementById('plus-five').addEventListener('click', () => {
    timer += 5 * 60; // Add 5 minutes
    setCookie('timer', timer, 1); // Update cookie
    displayTime();
});

// Button color toggle
function toggleColor(button) {
    button.style.backgroundImage = button.style.backgroundImage.includes('button-red.png') ?
    'url(images/button-blue.png)' : 'url(images/button-red.png)';
}

document.getElementById('auspex').addEventListener('click', function() {
    toggleColor(this);
});

document.getElementById('main-coms').addEventListener('click', function() {
    toggleColor(this);
});

// Start/reset the timer using double-click
const timerDisplay = document.getElementById('timer-display');
timerDisplay.addEventListener('click', () => {
    startTimer();
});

timerDisplay.addEventListener('dblclick', () => {
    resetTimer();
});

// Initialize display on page load
displayTime();
