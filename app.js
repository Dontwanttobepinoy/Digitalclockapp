// ---- Persistent Settings ---- //
const storageKeys = {
  format24h: 'digitalclock_24h',
  mute: 'digitalclock_mute',
  menuHidden: 'digitalclock_menu_hidden',
  lastMode: 'digitalclock_last_mode'
};
function saveSetting(key, value) {
  localStorage.setItem(storageKeys[key], JSON.stringify(value));
}
function getSetting(key, def) {
  const v = localStorage.getItem(storageKeys[key]);
  return v !== null ? JSON.parse(v) : def;
}

// ---- App State ---- //
let state = {
  mode: getSetting('lastMode', 'clock'),
  format24h: getSetting('format24h', false),
  mute: getSetting('mute', false),
  menuHidden: getSetting('menuHidden', true),
  timer: {
    running: false,
    time: 0,
    ms: 0,
    interval: null,
    alarmActive: false,
    endTime: null // For wall-clock timer
  },
  stopwatch: {
    running: false,
    time: 0,
    ms: 0,
    interval: null,
    startTime: null,       // for wall-clock stopwatch
    pausedDuration: 0,     // total ms paused
    pausedAt: null         // when paused
  }
};
let isColonOn = true;
let colonInterval = null;
function startColonBlink() {
  if (colonInterval) clearInterval(colonInterval);
  colonInterval = setInterval(() => {
    isColonOn = !isColonOn;
    if (state.mode === 'clock') renderClock();
    if (state.mode === 'stopwatch' && state.stopwatch.running) renderStopwatch();
    if (state.mode === 'timer' && state.timer.running) renderTimer();
  }, 500);
}
startColonBlink();

// ---- DOM Refs ---- //
const modes = ['clock','timer','stopwatch'];
const containers = {
  clock: document.getElementById('clock-container'),
  timer: document.getElementById('timer-container'),
  stopwatch: document.getElementById('stopwatch-container')
};
const menuBar = document.getElementById('menu-bar');
const unhideBtn = document.getElementById('unhide-btn');
const btns = {
  clock: document.getElementById('clock-btn'),
  timer: document.getElementById('timer-btn'),
  stopwatch: document.getElementById('stopwatch-btn'),
  _24h: document.getElementById('toggle-24h'),
  mute: document.getElementById('toggle-mute'),
  fullscreen: document.getElementById('toggle-fullscreen'),
  hide: document.getElementById('hide-menu-btn')
};

// ---- Audio ---- //
const clickAudio = (() => {
  let audio = document.createElement('audio');
  audio.src = 'click.wav';
  audio.preload = 'auto';
  return audio;
})();
const alarmAudio = (() => {
  let audio = document.createElement('audio');
  audio.src = 'alarm.wav';
  audio.preload = 'auto';
  return audio;
})();

// ---- Util ---- //
function getBlinkingColon(blink) {
  if (blink) {
    return isColonOn ? ':' : '<span class="colon-off">:</span>';
  } else {
    return ':';
  }
}

// ---- CLOCK ---- //
function renderClock() {
  const now = new Date();
  let h = now.getHours();
  let m = now.getMinutes();
  let ap = '';
  if (!state.format24h) {
    ap = h >= 12 ? ' PM' : ' AM';
    h = h % 12; if (h === 0) h = 12;
  }
  let sep = getBlinkingColon(true);
  document.getElementById('clock').innerHTML =
    h.toString().padStart(2, '0') + sep + m.toString().padStart(2, '0') + ap;
  document.getElementById('date').textContent =
    now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).replace(/ /g, '/').replace(/,/, '').toUpperCase();
}

// ---- TIMER ---- //
let timerInput = {
  hours: document.getElementById('timer-hh'),
  minutes: document.getElementById('timer-mm'),
  seconds: document.getElementById('timer-ss')
};
let timerDisplay = document.getElementById('timer');
let timerMSDisplay = document.getElementById('timer-ms');
function renderTimer() {
  let t = state.timer.time;
  let ms = state.timer.ms;
  let h = Math.floor(t/3600), m = Math.floor((t%3600)/60), s = t%60;
  let sep = getBlinkingColon(state.timer.running);
  timerDisplay.innerHTML =
    h.toString().padStart(2,'0') + sep +
    m.toString().padStart(2,'0') + sep +
    s.toString().padStart(2,'0');
  timerMSDisplay.innerHTML = state.timer.running
    ? (ms.toString().padStart(3, '0')) + ' ms'
    : '000 ms';
}
function stopAllSounds() {
  [alarmAudio, clickAudio].forEach(aud => {
    if (aud) {
      aud.pause();
      aud.currentTime = 0;
    }
  });
}
function playSound(audioElem) {
  if (!audioElem || state.mute) return;
  try {
    audioElem.currentTime = 0;
    audioElem.play().catch(()=>{});
  } catch {}
}

