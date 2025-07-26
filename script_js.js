let is24Hour = false;

function updateClock() {
    const now = new Date();
    
    // Format time based on current mode
    let timeString;
    if (is24Hour) {
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeString = `${hours}<span class="colon">:</span>${minutes}`;
    } else {
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        timeString = `${hours.toString().padStart(2, '0')}<span class="colon">:</span>${minutes} ${ampm}`;
    }
    
    // Format date (MMM/DD/YYYY)
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
                  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = months[now.getMonth()];
    const day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear();
    const dateString = `${month}/${day}/${year}`;
    
    // Update display (using innerHTML to support the colon span)
    document.getElementById('time').innerHTML = timeString;
    document.getElementById('date').textContent = dateString;
}

// Toggle between 12H and 24H format
document.getElementById('formatToggle').addEventListener('click', function() {
    is24Hour = !is24Hour;
    this.textContent = is24Hour ? '24H' : '12H';
    updateClock(); // Update immediately
});

// Update immediately and then every second
updateClock();
setInterval(updateClock, 1000);