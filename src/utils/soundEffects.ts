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
    
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0,
        release: 0.1
      }
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
      // Play a quick arpeggio for click effect
      synth.triggerAttackRelease(['C5', 'E5'], '32n');
    }
  } catch (error) {
    console.error('Failed to play click sound:', error);
  }
}; 