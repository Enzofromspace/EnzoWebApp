import * as Tone from 'tone';

let synth: Tone.PolySynth | null = null;
let isInitialized = false;

export const initSoundEffects = async () => {
  if (isInitialized) return;
  
  try {
    // Only start audio context after user interaction
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
    
    // Create a more sophisticated synth with better envelope settings
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.1,
        release: 0.3
      },
      volume: -6 // Slightly reduce volume to prevent clipping
    }).toDestination();

    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize sound effects:', error);
  }
};

export const playClickSound = async () => {
  if (!isInitialized) {
    await initSoundEffects();
  }
  
  try {
    if (synth) {
      await Tone.start();
      
      // Create a sequence of notes with specific timing
      const now = Tone.now();
      const sixteenth = 0.1; // Adjust timing for faster/slower arpeggio
      
      // Play the arpeggio sequence
      synth.triggerAttackRelease('C5', '16n', now);
      synth.triggerAttackRelease('F5', '16n', now + sixteenth);
      synth.triggerAttackRelease('G5', '16n', now + sixteenth * 2);
      
      // Final resolving chord
      synth.triggerAttackRelease(['C5', 'G5'], '8n', now + sixteenth * 3);
    }
  } catch (error) {
    console.error('Failed to play click sound:', error);
  }
}; 