function timerStart() {
  if (state.timer.running || (state.timer.time <= 0 && state.timer.ms <= 0)) return;
  let totalMS = state.timer.time * 1000 + state.timer.ms;
  state.timer.endTime = Date.now() + totalMS;
  state.timer.running = true;
  state.timer.alarmActive = false;
  state.timer.interval = setInterval(timerTick, 100);
  renderTimer();
}
function timerTick() {
  if (!state.timer.running) return;
  let remaining = state.timer.endTime - Date.now();
  if (remaining < 0) remaining = 0;
  let t = Math.floor(remaining / 1000);
  let ms = Math.floor(remaining % 1000);
  state.timer.time = t;
  state.timer.ms = ms;
  renderTimer();

  if (remaining <= 0) {
    if (!state.mute) {
      playSound(alarmAudio);
      state.timer.alarmActive = true;
    }
    clearInterval(state.timer.interval);
    state.timer.running = false;
    renderTimer();
  }
}
function timerStop() {
  state.timer.running = false;
  clearInterval(state.timer.interval);
  if (state.timer.alarmActive) {
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
    state.timer.alarmActive = false;
  }
  state.timer.endTime = null;
  renderTimer();
}
function timerResetToInput() {
  timerStop();
  let h = parseInt(timerInput.hours.value, 10) || 0;
  let m = parseInt(timerInput.minutes.value, 10) || 0;
  let s = parseInt(timerInput.seconds.value, 10) || 0;
  state.timer.time = h * 3600 + m * 60 + s;
  state.timer.ms = 0;
  state.timer.endTime = null;
  renderTimer();
}
function timerClear() {
  timerStop();
  timerInput.hours.value = '';
  timerInput.minutes.value = '';
  timerInput.seconds.value = '';
  state.timer.time = 0;
  state.timer.ms = 0;
  state.timer.endTime = null;
  renderTimer();
}

document.getElementById('timer-start').onclick = () => {
  playSound(clickAudio);
  timerStart();
};
document.getElementById('timer-stop').onclick = () => {
  playSound(clickAudio);
  timerStop();
};
document.getElementById('timer-reset').onclick = () => {
  playSound(clickAudio);
  timerResetToInput();
};
document.getElementById('timer-clear').onclick = () => {
  playSound(clickAudio);
  timerClear();
};

document.querySelectorAll('.inc-btn').forEach(btn => {
  btn.onclick = () => {
    playSound(clickAudio);
    let type = btn.id.split('-')[2]; // "hh", "mm", "ss"
    let input = timerInput[type === "hh" ? "hours" : type === "mm" ? "minutes" : "seconds"];
    let max = parseInt(input.max, 10);
    let val = parseInt(input.value || '0', 10);
    if (val < max) input.value = val + 1;
    else input.value = max;
    timerUpdateStateFromInputs();
  };
});
document.querySelectorAll('.dec-btn').forEach(btn => {
  btn.onclick = () => {
    playSound(clickAudio);
    let type = btn.id.split('-')[2];
    let input = timerInput[type === "hh" ? "hours" : type === "mm" ? "minutes" : "seconds"];
    let min = parseInt(input.min, 10);
    let val = parseInt(input.value || '0', 10);
    if (val > min) input.value = val - 1;
    else input.value = min;
    timerUpdateStateFromInputs();
  };
});
timerInput.hours.addEventListener('input', timerUpdateStateFromInputs);
timerInput.minutes.addEventListener('input', timerUpdateStateFromInputs);
timerInput.seconds.addEventListener('input', timerUpdateStateFromInputs);

function timerUpdateStateFromInputs() {
  let h = parseInt(timerInput.hours.value, 10) || 0;
  let m = parseInt(timerInput.minutes.value, 10) || 0;
  let s = parseInt(timerInput.seconds.value, 10) || 0;
  state.timer.time = h * 3600 + m * 60 + s;
  state.timer.ms = 0;
  state.timer.endTime = null;
  renderTimer();
}

