# Digital Clock App

A free online clock with time zone converter, timer, and stopwatch functionality.

## Features

- **Digital Clock**: Real-time clock with timezone support
- **Timer**: Countdown timer with preset options
- **Stopwatch**: Stopwatch with lap functionality
- **Time Zone Converter**: Convert between different time zones (coming soon)
- **Responsive Design**: Works on desktop and mobile devices

## Local Development

### Option 1: Python HTTP Server (Recommended)

1. Open terminal/command prompt
2. Navigate to the project directory
3. Run one of these commands:

**Python 3:**
```bash
python -m http.server 8000
```

**Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

4. Open your browser and go to: `http://localhost:8000`

### Option 2: Node.js HTTP Server

If you have Node.js installed:

1. Install a simple HTTP server:
```bash
npm install -g http-server
```

2. Run the server:
```bash
http-server -p 8000
```

3. Open your browser and go to: `http://localhost:8000`

### Option 3: Live Server (VS Code Extension)

If using VS Code:

1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Why Use a Local Server?

Opening the HTML file directly in a browser (`file://` protocol) causes:
- CORS policy errors for fonts and resources
- Audio autoplay restrictions
- Preload resource warnings

Using a local server (`http://` protocol) resolves these issues.

## Production Deployment

The app is ready for production deployment. All files are optimized and security-checked.

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Free to use for personal and commercial purposes. 