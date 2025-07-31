class DigitalClockApp {
    constructor() {
        this.currentMode = 'clock';
        this.is24HourFormat = false;
        this.isMuted = false;
        this.isFullscreen = false;
        this.menuHidden = false;
        this.isDualClock = false;
        this.currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.clock1Timezone = this.currentTimezone;
        this.clock2Timezone = 'UTC';
        this.activeTimezoneButton = null;
        
        // Timer state
        this.timerHours = 0;
        this.timerMinutes = 0;
        this.timerSeconds = 0;
        this.timerMs = 0;
        this.timerInterval = null;
        this.timerRunning = false;
        this.timerSetHours = 0;
        this.timerSetMinutes = 0;
        this.timerSetSeconds = 0;
        this.timerSetMs = 0;
        
        // Stopwatch state
        this.stopwatchMs = 0;
        this.stopwatchInterval = null;
        this.stopwatchRunning = false;
        this.lapTimes = [];
        this.lapCounter = 0;
        
        // Auto-hide timers
        this.inactivityTimer = null;
        this.bannerTimer = null;
        this.lastActivity = Date.now();
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupTimezones();
        this.startClock();
        this.startInactivityTimer();
        this.preloadSounds();
    }
    
    setupEventListeners() {
        // Menu navigation
        document.getElementById('clock-btn').addEventListener('click', () => this.switchMode('clock'));
        document.getElementById('timer-btn').addEventListener('click', () => this.switchMode('timer'));
        document.getElementById('stopwatch-btn').addEventListener('click', () => this.switchMode('stopwatch'));
        
        // Menu toggles
        document.getElementById('format-toggle').addEventListener('click', () => this.toggle24Hour());
        document.getElementById('mute-toggle').addEventListener('click', () => this.toggleMute());
        document.getElementById('fullscreen-toggle').addEventListener('click', () => this.toggleFullscreen());
        document.getElementById('hide-menu-toggle').addEventListener('click', () => this.toggleMenuVisibility());
        
        // Clock controls
        document.getElementById('local-btn').addEventListener('click', () => this.openTimezoneModal('single'));
        document.getElementById('add-clock-btn').addEventListener('click', () => this.addSecondClock());
        document.getElementById('local1-btn').addEventListener('click', () => this.openTimezoneModal('clock1'));
        document.getElementById('local2-btn').addEventListener('click', () => this.openTimezoneModal('clock2'));
        document.getElementById('remove1-btn').addEventListener('click', () => this.removeClock());
        document.getElementById('remove2-btn').addEventListener('click', () => this.removeClock());
        
        // Timer controls
        document.querySelectorAll('.plus-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.adjustTimer(e.target.dataset.unit, 1));
        });
        document.querySelectorAll('.minus-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.adjustTimer(e.target.dataset.unit, -1));
        });
        document.getElementById('timer-start').addEventListener('click', () => this.toggleTimer());
        document.getElementById('timer-reset').addEventListener('click', () => this.resetTimer());
        
        // Timer field editing
        document.getElementById('timer-hours').addEventListener('click', () => this.editTimerField('hours'));
        document.getElementById('timer-minutes').addEventListener('click', () => this.editTimerField('minutes'));
        document.getElementById('timer-seconds').addEventListener('click', () => this.editTimerField('seconds'));
        document.getElementById('timer-ms').addEventListener('click', () => this.editTimerField('ms'));
        
        // Stopwatch controls
        document.getElementById('stopwatch-start').addEventListener('click', () => this.toggleStopwatch());
        document.getElementById('stopwatch-lap').addEventListener('click', () => this.addLap());
        document.getElementById('stopwatch-reset').addEventListener('click', () => this.resetStopwatch());
        
        // Timezone modal
        document.getElementById('close-timezone').addEventListener('click', () => this.closeTimezoneModal());
        document.getElementById('timezone-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeTimezoneModal();
        });
        
        // Activity tracking
        document.addEventListener('mousemove', () => this.onUserActivity());
        document.addEventListener('keydown', () => this.onUserActivity());
        document.addEventListener('click', () => this.onUserActivity());
        document.addEventListener('touchstart', () => this.onUserActivity());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }
    
    setupTimezones() {
        const timezones = [
            { name: 'Local Time', value: this.currentTimezone },
            { name: 'UTC', value: 'UTC' },
            { name: 'UTC-12 (Baker Island)', value: 'Etc/GMT+12' },
            { name: 'UTC-11 (Samoa)', value: 'Pacific/Samoa' },
            { name: 'UTC-10 (Hawaii)', value: 'Pacific/Honolulu' },
            { name: 'UTC-9 (Alaska)', value: 'America/Anchorage' },
            { name: 'UTC-8 (Pacific)', value: 'America/Los_Angeles' },
            { name: 'UTC-7 (Mountain)', value: 'America/Denver' },
            { name: 'UTC-6 (Central)', value: 'America/Chicago' },
            { name: 'UTC-5 (Eastern)', value: 'America/New_York' },
            { name: 'UTC-4 (Atlantic)', value: 'America/Halifax' },
            { name: 'UTC-3 (Brazil)', value: 'America/Sao_Paulo' },
            { name: 'UTC-2 (Mid Atlantic)', value: 'Etc/GMT+2' },
            { name: 'UTC-1 (Azores)', value: 'Atlantic/Azores' },
            { name: 'UTC+0 (London)', value: 'Europe/London' },
            { name: 'UTC+1 (Berlin)', value: 'Europe/Berlin' },
            { name: 'UTC+2 (Cairo)', value: 'Africa/Cairo' },
            { name: 'UTC+3 (Moscow)', value: 'Europe/Moscow' },
            { name: 'UTC+4 (Dubai)', value: 'Asia/Dubai' },
            { name: 'UTC+5 (Karachi)', value: 'Asia/Karachi' },
            { name: 'UTC+6 (Dhaka)', value: 'Asia/Dhaka' },
            { name: 'UTC+7 (Bangkok)', value: 'Asia/Bangkok' },
            { name: 'UTC+8 (Beijing)', value: 'Asia/Shanghai' },
            { name: 'UTC+9 (Tokyo)', value: 'Asia/Tokyo' },
            { name: 'UTC+10 (Sydney)', value: 'Australia/Sydney' },
            { name: 'UTC+11 (Solomon Islands)', value: 'Pacific/Guadalcanal' },
            { name: 'UTC+12 (New Zealand)', value: 'Pacific/Auckland' }
        ];
        
        const timezoneList = document.getElementById('timezone-list');
        timezones.forEach(tz => {
            const item = document.createElement('div');
            item.className = 'timezone-item';
            item.textContent = tz.name;
            item.dataset.timezone = tz.value;
            item.addEventListener('click', () => this.selectTimezone(tz.value));
            timezoneList.appendChild(item);
        });
    }
    
    preloadSounds() {
        // Create dummy audio elements since we don't have actual sound files
        const clickSound = document.getElementById('click-sound');
        const alarmSound = document.getElementById('alarm-sound');
        
        // In a real implementation, these would be actual audio files
        if (clickSound) {
            clickSound.volume = 0.3;
        }
        if (alarmSound) {
            alarmSound.volume = 0.5;
        }
    }
    
    playSound(type) {
        if (this.isMuted) return;
        
        try {
            const audio = document.getElementById(type + '-sound');
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(() => {
                    // Ignore audio play errors in browsers that require user interaction
                });
            }
        } catch (e) {
            // Ignore audio errors
        }
    }
    
    onUserActivity() {
        this.lastActivity = Date.now();
        this.showMenu();
        this.showBanner();
        this.resetInactivityTimer();
    }
    
    resetInactivityTimer() {
        clearTimeout(this.inactivityTimer);
        clearTimeout(this.bannerTimer);
        
        // Menu auto-hide after 3 seconds
        this.inactivityTimer = setTimeout(() => {
            if (!this.menuHidden) {
                this.hideMenu();
            }
        }, 3000);
        
        // Banner auto-hide after 5 seconds
        this.bannerTimer = setTimeout(() => {
            this.hideBanner();
        }, 5000);
    }
    
    startInactivityTimer() {
        this.resetInactivityTimer();
    }
    
    showMenu() {
        if (!this.menuHidden) {
            document.getElementById('menu-bar').classList.remove('hidden');
        }
    }
    
    hideMenu() {
        if (!this.menuHidden) {
            document.getElementById('menu-bar').classList.add('hidden');
        }
    }
    
    showBanner() {
        document.getElementById('site-banner').classList.remove('hidden');
    }
    
    hideBanner() {
        document.getElementById('site-banner').classList.add('hidden');
    }
    
    switchMode(mode) {
        this.playSound('click');
        
        // Update menu buttons
        document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(mode + '-btn').classList.add('active');
        
        // Update mode containers
        document.querySelectorAll('.mode-container').forEach(container => {
            container.classList.remove('active');
        });
        document.getElementById(mode + '-mode').classList.add('active');
        
        this.currentMode = mode;
        
        // Stop any running timers when switching modes
        if (mode !== 'timer' && this.timerInterval) {
            this.stopTimer();
        }
        if (mode !== 'stopwatch' && this.stopwatchInterval) {
            this.stopStopwatch();
        }
    }
    
    toggle24Hour() {
        this.playSound('click');
        this.is24HourFormat = !this.is24HourFormat;
        
        const toggle = document.getElementById('format-toggle');
        toggle.textContent = this.is24HourFormat ? '12H' : '24H';
        toggle.classList.toggle('active', this.is24HourFormat);
    }
    
    toggleMute() {
        this.playSound('click');
        this.isMuted = !this.isMuted;
        
        const toggle = document.getElementById('mute-toggle');
        toggle.classList.toggle('active', this.isMuted);
        
        // Stop alarm if currently playing
        if (this.isMuted) {
            const alarmSound = document.getElementById('alarm-sound');
            if (alarmSound) alarmSound.pause();
        }
    }
    
    toggleFullscreen() {
        this.playSound('click');
        
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                this.isFullscreen = true;
                document.getElementById('fullscreen-toggle').classList.add('active');
            });
        } else {
            document.exitFullscreen().then(() => {
                this.isFullscreen = false;
                document.getElementById('fullscreen-toggle').classList.remove('active');
            });
        }
    }
    
    toggleMenuVisibility() {
        this.playSound('click');
        this.menuHidden = !this.menuHidden;
        
        const toggle = document.getElementById('hide-menu-toggle');
        toggle.classList.toggle('active', this.menuHidden);
        
        if (this.menuHidden) {
            this.hideMenu();
        } else {
            this.showMenu();
        }
    }
    
    startClock() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }
    
    updateClock() {
        const now = new Date();
        
        if (this.isDualClock) {
            this.updateClockDisplay('clock1', this.clock1Timezone);
            this.updateClockDisplay('clock2', this.clock2Timezone);
        } else {
            this.updateClockDisplay('clock', this.currentTimezone);
        }
    }
    
    updateClockDisplay(clockId, timezone) {
        const now = new Date();
        const timeOptions = {
            timeZone: timezone,
            hour12: !this.is24HourFormat,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        
        const dateOptions = {
            timeZone: timezone,
            month: 'short',
            day: '2-digit',
            year: '2-digit'
        };
        
        const timeString = now.toLocaleTimeString('en-US', timeOptions);
        const dateString = now.toLocaleDateString('en-US', dateOptions);
        
        let time, ampm = '';
        if (this.is24HourFormat) {
            time = timeString;
        } else {
            const parts = timeString.split(' ');
            time = parts[0];
            ampm = parts[1] || '';
        }
        
        // Format date as MMM/DD/YY
        const dateParts = dateString.split('/');
        const formattedDate = `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`;
        
        document.getElementById(clockId + '-time').textContent = time;
        document.getElementById(clockId + '-ampm').textContent = ampm;
        document.getElementById(clockId + '-ampm').style.display = this.is24HourFormat ? 'none' : 'block';
        document.getElementById(clockId + '-date').textContent = formattedDate.toUpperCase();
    }
    
    openTimezoneModal(buttonType) {
        this.playSound('click');
        this.activeTimezoneButton = buttonType;
        document.getElementById('timezone-modal').classList.remove('hidden');
    }
    
    closeTimezoneModal() {
        document.getElementById('timezone-modal').classList.add('hidden');
        this.activeTimezoneButton = null;
    }
    
    selectTimezone(timezone) {
        this.playSound('click');
        
        if (this.activeTimezoneButton === 'single') {
            this.currentTimezone = timezone;
        } else if (this.activeTimezoneButton === 'clock1') {
            this.clock1Timezone = timezone;
        } else if (this.activeTimezoneButton === 'clock2') {
            this.clock2Timezone = timezone;
        }
        
        this.closeTimezoneModal();
        this.updateClock();
    }
    
    addSecondClock() {
        this.playSound('click');
        this.isDualClock = true;
        
        document.getElementById('single-clock').classList.add('hidden');
        document.getElementById('dual-clock').classList.remove('hidden');
        
        this.updateClock();
    }
    
    removeClock() {
        this.playSound('click');
        this.isDualClock = false;
        
        document.getElementById('dual-clock').classList.add('hidden');
        document.getElementById('single-clock').classList.remove('hidden');
        
        this.updateClock();
    }
    
    // Timer functions
    adjustTimer(unit, delta) {
        this.playSound('click');
        
        if (unit === 'hours') {
            this.timerHours = Math.max(0, Math.min(99, this.timerHours + delta));
        } else if (unit === 'minutes') {
            this.timerMinutes = Math.max(0, Math.min(59, this.timerMinutes + delta));
        } else if (unit === 'seconds') {
            this.timerSeconds = Math.max(0, Math.min(59, this.timerSeconds + delta));
        }
        
        this.updateTimerDisplay();
    }
    
    editTimerField(unit) {
        const element = document.getElementById('timer-' + unit);
        element.classList.add('editing');
        
        const currentValue = unit === 'ms' ? this.timerMs : 
                           unit === 'hours' ? this.timerHours :
                           unit === 'minutes' ? this.timerMinutes : this.timerSeconds;
        
        const input = document.createElement('input');
        input.type = 'number';
        input.value = currentValue;
        input.style.background = 'rgba(0, 255, 0, 0.2)';
        input.style.border = '2px solid #00ff00';
        input.style.color = '#00ff00';
        input.style.fontFamily = 'Orbitron, monospace';
        input.style.fontSize = 'inherit';
        input.style.textAlign = 'center';
        input.style.width = '100px';
        
        if (unit === 'ms') {
            input.max = 999;
        } else if (unit === 'hours') {
            input.max = 99;
        } else {
            input.max = 59;
        }
        input.min = 0;
        
        element.textContent = '';
        element.appendChild(input);
        input.focus();
        input.select();
        
        const finishEdit = () => {
            const value = parseInt(input.value) || 0;
            
            if (unit === 'ms') {
                this.timerMs = Math.max(0, Math.min(999, value));
            } else if (unit === 'hours') {
                this.timerHours = Math.max(0, Math.min(99, value));
            } else if (unit === 'minutes') {
                this.timerMinutes = Math.max(0, Math.min(59, value));
            } else if (unit === 'seconds') {
                this.timerSeconds = Math.max(0, Math.min(59, value));
            }
            
            element.classList.remove('editing');
            this.updateTimerDisplay();
        };
        
        input.addEventListener('blur', finishEdit);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') finishEdit();
        });
    }
    
    updateTimerDisplay() {
        document.getElementById('timer-hours').textContent = String(this.timerHours).padStart(2, '0');
        document.getElementById('timer-minutes').textContent = String(this.timerMinutes).padStart(2, '0');
        document.getElementById('timer-seconds').textContent = String(this.timerSeconds).padStart(2, '0');
        document.getElementById('timer-ms').textContent = String(this.timerMs).padStart(3, '0') + 'ms';
    }
    
    toggleTimer() {
        this.playSound('click');
        
        if (this.timerRunning) {
            this.stopTimer();
        } else {
            this.startTimer();
        }
    }
    
    startTimer() {
        if (this.timerHours === 0 && this.timerMinutes === 0 && this.timerSeconds === 0 && this.timerMs === 0) {
            return; // Can't start timer with 0 time
        }
        
        this.timerRunning = true;
        this.timerSetHours = this.timerHours;
        this.timerSetMinutes = this.timerMinutes;
        this.timerSetSeconds = this.timerSeconds;
        this.timerSetMs = this.timerMs;
        
        const startBtn = document.getElementById('timer-start');
        startBtn.textContent = 'STOP';
        startBtn.classList.add('stop-btn');
        
        this.timerInterval = setInterval(() => {
            this.timerMs -= 10;
            
            if (this.timerMs < 0) {
                this.timerMs = 990;
                this.timerSeconds--;
                
                if (this.timerSeconds < 0) {
                    this.timerSeconds = 59;
                    this.timerMinutes--;
                    
                    if (this.timerMinutes < 0) {
                        this.timerMinutes = 59;
                        this.timerHours--;
                        
                        if (this.timerHours < 0) {
                            this.timerFinished();
                            return;
                        }
                    }
                }
            }
            
            this.updateTimerDisplay();
        }, 10);
    }
    
    stopTimer() {
        this.timerRunning = false;
        clearInterval(this.timerInterval);
        
        const startBtn = document.getElementById('timer-start');
        startBtn.textContent = 'START';
        startBtn.classList.remove('stop-btn');
    }
    
    resetTimer() {
        this.playSound('click');
        this.stopTimer();
        
        this.timerHours = this.timerSetHours;
        this.timerMinutes = this.timerSetMinutes;
        this.timerSeconds = this.timerSetSeconds;
        this.timerMs = this.timerSetMs;
        
        this.updateTimerDisplay();
    }
    
    timerFinished() {
        this.stopTimer();
        this.timerHours = 0;
        this.timerMinutes = 0;
        this.timerSeconds = 0;
        this.timerMs = 0;
        this.updateTimerDisplay();
        
        // Play alarm and flash
        this.playSound('alarm');
        document.body.classList.add('alarm-flash');
        
        setTimeout(() => {
            document.body.classList.remove('alarm-flash');
        }, 5000);
    }
    
    // Stopwatch functions
    toggleStopwatch() {
        this.playSound('click');
        
        if (this.stopwatchRunning) {
            this.stopStopwatch();
        } else {
            this.startStopwatch();
        }
    }
    
    startStopwatch() {
        this.stopwatchRunning = true;
        
        const startBtn = document.getElementById('stopwatch-start');
        startBtn.textContent = 'STOP';
        startBtn.classList.add('stop-btn');
        
        document.getElementById('stopwatch-lap').disabled = false;
        
        this.stopwatchInterval = setInterval(() => {
            this.stopwatchMs += 10;
            this.updateStopwatchDisplay();
        }, 10);
    }
    
    stopStopwatch() {
        this.stopwatchRunning = false;
        clearInterval(this.stopwatchInterval);
        
        const startBtn = document.getElementById('stopwatch-start');
        startBtn.textContent = 'START';
        startBtn.classList.remove('stop-btn');
        
        document.getElementById('stopwatch-lap').disabled = true;
    }
    
    updateStopwatchDisplay() {
        const totalSeconds = Math.floor(this.stopwatchMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const ms = this.stopwatchMs % 1000;
        
        const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        const msString = `${String(ms).padStart(3, '0')}ms`;
        
        document.getElementById('stopwatch-time').textContent = timeString;
        document.getElementById('stopwatch-ms').textContent = msString;
    }
    
    addLap() {
        if (!this.stopwatchRunning) return;
        
        this.playSound('click');
        this.lapCounter++;
        
        const totalSeconds = Math.floor(this.stopwatchMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const ms = this.stopwatchMs % 1000;
        
        const lapTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
        
        this.lapTimes.unshift({ number: this.lapCounter, time: lapTime });
        this.updateLapDisplay();
    }
    
    updateLapDisplay() {
        const lapTimesContainer = document.getElementById('lap-times');
        lapTimesContainer.innerHTML = '';
        
        this.lapTimes.forEach(lap => {
            const lapElement = document.createElement('div');
            lapElement.className = 'lap-time';
            lapElement.innerHTML = `
                <span>Lap ${lap.number}</span>
                <span>${lap.time}</span>
            `;
            lapTimesContainer.appendChild(lapElement);
        });
    }
    
    resetStopwatch() {
        this.playSound('click');
        this.stopStopwatch();
        
        this.stopwatchMs = 0;
        this.lapTimes = [];
        this.lapCounter = 0;
        
        this.updateStopwatchDisplay();
        this.updateLapDisplay();
    }
    
    handleKeydown(e) {
        // ESC key handling
        if (e.key === 'Escape') {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else if (!document.getElementById('timezone-modal').classList.contains('hidden')) {
                this.closeTimezoneModal();
            } else {
                this.showMenu();
                this.showBanner();
            }
        }
        
        // Space bar to start/stop timer or stopwatch
        if (e.key === ' ') {
            e.preventDefault();
            if (this.currentMode === 'timer') {
                this.toggleTimer();
            } else if (this.currentMode === 'stopwatch') {
                this.toggleStopwatch();
            }
        }
        
        // Number keys for mode switching
        if (e.key === '1') this.switchMode('clock');
        if (e.key === '2') this.switchMode('timer');
        if (e.key === '3') this.switchMode('stopwatch');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DigitalClockApp();
});

// Handle fullscreen changes
document.addEventListener('fullscreenchange', () => {
    const toggle = document.getElementById('fullscreen-toggle');
    if (document.fullscreenElement) {
        toggle.classList.add('active');
    } else {
        toggle.classList.remove('active');
    }
});

// Prevent zoom on double tap for mobile
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - (window.lastTouchEnd || 0) <= 300) {
        e.preventDefault();
    }
    window.lastTouchEnd = now;
}, false);