// ---- STOPWATCH (wall clock accurate, with pause/resume bug FIXED) ---- //
let swDisplay = document.getElementById('stopwatch');
let swMsDisplay = document.getElementById('stopwatch-ms');
function renderStopwatch() {
  let t = state.stopwatch.time;
  let ms = state.stopwatch.ms;
  let h = Math.floor(t/3600), m = Math.floor((t%3600)/60), s = t%60;
  let sep = getBlinkingColon(state.stopwatch.running);
  swDisplay.innerHTML =
    h.toString().padStart(2, '0') + sep +
    m.toString().padStart(2, '0') + sep +
    s.toString().padStart(2, '0');
  swMsDisplay.innerHTML = state.stopwatch.running
    ? (ms.toString().padStart(3, '0')) + ' ms'
    : '000 ms';
}

// Wall clock stopwatch tick
function swTick() {
  if (!state.stopwatch.running) return;
  const now = Date.now();
  let elapsed = now - state.stopwatch.startTime - state.stopwatch.pausedDuration;
  if (elapsed < 0) elapsed = 0;
  let t = Math.floor(elapsed / 1000);
  let ms = Math.floor(elapsed % 1000);
  state.stopwatch.time = t;
  state.stopwatch.ms = ms;
  renderStopwatch();
}

// FIXED PAUSE/RESUME BUG:
function startStopwatch() {
  if (state.stopwatch.running) return;
  state.stopwatch.running = true;
  if (state.stopwatch.startTime === null) {
    // Not started yet
    state.stopwatch.startTime = Date.now();
    state.stopwatch.pausedDuration = 0;
    state.stopwatch.pausedAt = null;
  } else if (state.stopwatch.pausedAt !== null) {
    // Resume from pause; add only the duration paused now
    state.stopwatch.pausedDuration += Date.now() - state.stopwatch.pausedAt;
    state.stopwatch.pausedAt = null;
  }
  state.stopwatch.interval = setInterval(swTick, 33); // update ~30 fps for smoothness
  renderStopwatch();
}

function stopStopwatch() {
  if (!state.stopwatch.running) return;
  state.stopwatch.running = false;
  clearInterval(state.stopwatch.interval);
  state.stopwatch.pausedAt = Date.now();
  renderStopwatch();
}
// CLEAR for stopwatch
function clearStopwatch() {
  stopStopwatch();
  state.stopwatch.time = 0;
  state.stopwatch.ms = 0;
  state.stopwatch.startTime = null;
  state.stopwatch.pausedDuration = 0;
  state.stopwatch.pausedAt = null;
  swLaps = [];
  updateLapList();
  renderStopwatch();
}

document.getElementById('stopwatch-start').onclick = () => {
  playSound(clickAudio);
  startStopwatch();
};
document.getElementById('stopwatch-stop').onclick = () => {
  playSound(clickAudio);
  stopStopwatch();
};
document.getElementById('stopwatch-reset').onclick = () => {
  playSound(clickAudio);
  clearStopwatch();
};
document.getElementById('stopwatch-lap').onclick = () => {
  playSound(clickAudio);
  addLap();
};

// ---- LAP Feature (shows only 3 lines, scrolls for overflow, always fixed height) ---- //
let swLapList = document.getElementById('lap-list');
let swLaps = [];
function updateLapList() {
  swLapList.innerHTML = '';
  for (let i = 0; i < swLaps.length; ++i) {
    const idx = swLaps.length - i;
    const lap = swLaps[i];
    const div = document.createElement('div');
    div.textContent = 'LAP ' + idx + '  ' + lap;
    if (i === 0) div.classList.add('latest');
    swLapList.appendChild(div);
  }
  swLapList.scrollTop = 0;
}
function addLap() {
  if (!state.stopwatch.running) return;
  // Calculate lap time using accurate wall-clock logic
  const now = Date.now();
  let elapsed = now - state.stopwatch.startTime - state.stopwatch.pausedDuration;
  if (elapsed < 0) elapsed = 0;
  let h = Math.floor(elapsed / 1000 / 3600);
  let m = Math.floor((elapsed / 1000 % 3600) / 60);
  let s = Math.floor((elapsed / 1000) % 60);
  const formatted = h.toString().padStart(2, '0') + ':' +
                    m.toString().padStart(2, '0') + ':' +
                    s.toString().padStart(2, '0');
  swLaps.unshift(formatted);
  if (swLaps.length > 100) swLaps.length = 100;
  updateLapList();
}

