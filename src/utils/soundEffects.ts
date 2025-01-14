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

    // Updated blip synth for eerie text sounds
    const filter = new Tone.Filter({
      type: "highpass",
      frequency: 1200,
      rolloff: -12
    }).toDestination();

    blipSynth = new Tone.Synth({
      oscillator: {
        type: 'square',
      },
      envelope: {
        attack: 0.05,
        decay: 0.5,
        sustain: 0.5,
        release: 0.5
      },
      volume: -20 // Slightly quieter
    }).connect(filter);

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
      // Use lower notes for eerier sound
      const notes = ['C4', 'E4', 'G4'];
    //  F4, A4, C5 
    // C4, E4, G4
      const randomNote = notes[Math.floor(Math.random() * notes.length)];      
      blipSynth.triggerAttackRelease(randomNote, '16n');
    }
  } catch (error) {
    console.error('Failed to play text blip:', error);
  }
}; 