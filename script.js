// Digital Clock App - Main JavaScript Implementation

class DigitalClockApp {
    constructor() {
        this.currentMode = 'clock';
        this.is24HourFormat = false;
        this.isMuted = false;
        this.isFullscreen = false;
        this.dualClockMode = false;
        this.colonBlink = true;
        

        
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
        this.createTimezoneList();
        this.startClockUpdate();
        this.initBanner();
        this.initNavigationAutoHide();
        
        // Initialize audio
        this.clickSound = document.getElementById('clickSound');
        this.alarmSound = document.getElementById('alarmSound');
        
        // Ensure mute state is properly set
        if (this.isMuted) {
            const muteBtn = document.getElementById('muteToggle');
            if (muteBtn) muteBtn.classList.add('active');
        }
    }
    
    initBanner() {
        const banner = document.getElementById('banner');
        if (banner) {
            // Hide banner after 10 seconds
            setTimeout(() => {
                banner.classList.add('hidden');
            }, 10000);
            
            // Show banner on user activity
            this.setupBannerActivityListener();
        }
    }
    
    setupBannerActivityListener() {
        const banner = document.getElementById('banner');
        let activityTimeout;
        
        // Events to track for user activity
        const activityEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart', 'click'];
        
        const showBanner = () => {
            if (banner && banner.classList.contains('hidden')) {
                banner.classList.remove('hidden');
                
                // Hide again after 10 seconds
                setTimeout(() => {
                    banner.classList.add('hidden');
                }, 10000);
            }
        };
        
        const handleActivity = () => {
            // Clear existing timeout
            if (activityTimeout) {
                clearTimeout(activityTimeout);
            }
            
            // Show banner immediately on activity
            showBanner();
            
            // Set new timeout to hide banner after 10 seconds of inactivity
            activityTimeout = setTimeout(() => {
                if (banner && !banner.classList.contains('hidden')) {
                    banner.classList.add('hidden');
                }
            }, 10000);
        };
        
        // Add event listeners for user activity
        activityEvents.forEach(event => {
            document.addEventListener(event, handleActivity, { passive: true });
        });
    }
    
    initNavigationAutoHide() {
        const navigation = document.getElementById('navigationMenu');
        if (navigation) {
            // Hide navigation after 20 seconds
            setTimeout(() => {
                navigation.classList.add('hidden');
            }, 20000);
            
            // Show navigation on user activity
            this.setupNavigationActivityListener();
        }
    }
    
    setupNavigationActivityListener() {
        const navigation = document.getElementById('navigationMenu');
        let activityTimeout;
        
        // Events to track for user activity
        const activityEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart', 'click'];
        
        const showNavigation = () => {
            if (navigation && navigation.classList.contains('hidden')) {
                navigation.classList.remove('hidden');
                
                // Hide again after 20 seconds
                setTimeout(() => {
                    navigation.classList.add('hidden');
                }, 20000);
            }
        };
        
        const handleActivity = () => {
            // Clear existing timeout
            if (activityTimeout) {
                clearTimeout(activityTimeout);
            }
            
            // Show navigation immediately on activity
            showNavigation();
            
            // Set new timeout to hide navigation after 20 seconds of inactivity
            activityTimeout = setTimeout(() => {
                if (navigation && !navigation.classList.contains('hidden')) {
                    navigation.classList.add('hidden');
                }
            }, 20000);
        };
        
        // Add event listeners for user activity
        activityEvents.forEach(event => {
            document.addEventListener(event, handleActivity, { passive: true });
        });
    }
    
