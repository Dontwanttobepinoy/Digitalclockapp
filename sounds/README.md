# Sound Files for DigitalClockApp

This directory should contain the following audio files for the digital clock app:

## Required Files:

1. **click.mp3** or **click.wav** - Button click sound
   - Short click sound played when buttons are pressed
   - Should be subtle and not too loud
   - Duration: ~100-200ms

2. **alarm.mp3** or **alarm.wav** - Timer alarm sound
   - Alarm sound played when countdown timer reaches zero
   - Should be attention-grabbing but not jarring
   - Should loop until stopped
   - Duration: ~2-5 seconds (will loop)

## File Format Notes:

- MP3 format is preferred for better browser compatibility
- WAV files are provided as fallback
- Keep file sizes small for faster loading
- Volume should be moderate (the app controls volume programmatically)

## Implementation:

The app will attempt to play these sounds when:
- **click sound**: Any button press (when not muted)
- **alarm sound**: Timer countdown reaches zero (when not muted)

If the files are not found, the app will continue to work but without sound effects.

The MUTE toggle in the app controls whether these sounds play.