// ---- Menu & Settings ---- //
function updateModeUI() {
  modes.forEach(m => {
    containers[m].classList.toggle('active', state.mode === m);
    btns[m].classList.toggle('active', state.mode === m);
  });
  saveSetting('lastMode', state.mode);
}
function updateMenuVisibility() {
  menuBar.style.display = state.menuHidden ? 'none' : 'flex';
  unhideBtn.style.display = state.menuHidden ? 'block' : 'none';
  saveSetting('menuHidden', state.menuHidden);
}
function update24hBtn() {
  btns._24h.setAttribute('aria-pressed', state.format24h ? "true" : "false");
}
function updateMuteBtn() {
  btns.mute.setAttribute('aria-pressed', state.mute ? "true" : "false");
}
function setMode(mode) {
  if (!modes.includes(mode)) return;
  state.mode = mode;
  updateModeUI();
  saveSetting('lastMode', mode);
  if (mode === 'timer') renderTimer();
  if (mode === 'stopwatch') renderStopwatch();
  if (mode === 'clock') renderClock();
}
function set24h(flag) {
  state.format24h = flag;
  update24hBtn();
  saveSetting('format24h', flag);
  renderClock();
}
function setMute(flag) {
  state.mute = flag;
  updateMuteBtn();
  stopAllSounds();
  saveSetting('mute', flag);
}

btns.clock.onclick = () => { playSound(clickAudio); setMode('clock'); };
btns.timer.onclick = () => { playSound(clickAudio); setMode('timer'); };
btns.stopwatch.onclick = () => { playSound(clickAudio); setMode('stopwatch'); };

btns._24h.onclick = ()=>{
  playSound(clickAudio);
  set24h(!state.format24h);
  update24hBtn();
  btns._24h.blur();
};
btns.mute.onclick = ()=>{
  playSound(clickAudio);
  setMute(!state.mute);
  updateMuteBtn();
  btns.mute.blur();
};
btns.fullscreen.onclick = ()=>{
  playSound(clickAudio);
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(()=>{});
  } else {
    document.exitFullscreen().catch(()=>{});
  }
  btns.fullscreen.blur();
};
btns.hide.onclick = ()=>{
  playSound(clickAudio);
  state.menuHidden = true; updateMenuVisibility();
  unhideFadeLogic();
};
unhideBtn.onclick = ()=>{
  playSound(clickAudio);
  state.menuHidden = false;
  updateMenuVisibility();
  unhideFadeLogic();
};

function unhideFadeLogic() {
  let timeout = null;
  function show() {
    unhideBtn.classList.remove('faded');
    clearTimeout(timeout);
    timeout = setTimeout(() => unhideBtn.classList.add('faded'), 3000);
  }
  document.addEventListener('mousemove', show);
  document.addEventListener('touchstart', show);
  unhideBtn.addEventListener('focus', show);
  show();
}
unhideFadeLogic();

// Keyboard nav
document.addEventListener('keydown', (e)=>{
  if (state.menuHidden) {
    if (e.key === 'Escape' || e.key === 'Enter') {
      state.menuHidden = false; updateMenuVisibility();
      unhideFadeLogic();
    }
    return;
  }
  const idx = modes.indexOf(state.mode);
  if (['ArrowLeft','ArrowUp'].includes(e.key)) {
    setMode(modes[(idx-1+modes.length)%modes.length]);
  }
  if (['ArrowRight','ArrowDown'].includes(e.key)) {
    setMode(modes[(idx+1)%modes.length]);
  }
  if (e.key === 'Escape') {
    state.menuHidden = true; updateMenuVisibility();
    unhideFadeLogic();
  }
  if (e.key === 'Enter') {
    btns[state.mode].focus();
  }
});

// ---- Init ---- //
function appInit() {
  updateModeUI();
  update24hBtn();
  updateMuteBtn();
  updateMenuVisibility();
  unhideFadeLogic();

  setMode(state.mode);
  renderClock();
  renderTimer();
  renderStopwatch();
  updateLapList();
}
appInit();
setInterval(()=>{
  if (state.mode === 'clock') renderClock();
  if (state.mode === 'stopwatch' && state.stopwatch.running) renderStopwatch();
  if (state.mode === 'timer' && state.timer.running) renderTimer();
}, 100);