    setupEventListeners() {
        // Navigation buttons - with null checks
        const clockBtn = document.getElementById('clockBtn');
        const converterBtn = document.getElementById('converterBtn');
        const timerBtn = document.getElementById('timerBtn');
        const stopwatchBtn = document.getElementById('stopwatchBtn');
        
        if (clockBtn) clockBtn.addEventListener('click', () => this.switchMode('clock'));
        if (converterBtn) converterBtn.addEventListener('click', () => this.switchMode('converter'));
        if (timerBtn) timerBtn.addEventListener('click', () => this.switchMode('timer'));
        if (stopwatchBtn) stopwatchBtn.addEventListener('click', () => this.switchMode('stopwatch'));
        
        // Toggle buttons - with null checks
        const formatToggle = document.getElementById('formatToggle');
        const muteToggle = document.getElementById('muteToggle');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const shareBtn = document.getElementById('shareBtn');
        
        if (formatToggle) formatToggle.addEventListener('click', () => this.toggleTimeFormat());
        if (muteToggle) muteToggle.addEventListener('click', () => this.toggleMute());
        if (fullscreenBtn) fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        if (shareBtn) shareBtn.addEventListener('click', () => this.shareApp());
        
        // Clock mode buttons
        document.getElementById('localBtn').addEventListener('click', () => this.openTimezoneModal('main'));
        document.getElementById('dualClockBtn').addEventListener('click', () => this.enterDualClockMode());
        
        // Dual clock mode buttons
        // Use event delegation for timezone buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('local-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const localBtns = document.querySelectorAll('.local-btn');
                const index = Array.from(localBtns).indexOf(e.target);
                this.openTimezoneModal(index === 0 ? 'left' : 'right');
            }
        });
        
        document.addEventListener('touchend', (e) => {
            if (e.target.classList.contains('local-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const localBtns = document.querySelectorAll('.local-btn');
                const index = Array.from(localBtns).indexOf(e.target);
                this.openTimezoneModal(index === 0 ? 'left' : 'right');
            }
        });
        // Use event delegation for better mobile support
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const closeBtns = document.querySelectorAll('.close-btn');
                const index = Array.from(closeBtns).indexOf(e.target);
                this.exitDualClockMode(index === 0 ? 'left' : 'right');
            }
        });
        
        document.addEventListener('touchend', (e) => {
            if (e.target.classList.contains('close-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const closeBtns = document.querySelectorAll('.close-btn');
                const index = Array.from(closeBtns).indexOf(e.target);
                this.exitDualClockMode(index === 0 ? 'left' : 'right');
            }
        });
        
        // Timer controls
        document.getElementById('timerStartBtn').addEventListener('click', () => this.toggleTimer());
        document.getElementById('timerResetBtn').addEventListener('click', () => this.resetTimer());
        
        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setPresetTime(parseInt(e.target.dataset.time)));
        });
        
        // Timer input fields
        document.getElementById('hoursInput').addEventListener('input', (e) => this.validateTimerInput(e, 23));
        document.getElementById('minutesInput').addEventListener('input', (e) => this.validateTimerInput(e, 59));
        document.getElementById('secondsInput').addEventListener('input', (e) => this.validateTimerInput(e, 59));
        
        // Auto-focus next input on max length
        document.querySelectorAll('.timer-input').forEach(input => {
            input.addEventListener('keyup', (e) => this.handleTimerInputNavigation(e));
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
        

    }
    

    

    
    playSound(soundType) {
        // Double-check mute state
        if (this.isMuted === true) {
            return;
        }
        
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
        } else if (mode === 'converter') {
            document.getElementById('converterMode').classList.add('active');
            document.getElementById('converterBtn').classList.add('active');
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
        
        // Update main clock configuration
        this.clockConfigs.main = this.clockConfigs.main || {};
        this.clockConfigs.main.format24h = this.is24HourFormat;
        
        // Update dual clock configurations if in dual mode
        if (this.dualClockMode) {
            this.clockConfigs.left = this.clockConfigs.left || {};
            this.clockConfigs.right = this.clockConfigs.right || {};
            this.clockConfigs.left.format24h = this.is24HourFormat;
            this.clockConfigs.right.format24h = this.is24HourFormat;
        }
        
        const btn = document.getElementById('formatToggle');
        btn.classList.toggle('active');
        this.saveSettings();
        
        // Immediately update the clock display
        this.updateClock();
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        const btn = document.getElementById('muteToggle');
        btn.classList.toggle('active');
        this.saveSettings();
        
        // Immediately stop any currently playing sounds when muting
        if (this.isMuted) {
            if (this.clickSound) {
                this.clickSound.pause();
                this.clickSound.currentTime = 0;
            }
            if (this.alarmSound) {
                this.alarmSound.pause();
                this.alarmSound.currentTime = 0;
            }
        }
    }
    
    toggleFullscreen() {
        this.playSound('click');
        
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                this.isFullscreen = true;
                document.body.classList.add('fullscreen-mode');
                document.getElementById('fullscreenBtn').classList.add('active');
            }).catch(e => console.log('Fullscreen failed:', e));
        } else {
            document.exitFullscreen().then(() => {
                this.isFullscreen = false;
                document.body.classList.remove('fullscreen-mode');
                document.getElementById('fullscreenBtn').classList.remove('active');
            }).catch(e => console.log('Exit fullscreen failed:', e));
        }
    }
    
    shareApp() {
        this.playSound('click');
        
        const currentTime = new Date().toLocaleTimeString();
        const shareText = `Check out this Digital Clock App! Current time: ${currentTime}\n\nVisit: DIGITALCLOCKAPP.COM`;
        
        if (navigator.share) {
            // Use native Web Share API if available
            navigator.share({
                title: 'Digital Clock App',
                text: shareText,
                url: window.location.href
            }).catch(e => console.log('Share failed:', e));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                // Show a brief visual feedback
                const shareBtn = document.getElementById('shareBtn');
                const originalText = shareBtn.textContent;
                shareBtn.textContent = 'COPIED!';
                setTimeout(() => {
                    shareBtn.textContent = originalText;
                }, 2000);
            }).catch(e => console.log('Copy failed:', e));
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
        
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
                       'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        
        const month = months[targetDate.getMonth()];
        const day = targetDate.getDate().toString().padStart(2, '0');
        const year = targetDate.getFullYear().toString().slice(-2);
        const dayOfWeek = days[targetDate.getDay()];
        
        return `${month}/${day}/${year} ${dayOfWeek}`;
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
                const mainConfig = this.clockConfigs.main || { timezone: 'local', format24h: this.is24HourFormat };
                const timeStr = this.formatTime(now, mainConfig.format24h, mainConfig.timezone);
                const dateStr = this.formatDate(now, mainConfig.timezone);
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
    }
    

    
    startClockUpdate() {
        this.updateClock();
        setInterval(() => this.updateClock(), 100); // Update every 100ms for smooth milliseconds
    }
    
    // Timer functionality
    toggleTimer() {
        this.playSound('click');
        
        if (!this.timerState.running) {
            // If timer was completed and user clicks STOP, reset the button and stop alarm
            if (this.timerState.completed) {
                this.stopAlarm();
                this.resetTimerButton();
                return;
            }
            
            // Get values from input fields (only if they exist)
            const hoursInput = document.getElementById('hoursInput');
            const minutesInput = document.getElementById('minutesInput');
            const secondsInput = document.getElementById('secondsInput');
            
            let hours = 0, minutes = 0, seconds = 0;
            
            if (hoursInput && minutesInput && secondsInput) {
                hours = parseInt(hoursInput.value) || 0;
                minutes = parseInt(minutesInput.value) || 0;
                seconds = parseInt(secondsInput.value) || 0;
            } else {
                // Fallback to default 1 minute if inputs don't exist
                minutes = 1;
            }
            
            const totalMs = (hours * 3600000) + (minutes * 60000) + (seconds * 1000);
            
            if (totalMs > 0) {
                this.timerState.duration = totalMs;
                this.timerState.remaining = totalMs;
                this.timerState.startTime = Date.now();
                this.timerState.running = true;
                this.timerState.completed = false; // Reset completed state
                
                // Switch to running state
                document.getElementById('timerStartBtn').textContent = 'STOP';
                document.getElementById('timerStartBtn').classList.add('active');
                
                this.updateTimerDisplay();
            }
        } else {
            // Stop timer (user stopped before completion)
            this.timerState.running = false;
            this.timerState.completed = false; // Reset completed state
            document.getElementById('timerStartBtn').textContent = 'START';
            document.getElementById('timerStartBtn').classList.remove('active');
        }
    }
    
    resetTimer() {
        this.playSound('click');
        this.timerState.running = false;
        this.timerState.remaining = 0;
        this.timerState.duration = 0;
        this.timerState.completed = false; // Reset completed state
        
        // Reset to setup state
        document.getElementById('timerStartBtn').textContent = 'START';
        document.getElementById('timerStartBtn').classList.remove('active');
        
        // Only update input fields if they exist (timer mode is active)
        const hoursInput = document.getElementById('hoursInput');
        const minutesInput = document.getElementById('minutesInput');
        const secondsInput = document.getElementById('secondsInput');
        
        if (hoursInput) hoursInput.value = '00';
        if (minutesInput) minutesInput.value = '00';
        if (secondsInput) secondsInput.value = '00';
        
        document.getElementById('timerMilliseconds').textContent = '000ms';
    }
    
    updateTimerDisplay() {
        if (this.timerState.running) {
            const elapsed = Date.now() - this.timerState.startTime;
            this.timerState.remaining = Math.max(0, this.timerState.duration - elapsed);
            
            if (this.timerState.remaining <= 0) {
                this.timerCompleted();
                return;
            }
            
            const totalSeconds = Math.floor(this.timerState.remaining / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            const milliseconds = Math.floor((this.timerState.remaining % 1000) / 10);
            
            // Update input fields if they exist (timer mode is active)
            const hoursInput = document.getElementById('hoursInput');
            const minutesInput = document.getElementById('minutesInput');
            const secondsInput = document.getElementById('secondsInput');
            const timerMilliseconds = document.getElementById('timerMilliseconds');
            
            if (hoursInput && minutesInput && secondsInput) {
                hoursInput.value = hours.toString().padStart(2, '0');
                minutesInput.value = minutes.toString().padStart(2, '0');
                secondsInput.value = seconds.toString().padStart(2, '0');
            }
            
            if (timerMilliseconds) {
                timerMilliseconds.textContent = `${milliseconds.toString().padStart(3, '0')}ms`;
            }
            

            
            requestAnimationFrame(() => this.updateTimerDisplay());
        }
    }
    
    timerCompleted() {
        this.timerState.running = false;
        this.timerState.completed = true; // Mark as completed
        
        // Keep button as "STOP" - don't change to "START" yet
        // Button will change to "START" when alarm finishes or user clicks
        
        // Only update input fields if they exist (timer mode is active)
        const hoursInput = document.getElementById('hoursInput');
        const minutesInput = document.getElementById('minutesInput');
        const secondsInput = document.getElementById('secondsInput');
        
        if (hoursInput) hoursInput.value = '00';
        if (minutesInput) minutesInput.value = '00';
        if (secondsInput) secondsInput.value = '00';
        
        document.getElementById('timerMilliseconds').textContent = '000ms';
        
        // Play alarm and set up auto-reset when sound finishes
        this.playSound('alarm');
        
        // Auto-reset button to START when alarm finishes
        if (this.alarmSound) {
            this.alarmSound.addEventListener('ended', () => {
                this.resetTimerButton();
            }, { once: true }); // Only trigger once
        }
    }
    
    resetTimerButton() {
        if (this.timerState.completed) {
            document.getElementById('timerStartBtn').textContent = 'START';
            document.getElementById('timerStartBtn').classList.remove('active');
            this.timerState.completed = false;
        }
    }
    
    stopAlarm() {
        if (this.alarmSound) {
            this.alarmSound.pause();
            this.alarmSound.currentTime = 0;
        }
    }
    
    setPresetTime(milliseconds) {
        this.playSound('click');
        this.timerState.duration = milliseconds;
        
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        // Only update input fields if they exist (timer mode is active)
        const hoursInput = document.getElementById('hoursInput');
        const minutesInput = document.getElementById('minutesInput');
        const secondsInput = document.getElementById('secondsInput');
        
        if (hoursInput) hoursInput.value = hours.toString().padStart(2, '0');
        if (minutesInput) minutesInput.value = minutes.toString().padStart(2, '0');
        if (secondsInput) secondsInput.value = seconds.toString().padStart(2, '0');
    }
    
    validateTimerInput(event, maxValue) {
        let value = event.target.value.replace(/\D/g, ''); // Remove non-digits
        let numValue = parseInt(value) || 0;
        
        if (numValue > maxValue) {
            numValue = maxValue;
        }
        
        event.target.value = numValue.toString().padStart(2, '0');
    }
    
    handleTimerInputNavigation(event) {
        const inputs = ['hoursInput', 'minutesInput', 'secondsInput'];
        const currentIndex = inputs.indexOf(event.target.id);
        
        if (event.target.value.length === 2 && currentIndex < inputs.length - 1) {
            document.getElementById(inputs[currentIndex + 1]).focus();
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
        
        // Clear and hide lap list
        const lapList = document.getElementById('lapList');
        if (lapList) {
            lapList.innerHTML = '';
            lapList.style.display = 'none';
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
            
            const lapList = document.getElementById('lapList');
            lapList.appendChild(lapItem);
            
            // Show lap list when first lap is added
            if (this.stopwatchState.laps.length === 1) {
                lapList.style.display = 'block';
            }
            
            // Scroll to the bottom to show the latest lap
            lapList.scrollTop = lapList.scrollHeight;
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
        
        // Transfer main clock settings to left clock
        this.clockConfigs.left = {
            timezone: this.clockConfigs.main?.timezone || 'local',
            format24h: this.clockConfigs.main?.format24h || this.is24HourFormat
        };
        
        // Set right clock to use current global 24H setting
        this.clockConfigs.right = {
            timezone: 'local',
            format24h: this.is24HourFormat
        };
        
        // Update button text for both clocks
        this.updateTimezoneButtonText('left', this.clockConfigs.left.timezone);
        this.updateTimezoneButtonText('right', this.clockConfigs.right.timezone);
        
        document.getElementById('clockMode').classList.remove('active');
        document.getElementById('dualClockMode').classList.add('active');
        this.saveSettings();
        
        // Immediately update the clock display
        this.updateClock();
    }
    
    exitDualClockMode(side) {
        this.playSound('click');
        this.dualClockMode = false;
        
        // Transfer the remaining clock's settings to main clock
        if (side === 'left') {
            // Right clock becomes main clock
            this.clockConfigs.main = {
                timezone: this.clockConfigs.right.timezone,
                format24h: this.clockConfigs.right.format24h
            };
        } else {
            // Left clock becomes main clock
            this.clockConfigs.main = {
                timezone: this.clockConfigs.left.timezone,
                format24h: this.clockConfigs.left.format24h
            };
        }
        
        // Update main clock button text
        this.updateTimezoneButtonText('main', this.clockConfigs.main.timezone);
        
        // Update format toggle button state
        const formatBtn = document.getElementById('formatToggle');
        if (this.clockConfigs.main.format24h) {
            formatBtn.classList.add('active');
            this.is24HourFormat = true;
        } else {
            formatBtn.classList.remove('active');
            this.is24HourFormat = false;
        }
        
        document.getElementById('dualClockMode').classList.remove('active');
        document.getElementById('clockMode').classList.add('active');
        this.saveSettings();
        
        // Immediately update the clock display
        this.updateClock();
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
            // For single clock mode - store in main config
            this.clockConfigs.main = this.clockConfigs.main || {};
            this.clockConfigs.main.timezone = timezone;
            this.updateTimezoneButtonText('main', timezone);
        } else if (this.currentTimezoneTarget === 'left') {
            this.clockConfigs.left.timezone = timezone;
            this.updateTimezoneButtonText('left', timezone);
        } else if (this.currentTimezoneTarget === 'right') {
            this.clockConfigs.right.timezone = timezone;
            this.updateTimezoneButtonText('right', timezone);
        }
        
        this.closeTimezoneModal();
        this.saveSettings();
        
        // Immediately update the clock display
        this.updateClock();
    }
    
    updateTimezoneButtonText(target, timezone) {
        let buttonText = 'TIMEZONE';
        
        if (timezone !== 'local') {
            const tz = this.timezones.find(t => t.name === timezone);
            if (tz) {
                buttonText = tz.name; // e.g., "UTC -9:00"
            }
        }
        
        if (target === 'main') {
            const mainBtn = document.getElementById('localBtn');
            if (mainBtn) mainBtn.textContent = buttonText;
        } else if (target === 'left') {
            const leftBtns = document.querySelectorAll('.local-btn');
            if (leftBtns[0]) leftBtns[0].textContent = buttonText;
        } else if (target === 'right') {
            const rightBtns = document.querySelectorAll('.local-btn');
            if (rightBtns[1]) rightBtns[1].textContent = buttonText;
        }
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
                
                // Ensure main clock config exists
                if (!this.clockConfigs.main) {
                    this.clockConfigs.main = { timezone: 'local', format24h: this.is24HourFormat };
                }
                
                // Apply loaded settings to UI
                setTimeout(() => {
                    this.switchMode(this.currentMode);
                    
                    const formatBtn = document.getElementById('formatToggle');
                    if (this.is24HourFormat) formatBtn.classList.add('active');
                    else formatBtn.classList.remove('active');
                    
                    const muteBtn = document.getElementById('muteToggle');
                    if (this.isMuted) muteBtn.classList.add('active');
                    else muteBtn.classList.remove('active');
                    
                    // Restore timezone button text
                    if (this.clockConfigs.main && this.clockConfigs.main.timezone) {
                        this.updateTimezoneButtonText('main', this.clockConfigs.main.timezone);
                    }
                    if (this.dualClockMode) {
                        if (this.clockConfigs.left && this.clockConfigs.left.timezone) {
                            this.updateTimezoneButtonText('left', this.clockConfigs.left.timezone);
                        }
                        if (this.clockConfigs.right && this.clockConfigs.right.timezone) {
                            this.updateTimezoneButtonText('right', this.clockConfigs.right.timezone);
                        }
                    }
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
        if (fullscreenBtn) fullscreenBtn.classList.remove('active');
    }
});

// Also handle webkit and moz prefixed events for better browser support
document.addEventListener('webkitfullscreenchange', () => {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (!document.webkitFullscreenElement) {
        document.body.classList.remove('fullscreen-mode');
        if (fullscreenBtn) fullscreenBtn.classList.remove('active');
    }
});

document.addEventListener('mozfullscreenchange', () => {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (!document.mozFullScreenElement) {
        document.body.classList.remove('fullscreen-mode');
        if (fullscreenBtn) fullscreenBtn.classList.remove('active');
    }
});