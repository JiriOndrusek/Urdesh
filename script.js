
let seconds = 20 * 60;
let running = false;
let interval = null;
let endTimestamp = null;
let lastTap = 0;

const timeEl = document.getElementById("time");

const button1 = document.getElementById("button1");
const button1Clicked1 = document.getElementById("button1Clicked1");
const button1Clicked2 = document.getElementById("button1Clicked2");


const button2 = document.getElementById("button2");
const button2Toggled = document.getElementById("button2Toggled");

const button3 = document.getElementById("button3");
const button3Toggled = document.getElementById("button3Toggled");

/* ---------- Persistence ---------- */
function saveState() {
  localStorage.setItem("seconds", seconds);
  localStorage.setItem("running", running);
  localStorage.setItem("endTimestamp", endTimestamp);
  localStorage.setItem("button1State", button1.classList.contains("hidden") ? button1Clicked1.classList.contains("hidden") ? "clicked2" : "clicked1" : "default");
  localStorage.setItem("button2State", button2Toggled.classList.contains("hidden") ? "default" : "toggled");
  localStorage.setItem("button3State", button3Toggled.classList.contains("hidden") ? "default" : "toggled");
}

function loadState() {
  if (localStorage.getItem("seconds"))
    seconds = parseInt(localStorage.getItem("seconds"));

  running = localStorage.getItem("running") === "true";
  endTimestamp = localStorage.getItem("endTimestamp");

  if (localStorage.getItem("button1State") === "clicked1") {
    button1.classList.add("hidden");
    button1Clicked1.classList.remove("hidden");
    button1Clicked2.classList.add("hidden");
    button1.onclick = null;
    button1Clicked2.onclick = null;
  } else if (localStorage.getItem("button1State") === "clicked2") {
    button1.classList.add("hidden");
    button1Clicked1.classList.add("hidden");
    button1Clicked2.classList.remove("hidden");
    button1.onclick = null;
    button1Clicked1.onclick = null;
  } else {
    button1.classList.remove("hidden");
    button1Clicked1.classList.add("hidden");
    button1Clicked2.classList.add("hidden");
  }

  if (localStorage.getItem("button2State") === "toggled") {
    button2Toggled.classList.remove("hidden");
  }

  if (localStorage.getItem("button3State") === "toggled") {
    button3Toggled.classList.remove("hidden");
  }

  if (running && endTimestamp) {
    seconds = Math.max(0, Math.floor((endTimestamp - Date.now()) / 1000));
  }
}

/* ---------- Display ---------- */
function update() {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  timeEl.textContent =
    String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  saveState();
}

/* ---------- Timer ---------- */
function start(resume = false) {
  if (interval) clearInterval(interval);

  running = true;
  if (!resume) {
    endTimestamp = Date.now() + seconds * 1000;
  }

  interval = setInterval(tick, 1000);
  tick();
}

function tick() {
  if (!running || !endTimestamp) return;

  seconds = Math.max(0, Math.floor((endTimestamp - Date.now()) / 1000));
  update();

  if (seconds <= 0) finish();
}

function stop() {
  running = false;
  clearInterval(interval);
  interval = null;
  endTimestamp = null;
  saveState();
}

function finish() {
  stop();
  timeEl.classList.add("finished");
}

/* ---------- Interactions ---------- */
timeEl.addEventListener("click", () => {
  const now = Date.now();
  if (now - lastTap < 350) {
    if (confirm("Reset timer to 20:00?")) {
      stop();
      seconds = 20 * 60;
      timeEl.classList.remove("finished");

      button1.classList.remove("hidden");
      button1Clicked1.classList.add("hidden");
      button1Clicked2.classList.add("hidden");
      button1.onclick = button1Click1Handler;

      update();
    }
  } else {
      start();
  }
  lastTap = now;
});

/* ---------- Buttons ---------- */

function button1Click1Handler() {
  seconds += 5 * 60;
  endTimestamp = Date.now() + seconds * 1000;
  button1.classList.add("hidden");
  button1Clicked2.classList.add("hidden");
  button1Clicked1.classList.remove("hidden");
  button1.onclick = null;
  button1Clicked1.onclick = button1Click2Handler;
  update();
}

function button1Click2Handler() {
  seconds += 5 * 60;
  endTimestamp = Date.now() + seconds * 1000;
  button1.classList.add("hidden");
  button1Clicked1.classList.add("hidden");
  button1Clicked2.classList.remove("hidden");
  button1Clicked1.onclick = null;
  update();
}
button1.onclick = button1Click1Handler;
button1Clicked1.onclick = button1Click2Handler;

button2.onclick = () => {
  button2Toggled.classList.toggle("hidden");
  saveState();
};
button2Toggled.onclick = () => {
  button2Toggled.classList.toggle("hidden");
  saveState();
};

button3.onclick = () => {
  button3Toggled.classList.toggle("hidden");
  saveState();
};
button3Toggled.onclick = () => {
  button3Toggled.classList.toggle("hidden");
  saveState();
};

let counterA = parseInt(localStorage.getItem("counterA") || 0);
let counterB = parseInt(localStorage.getItem("counterB") || 0);

const counterAValue = document.getElementById("counterAValue");
const counterBValue = document.getElementById("counterBValue");

function updateCounters() {
  counterAValue.textContent = counterA;
  counterBValue.textContent = counterB;
  localStorage.setItem("counterA", counterA);
  localStorage.setItem("counterB", counterB);
}

document.getElementById("counterAPlus").onclick = () => { counterA++; updateCounters(); };
document.getElementById("counterAMinus").onclick = () => { counterA--; updateCounters(); };
document.getElementById("counterBPlus").onclick = () => { counterB++; updateCounters(); };
document.getElementById("counterBMinus").onclick = () => { counterB--; updateCounters(); };

updateCounters();

/* ---------- Init ---------- */
loadState();
update();

if (running && seconds > 0 && endTimestamp) {
  start(true);
}

const timeInput = document.getElementById("timeInput");
const timeText = document.getElementById("time");

/* --- Enter edit mode --- */
timeText.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  stop(); // stop timer when editing
  timeInput.value = timeText.textContent;
  timeText.classList.add("hidden");
  timeInput.classList.remove("hidden");
  timeInput.focus();
});

/* --- Parse input --- */
function parseTime(value) {
  const parts = value.split(":").map(Number);
  if (parts.some(isNaN)) return null;

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return null;
}

/* --- Apply value --- */
timeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const newSeconds = parseTime(timeInput.value);
    if (newSeconds !== null && newSeconds >= 0) {
      seconds = newSeconds;
      update();
    }
    timeInput.classList.add("hidden");
    timeText.classList.remove("hidden");
  }

  if (e.key === "Escape") {
    timeInput.classList.add("hidden");
    timeText.classList.remove("hidden");
  }
});

