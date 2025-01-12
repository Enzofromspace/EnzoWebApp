import * as Tone from 'tone';

let synth: Tone.Synth | null = null;
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

export const initSoundEffects = async () => {
  if (isInitialized) return;
  if (initializationPromise) return initializationPromise;
  
  initializationPromise = (async () => {
    try {
      await Tone.start();
      await Tone.context.resume();
      
      synth = new Tone.Synth({
        oscillator: { type: "square" },
        envelope: {
          attack: 0.01,
          decay: 0.1,
          sustain: 0,
          release: 0.1
        }
      }).toDestination();
      
      isInitialized = true;
    } catch (err) {
      console.error('Failed to initialize sound effects:', err);
      throw err;
    } finally {
      initializationPromise = null;
    }
  })();

  return initializationPromise;
};

export const playTextBlip = async () => {
  if (!isInitialized) return;
  
  try {
    if (synth) {
      await synth.triggerAttackRelease("C5", "32n", undefined, 0.1);
    }
  } catch (err) {
    console.error('Failed to play text blip:', err);
  }
};

export const playChoiceSound = async () => {
  if (!isInitialized) return;
  
  try {
    if (synth) {
      await synth.triggerAttackRelease("G4", "16n", undefined, 0.2);
    }
  } catch (err) {
    console.error('Failed to play choice sound:', err);
  }
}; 