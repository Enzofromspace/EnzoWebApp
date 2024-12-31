import * as Tone from 'tone';

let clickSound: Tone.Player;

export const initSoundEffects = async () => {
  // Wait for user interaction before starting audio context
  await Tone.start();
  
  clickSound = new Tone.Player({
    url: '/sounds/click.mp3',
    autostart: false,
  }).toDestination();
};

export const playClickSound = () => {
  clickSound?.start();
}; 