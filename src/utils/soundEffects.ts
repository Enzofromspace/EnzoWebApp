import * as Tone from 'tone';

// let synth: Tone.PolySynth | null = null;
let blipSynth: Tone.Synth | null = null;
let isInitialized = false;

export const initSoundEffects = async () => {
  if (isInitialized) return;
  
  try {
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }

    // Main synth for button clicks (unchanged)
    // synth = new Tone.PolySynth(Tone.Synth, {
    //   oscillator: { type: 'fatsquare' },
    //   envelope: {
    //     attack: 0.02,
    //     decay: 0.1,
    //     sustain: 0.1,
    //     release: 0.3
    //   },
    //   volume: -6
    // }).toDestination();

    // Highpass filter for blip synth
    const filter = new Tone.Filter({
      type: "highpass",
      frequency: 1500, // Removes low-end, keeps sharpness
      rolloff: -12
    }).toDestination();

    // Blip synth with percussive adjustments
    blipSynth = new Tone.Synth({
      oscillator: {
        type: 'triangle', // Punchier sound than sine
      },
      envelope: {
        attack: 0.005,    // Instant attack for percussive effect
        decay: 0.1,       // Quick decay for sharpness
        sustain: 0,       // No sustained tone
        release: 0.1      // Short release for clean cutoff
      },
      volume: -10 // Slightly louder to emphasize percussive quality
    }).connect(filter);

    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize sound effects:', error);
  }
};

export const playTextBlip = async () => {
  if (!isInitialized) {
    await initSoundEffects();
  }

  try {
    if (blipSynth) {
      await Tone.start();

      // Alternative notes with lower octaves for balance
      const notes = ['C3', 'E3', 'G3', 'F3', 'A3', 'C4'];
      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      
      const now = Tone.now();
      blipSynth.triggerAttackRelease(randomNote, '32n', now); // Shorter note duration for percussive feel
    }
  } catch (error) {
    console.error('Failed to play text blip:', error);
  }
};

export const playClickSound = async () => {
  if (!isInitialized) {
    await initSoundEffects();
  }

  try {
    if (blipSynth) {
      await Tone.start();
      const now = Tone.now();
      // Play a sequence with the blipSynth
      blipSynth.triggerAttackRelease('C5', '16n', now);
      blipSynth.triggerAttackRelease('G5', '16n', now + 0.1);
    }
  } catch (error) {
    console.error('Failed to play click sound:', error);
  }
};


