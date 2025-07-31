// Digital Clock App - Main JavaScript Implementation

class DigitalClockApp {
    constructor() {
        this.currentMode = 'clock';
        this.is24HourFormat = false;
        this.isMuted = false;
        this.isFullscreen = false;
        this.dualClockMode = false;
        this.colonBlink = true;
        
        // Activity tracking for auto-hide
        this.activityTimer = null;
        this.bannerHideTimer = null;
        this.menuHideTimer = null;
        this.BANNER_HIDE_DELAY = 5000; // 5 seconds
        this.MENU_HIDE_DELAY = 3000;   // 3 seconds
        
        // Timer state
        this.timerState = {
            running: false,
            paused: false,
            startTime: 0,
            duration: 0,
            remaining: 0
        };
        
        // Stopwatch state
        this.stopwatchState = {
            running: false,
            startTime: 0,
            elapsed: 0,
            laps: []
        };
        
        // Clock configurations for dual mode
        this.clockConfigs = {
            left: { timezone: 'local', format24h: false },
            right: { timezone: 'local', format24h: false }
        };
        
        // Timezone data
        this.timezones = [
            { name: 'UTC-12:00', offset: -12, label: 'International Date Line West' },
            { name: 'UTC-11:00', offset: -11, label: 'Coordinated Universal Time-11' },
            { name: 'UTC-10:00', offset: -10, label: 'Hawaii' },
            { name: 'UTC-09:00', offset: -9, label: 'Alaska' },
            { name: 'UTC-08:00', offset: -8, label: 'Pacific Time (US & Canada)' },
            { name: 'UTC-07:00', offset: -7, label: 'Mountain Time (US & Canada)' },
            { name: 'UTC-06:00', offset: -6, label: 'Central Time (US & Canada)' },
            { name: 'UTC-05:00', offset: -5, label: 'Eastern Time (US & Canada)' },
            { name: 'UTC-04:00', offset: -4, label: 'Atlantic Time (Canada)' },
            { name: 'UTC-03:00', offset: -3, label: 'Brasilia, Buenos Aires' },
            { name: 'UTC-02:00', offset: -2, label: 'Mid-Atlantic' },
            { name: 'UTC-01:00', offset: -1, label: 'Azores' },
            { name: 'UTC+00:00', offset: 0, label: 'London, Dublin, Edinburgh' },
            { name: 'UTC+01:00', offset: 1, label: 'Berlin, Paris, Madrid' },
            { name: 'UTC+02:00', offset: 2, label: 'Cairo, Helsinki, Athens' },
            { name: 'UTC+03:00', offset: 3, label: 'Moscow, Baghdad, Kuwait' },
            { name: 'UTC+04:00', offset: 4, label: 'Abu Dhabi, Muscat' },
            { name: 'UTC+05:00', offset: 5, label: 'Islamabad, Karachi' },
            { name: 'UTC+06:00', offset: 6, label: 'Almaty, Dhaka' },
            { name: 'UTC+07:00', offset: 7, label: 'Bangkok, Hanoi, Jakarta' },
            { name: 'UTC+08:00', offset: 8, label: 'Beijing, Singapore, Perth' },
            { name: 'UTC+09:00', offset: 9, label: 'Tokyo, Seoul, Osaka' },
            { name: 'UTC+10:00', offset: 10, label: 'Canberra, Melbourne, Sydney' },
            { name: 'UTC+11:00', offset: 11, label: 'Solomon Is., New Caledonia' },
            { name: 'UTC+12:00', offset: 12, label: 'Auckland, Wellington' }
        ];
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.setupActivityTracking();
        this.createTimezoneList();
        this.startClockUpdate();
        this.startActivityTimer();
        
        // Initialize audio
        this.clickSound = document.getElementById('clickSound');
        this.alarmSound = document.getElementById('alarmSound');
    }
    
