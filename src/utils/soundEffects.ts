import * as Tone from 'tone';

let synth: Tone.PolySynth | null = null;
let blipSynth: Tone.Synth | null = null;
let isInitialized = false;

export const initSoundEffects = async () => {
  if (isInitialized) return;
  
  try {
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
    
    // Main synth for button clicks
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.1,
        release: 0.3
      },
      volume: -6
    }).toDestination();

    // Blip synth for text animation
    blipSynth = new Tone.Synth({
      oscillator: { type: 'square' },
      envelope: {
        attack: 0.01,
        decay: 0.05,
        sustain: 0,
        release: 0.05
      },
      volume: -12 // Quieter than main synth
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
      const now = Tone.now();
      const sixteenth = 0.1;
      
      synth.triggerAttackRelease('C5', '16n', now);
      synth.triggerAttackRelease('F5', '16n', now + sixteenth);
      synth.triggerAttackRelease('G5', '16n', now + sixteenth * 2);
      synth.triggerAttackRelease(['C5', 'G5'], '8n', now + sixteenth * 3);
    }
  } catch (error) {
    console.error('Failed to play click sound:', error);
  }
};

export const playTextBlip = async () => {
  if (!isInitialized) {
    await initSoundEffects();
  }

  try {
    if (blipSynth) {
      await Tone.start();
      // Randomly choose between a few notes in C major scale
      const notes = ['C6', 'E6', 'G6'];
      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      blipSynth.triggerAttackRelease(randomNote, '32n');
    }
  } catch (error) {
    console.error('Failed to play text blip:', error);
  }
}; 