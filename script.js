/* Digital-7 Font Declaration */
@font-face {
    font-family: 'Digital7';
    src: url('fonts/digital-7.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}

/* Reset & Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background-color: #000000;
    color: #ffffff;
    font-family: 'Digital7', 'Consolas', monospace;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

/* Clock Layout */
.clock-container {
    text-align: center;
    width: 100%;
    max-width: 90vw;
}

.time-display {
    font-size: clamp(6rem, 30vw, 15rem);
    font-weight: normal;
    letter-spacing: 0.05em;
    margin-bottom: 1rem;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    line-height: 1;
}

.date-display {
    font-size: clamp(1.5rem, 6vw, 3rem);
    font-weight: normal;
    letter-spacing: 0.08em;
    opacity: 0.9;
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
}

/* Toggle Switch */
.toggle-container {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 1rem;
}

.toggle-switch {
    background: none;
    border: none;
    color: #666666;
    font-family: 'Digital7', 'Consolas', monospace;
    font-size: clamp(0.8rem, 3vw, 1.2rem);
    font-weight: normal;
    letter-spacing: 0.05em;
    cursor: pointer;
    padding: 0.5rem 1rem;
    transition: color 0.3s ease;
}

.toggle-switch:hover {
    color: #999999;
}

.timezone-button {
    background: none;
    border: none;
    color: #666666;
    font-family: 'Digital7', 'Consolas', monospace;
    font-size: clamp(0.8rem, 3vw, 1.2rem);
    font-weight: normal;
    letter-spacing: 0.05em;
    cursor: pointer;
    padding: 0.5rem 1rem;
    transition: color 0.3s ease;
    text-transform: uppercase;
}

.timezone-button:hover {
    color: #999999;
}

/* Timezone Selector Modal */
.timezone-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.timezone-modal.active {
    display: flex;
}

.timezone-search-container {
    background: #111111;
    border: 1px solid #333333;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
}

.timezone-search-input {
    width: 100%;
    padding: 1rem;
    background: #222222;
    border: none;
    border-bottom: 1px solid #333333;
    color: #ffffff;
    font-family: 'Digital7', 'Consolas', monospace;
    font-size: 1rem;
    outline: none;
}

.timezone-search-input::placeholder {
    color: #666666;
}

.timezone-results {
    max-height: 300px;
    overflow-y: auto;
    background: #111111;
}

.timezone-item {
    padding: 0.75rem 1rem;
    color: #ffffff;
    cursor: pointer;
    border-bottom: 1px solid #222222;
    font-family: 'Digital7', 'Consolas', monospace;
    font-size: 0.9rem;
    transition: background-color 0.2s ease;
}

.timezone-item:hover {
    background: #333333;
}

.timezone-item:last-child {
    border-bottom: none;
}

.close-modal {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    color: #666666;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
}

.close-modal:hover {
    color: #ffffff;
}

/* Blinking Colon Animation */
.colon {
    animation: blink 1s infinite;
}

@keyframes blink {
    0%, 50% {
        opacity: 1;
    }
    51%, 100% {
        opacity: 0;
    }
}

/* Responsive Design */
@media (max-width: 768px) {
    .time-display {
        font-size: clamp(4rem, 35vw, 10rem);
        letter-spacing: 0.03em;
    }
    
    .date-display {
        font-size: clamp(1.2rem, 8vw, 2rem);
    }
}

@media (max-width: 480px) {
    .time-display {
        font-size: clamp(3.5rem, 40vw, 8rem);
        letter-spacing: 0.02em;
    }
    
    .date-display {
        font-size: clamp(1rem, 6vw, 1.5rem);
    }
    
    .toggle-container {
        bottom: 1.5rem;
    }
}