    setupEventListeners() {
        // Navigation buttons - with null checks
        const clockBtn = document.getElementById('clockBtn');
        const timerBtn = document.getElementById('timerBtn');
        const stopwatchBtn = document.getElementById('stopwatchBtn');
        
        if (clockBtn) clockBtn.addEventListener('click', () => this.switchMode('clock'));
        if (timerBtn) timerBtn.addEventListener('click', () => this.switchMode('timer'));
        if (stopwatchBtn) stopwatchBtn.addEventListener('click', () => this.switchMode('stopwatch'));
        
        // Toggle buttons - with null checks
        const formatToggle = document.getElementById('formatToggle');
        const muteToggle = document.getElementById('muteToggle');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const hideMenuBtn = document.getElementById('hideMenuBtn');
        const showMenuBtn = document.getElementById('showMenuBtn');
        
        if (formatToggle) formatToggle.addEventListener('click', () => this.toggleTimeFormat());
        if (muteToggle) muteToggle.addEventListener('click', () => this.toggleMute());
        if (fullscreenBtn) fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        if (hideMenuBtn) hideMenuBtn.addEventListener('click', () => this.hideMenu());
        if (showMenuBtn) showMenuBtn.addEventListener('click', () => this.showMenu());
        
        // Clock mode buttons
        document.getElementById('localBtn').addEventListener('click', () => this.openTimezoneModal('main'));
        document.getElementById('dualClockBtn').addEventListener('click', () => this.enterDualClockMode());
        
        // Dual clock mode buttons
        document.querySelectorAll('.local-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => this.openTimezoneModal(index === 0 ? 'left' : 'right'));
        });
        document.querySelectorAll('.close-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => this.exitDualClockMode(index === 0 ? 'left' : 'right'));
        });
        
        // Timer controls
        document.getElementById('timerStartBtn').addEventListener('click', () => this.toggleTimer());
        document.getElementById('timerResetBtn').addEventListener('click', () => this.resetTimer());
        
        // Timer inputs
        document.querySelectorAll('.increment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.incrementTimerValue(e.target.dataset.target));
        });
        document.querySelectorAll('.decrement-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.decrementTimerValue(e.target.dataset.target));
        });
        
        // Stopwatch controls
        document.getElementById('stopwatchStartBtn').addEventListener('click', () => this.toggleStopwatch());
        document.getElementById('stopwatchLapBtn').addEventListener('click', () => this.recordLap());
        document.getElementById('stopwatchResetBtn').addEventListener('click', () => this.resetStopwatch());
        
        // Modal controls
        document.querySelector('.close-modal').addEventListener('click', () => this.closeTimezoneModal());
        document.getElementById('timezoneModal').addEventListener('click', (e) => {
            if (e.target.id === 'timezoneModal') this.closeTimezoneModal();
        });
        
        // Prevent form submission on number inputs
        document.querySelectorAll('.time-input').forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') e.preventDefault();
            });
            input.addEventListener('input', () => this.validateTimerInput(input));
        });
    }
    
    setupActivityTracking() {
        const events = ['mousemove', 'touchstart', 'keydown', 'click'];
        events.forEach(event => {
            document.addEventListener(event, () => this.resetActivityTimer());
        });
    }
    
    resetActivityTimer() {
        // Clear existing timers
        clearTimeout(this.bannerHideTimer);
        clearTimeout(this.menuHideTimer);
        
        // Show banner and menu
        this.showBanner();
        this.showMenu();
        
        // Set new hide timers
        this.bannerHideTimer = setTimeout(() => {
            this.hideBanner();
        }, this.BANNER_HIDE_DELAY);
        
        this.menuHideTimer = setTimeout(() => {
            this.hideMenu();
        }, this.MENU_HIDE_DELAY);
    }
    
    startActivityTimer() {
        this.resetActivityTimer();
    }
    
    showBanner() {
        const banner = document.getElementById('headerBanner');
        banner.classList.remove('hidden');
    }
    
    hideBanner() {
        const banner = document.getElementById('headerBanner');
        banner.classList.add('hidden');
    }
    
    showMenu() {
        const menu = document.getElementById('navigationMenu');
        const showBtn = document.getElementById('showMenuBtn');
        menu.classList.remove('hidden');
        showBtn.classList.remove('visible');
    }
    
    hideMenu() {
        const menu = document.getElementById('navigationMenu');
        const showBtn = document.getElementById('showMenuBtn');
        menu.classList.add('hidden');
        showBtn.classList.add('visible');
    }
    
    playSound(soundType) {
        if (this.isMuted) return;
        
        try {
            const sound = soundType === 'click' ? this.clickSound : this.alarmSound;
            if (sound) {
                sound.currentTime = 0;
                sound.play().catch(e => console.log('Audio play failed:', e));
            }
        } catch (e) {
            console.log('Audio error:', e);
        }
    }
    
    switchMode(mode) {
        this.playSound('click');
        
        // Hide all mode containers
        document.querySelectorAll('.mode-container').forEach(container => {
            container.classList.remove('active');
        });
        
        // Remove active class from nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected mode
        if (mode === 'clock') {
            if (this.dualClockMode) {
                document.getElementById('dualClockMode').classList.add('active');
            } else {
                document.getElementById('clockMode').classList.add('active');
            }
            document.getElementById('clockBtn').classList.add('active');
        } else if (mode === 'timer') {
            document.getElementById('timerMode').classList.add('active');
            document.getElementById('timerBtn').classList.add('active');
        } else if (mode === 'stopwatch') {
            document.getElementById('stopwatchMode').classList.add('active');
            document.getElementById('stopwatchBtn').classList.add('active');
        }
        
        this.currentMode = mode;
        this.saveSettings();
    }
    
    toggleTimeFormat() {
        this.playSound('click');
        this.is24HourFormat = !this.is24HourFormat;
        const btn = document.getElementById('formatToggle');
        btn.textContent = this.is24HourFormat ? '12H' : '24H';
        this.saveSettings();
    }
    
    toggleMute() {
        this.playSound('click');
        this.isMuted = !this.isMuted;
        const btn = document.getElementById('muteToggle');
        btn.textContent = this.isMuted ? 'UNMUTE' : 'MUTE';
        this.saveSettings();
    }
    
    toggleFullscreen() {
        this.playSound('click');
        
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                this.isFullscreen = true;
                document.body.classList.add('fullscreen-mode');
                document.getElementById('fullscreenBtn').textContent = 'EXIT FS';
            }).catch(e => console.log('Fullscreen failed:', e));
        } else {
            document.exitFullscreen().then(() => {
                this.isFullscreen = false;
                document.body.classList.remove('fullscreen-mode');
                document.getElementById('fullscreenBtn').textContent = 'FULLSCREEN';
            }).catch(e => console.log('Exit fullscreen failed:', e));
        }
    }
    
    formatTime(date, format24h = this.is24HourFormat, timezone = 'local') {
        let targetDate = date;
        
        if (timezone !== 'local') {
            const tz = this.timezones.find(t => t.name === timezone);
            if (tz) {
                const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
                targetDate = new Date(utc + (tz.offset * 3600000));
            }
        }
        
        let hours = targetDate.getHours();
        const minutes = targetDate.getMinutes();
        const seconds = targetDate.getSeconds();
        let ampm = '';
        
        if (!format24h) {
            ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            if (hours === 0) hours = 12;
        }
        
        const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}${ampm}`;
        return timeStr;
    }
    
    formatDate(date, timezone = 'local') {
        let targetDate = date;
        
        if (timezone !== 'local') {
            const tz = this.timezones.find(t => t.name === timezone);
            if (tz) {
                const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
                targetDate = new Date(utc + (tz.offset * 3600000));
            }
        }
        
        const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
                       'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
        
        const month = months[targetDate.getMonth()];
        const day = targetDate.getDate().toString().padStart(2, '0');
        const year = targetDate.getFullYear().toString().slice(-2);
        
        return `${month}/${day}/${year}`;
    }
    
    updateClock() {
        const now = new Date();
        
        if (this.currentMode === 'clock') {
            if (this.dualClockMode) {
                // Update left clock
                const leftTime = this.formatTime(now, this.clockConfigs.left.format24h, this.clockConfigs.left.timezone);
                const leftDate = this.formatDate(now, this.clockConfigs.left.timezone);
                document.getElementById('leftTimeDisplay').textContent = leftTime;
                document.getElementById('leftDateDisplay').textContent = leftDate;
                
                // Update right clock
                const rightTime = this.formatTime(now, this.clockConfigs.right.format24h, this.clockConfigs.right.timezone);
                const rightDate = this.formatDate(now, this.clockConfigs.right.timezone);
                document.getElementById('rightTimeDisplay').textContent = rightTime;
                document.getElementById('rightDateDisplay').textContent = rightDate;
            } else {
                // Update main clock
                const timeStr = this.formatTime(now, this.is24HourFormat);
                const dateStr = this.formatDate(now);
                document.getElementById('timeDisplay').textContent = timeStr;
                document.getElementById('dateDisplay').textContent = dateStr;
            }
        }
        
        // Update timer if running
        if (this.timerState.running && this.currentMode === 'timer') {
            const elapsed = Date.now() - this.timerState.startTime;
            this.timerState.remaining = Math.max(0, this.timerState.duration - elapsed);
            
            if (this.timerState.remaining <= 0) {
                this.timerCompleted();
            } else {
                this.updateTimerDisplay();
            }
        }
        
        // Update stopwatch if running
        if (this.stopwatchState.running && this.currentMode === 'stopwatch') {
            this.stopwatchState.elapsed = Date.now() - this.stopwatchState.startTime;
            this.updateStopwatchDisplay();
        }
        
        // Handle colon blinking
        this.updateColonBlink();
    }
    
    updateColonBlink() {
        const shouldBlink = (this.currentMode === 'timer' && this.timerState.running) ||
                           (this.currentMode === 'stopwatch' && this.stopwatchState.running);
        
        if (shouldBlink) {
            this.colonBlink = !this.colonBlink;
            const displays = document.querySelectorAll('.timer-display, .stopwatch-display');
            displays.forEach(display => {
                if (this.colonBlink) {
                    display.classList.add('blink-colon');
                } else {
                    display.classList.remove('blink-colon');
                }
            });
        } else {
            // Remove blinking when not needed
            const displays = document.querySelectorAll('.timer-display, .stopwatch-display');
            displays.forEach(display => {
                display.classList.remove('blink-colon');
            });
        }
    }
    
    startClockUpdate() {
        this.updateClock();
        setInterval(() => this.updateClock(), 100); // Update every 100ms for smooth milliseconds
    }
    
    // Timer functionality
    toggleTimer() {
        this.playSound('click');
        
        if (!this.timerState.running) {
            // Start timer
            const hours = parseInt(document.getElementById('hoursInput').value) || 0;
            const minutes = parseInt(document.getElementById('minutesInput').value) || 0;
            const seconds = parseInt(document.getElementById('secondsInput').value) || 0;
            
            const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
            
            if (totalMs > 0) {
                this.timerState.duration = totalMs;
                this.timerState.remaining = totalMs;
                this.timerState.startTime = Date.now();
                this.timerState.running = true;
                
                document.getElementById('timerStartBtn').textContent = 'STOP';
                this.updateTimerDisplay();
            }
        } else {
            // Stop timer
            this.timerState.running = false;
            document.getElementById('timerStartBtn').textContent = 'START';
        }
    }
    
    resetTimer() {
        this.playSound('click');
        this.timerState.running = false;
        this.timerState.remaining = 0;
        
        document.getElementById('timerStartBtn').textContent = 'START';
        document.getElementById('timerDisplay').textContent = '00:00:00';
        document.getElementById('timerMilliseconds').textContent = '000ms';
    }
    
    updateTimerDisplay() {
        const totalSeconds = Math.floor(this.timerState.remaining / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = this.timerState.remaining % 1000;
        
        const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const msStr = `${Math.floor(milliseconds).toString().padStart(3, '0')}ms`;
        
        document.getElementById('timerDisplay').textContent = timeStr;
        document.getElementById('timerMilliseconds').textContent = msStr;
    }
    
    timerCompleted() {
        this.timerState.running = false;
        document.getElementById('timerStartBtn').textContent = 'START';
        document.getElementById('timerDisplay').textContent = '00:00:00';
        document.getElementById('timerMilliseconds').textContent = '000ms';
        this.playSound('alarm');
    }
    
    incrementTimerValue(target) {
        this.playSound('click');
        const input = document.getElementById(target + 'Input');
        const currentValue = parseInt(input.value) || 0;
        const maxValue = target === 'hours' ? 23 : 59;
        
        if (currentValue < maxValue) {
            input.value = currentValue + 1;
        }
    }
    
    decrementTimerValue(target) {
        this.playSound('click');
        const input = document.getElementById(target + 'Input');
        const currentValue = parseInt(input.value) || 0;
        
        if (currentValue > 0) {
            input.value = currentValue - 1;
        }
    }
    
    validateTimerInput(input) {
        let value = parseInt(input.value);
        const max = input.max ? parseInt(input.max) : 59;
        
        if (isNaN(value) || value < 0) {
            input.value = 0;
        } else if (value > max) {
            input.value = max;
        }
        
        // Ensure two-digit format for display
        if (input.value.length === 1) {
            input.value = '0' + input.value;
        }
    }
    
    // Stopwatch functionality
    toggleStopwatch() {
        this.playSound('click');
        
        if (!this.stopwatchState.running) {
            // Start stopwatch
            this.stopwatchState.startTime = Date.now() - this.stopwatchState.elapsed;
            this.stopwatchState.running = true;
            document.getElementById('stopwatchStartBtn').textContent = 'STOP';
        } else {
            // Stop stopwatch
            this.stopwatchState.running = false;
            document.getElementById('stopwatchStartBtn').textContent = 'START';
        }
    }
    
    resetStopwatch() {
        this.playSound('click');
        this.stopwatchState.running = false;
        this.stopwatchState.elapsed = 0;
        this.stopwatchState.laps = [];
        
        document.getElementById('stopwatchStartBtn').textContent = 'START';
        document.getElementById('stopwatchDisplay').textContent = '00:00:00';
        document.getElementById('stopwatchMilliseconds').textContent = '000ms';
        
        // Clear lap list
        const lapList = document.getElementById('lapList');
        if (lapList) {
            lapList.innerHTML = '';
        }
    }
    
    recordLap() {
        if (this.stopwatchState.running) {
            this.playSound('click');
            const lapTime = this.stopwatchState.elapsed;
            this.stopwatchState.laps.push(lapTime);
            
            const lapNumber = this.stopwatchState.laps.length;
            const timeStr = this.formatStopwatchTime(lapTime);
            
            // Remove 'recent' class from all existing laps
            document.querySelectorAll('.lap-item').forEach(item => {
                item.classList.remove('recent');
            });
            
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item recent';
            lapItem.innerHTML = `
                <span>LAP ${lapNumber}</span>
                <span>${timeStr}</span>
            `;
            
            document.getElementById('lapList').appendChild(lapItem);
        }
    }
    
    updateStopwatchDisplay() {
        const timeStr = this.formatStopwatchTime(this.stopwatchState.elapsed);
        const parts = timeStr.split('.');
        const time = parts[0];
        const ms = parts[1] || '000';
        
        document.getElementById('stopwatchDisplay').textContent = time;
        document.getElementById('stopwatchMilliseconds').textContent = ms + 'ms';
    }
    
    formatStopwatchTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor(ms % 1000);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
    }
    
    // Dual clock functionality
    enterDualClockMode() {
        this.playSound('click');
        this.dualClockMode = true;
        document.getElementById('clockMode').classList.remove('active');
        document.getElementById('dualClockMode').classList.add('active');
        this.saveSettings();
    }
    
    exitDualClockMode(side) {
        this.playSound('click');
        this.dualClockMode = false;
        document.getElementById('dualClockMode').classList.remove('active');
        document.getElementById('clockMode').classList.add('active');
        this.saveSettings();
    }
    
    // Timezone modal functionality
    openTimezoneModal(target) {
        this.playSound('click');
        this.currentTimezoneTarget = target;
        document.getElementById('timezoneModal').classList.add('active');
    }
    
    closeTimezoneModal() {
        document.getElementById('timezoneModal').classList.remove('active');
    }
    
    createTimezoneList() {
        const list = document.getElementById('timezoneList');
        
        // Add local timezone option
        const localItem = document.createElement('button');
        localItem.className = 'timezone-item';
        localItem.textContent = 'Local Time';
        localItem.addEventListener('click', () => this.selectTimezone('local'));
        list.appendChild(localItem);
        
        // Add UTC timezones
        this.timezones.forEach(tz => {
            const item = document.createElement('button');
            item.className = 'timezone-item';
            item.textContent = `${tz.name} - ${tz.label}`;
            item.addEventListener('click', () => this.selectTimezone(tz.name));
            list.appendChild(item);
        });
    }
    
    selectTimezone(timezone) {
        this.playSound('click');
        
        if (this.currentTimezoneTarget === 'main') {
            // For single clock mode - not implemented in this version
        } else if (this.currentTimezoneTarget === 'left') {
            this.clockConfigs.left.timezone = timezone;
        } else if (this.currentTimezoneTarget === 'right') {
            this.clockConfigs.right.timezone = timezone;
        }
        
        this.closeTimezoneModal();
        this.saveSettings();
    }
    
    // Settings persistence
    saveSettings() {
        const settings = {
            currentMode: this.currentMode,
            is24HourFormat: this.is24HourFormat,
            isMuted: this.isMuted,
            dualClockMode: this.dualClockMode,
            clockConfigs: this.clockConfigs
        };
        
        localStorage.setItem('digitalClockAppSettings', JSON.stringify(settings));
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('digitalClockAppSettings');
            if (saved) {
                const settings = JSON.parse(saved);
                
                this.currentMode = settings.currentMode || 'clock';
                this.is24HourFormat = settings.is24HourFormat || false;
                this.isMuted = settings.isMuted || false;
                this.dualClockMode = settings.dualClockMode || false;
                
                if (settings.clockConfigs) {
                    this.clockConfigs = settings.clockConfigs;
                }
                
                // Apply loaded settings to UI
                setTimeout(() => {
                    this.switchMode(this.currentMode);
                    
                    const formatBtn = document.getElementById('formatToggle');
                    formatBtn.textContent = this.is24HourFormat ? '12H' : '24H';
                    
                    const muteBtn = document.getElementById('muteToggle');
                    muteBtn.textContent = this.isMuted ? 'UNMUTE' : 'MUTE';
                }, 100);
            }
        } catch (e) {
            console.log('Error loading settings:', e);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DigitalClockApp();
});

// Handle fullscreen change events
document.addEventListener('fullscreenchange', () => {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (!document.fullscreenElement) {
        document.body.classList.remove('fullscreen-mode');
        if (fullscreenBtn) fullscreenBtn.textContent = 'FULLSCREEN';
    }
});

// Also handle webkit and moz prefixed events for better browser support
document.addEventListener('webkitfullscreenchange', () => {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (!document.webkitFullscreenElement) {
        document.body.classList.remove('fullscreen-mode');
        if (fullscreenBtn) fullscreenBtn.textContent = 'FULLSCREEN';
    }
});

document.addEventListener('mozfullscreenchange', () => {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (!document.mozFullScreenElement) {
        document.body.classList.remove('fullscreen-mode');
        if (fullscreenBtn) fullscreenBtn.textContent = 'FULLSCREEN';
    }
});