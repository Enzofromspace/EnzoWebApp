import { Stage } from '@pixi/react';
import { useEffect, useState } from 'react';
import Character from './Character';
import DialogueBox from './DialogueBox';
import ChoiceBox from './ChoiceBox';
import { initSoundEffects } from '../utils/soundEffects';

const GameContainer = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Initialize sound effects
    initSoundEffects();
    setIsLoaded(true);
  }, []);

  return (
    <div className="game-container">
      <Stage width={window.innerWidth} height={window.innerHeight}>
        {/* Background will be added here */}
        <Character />
      </Stage>
      
      {isLoaded && (
        <>
          <DialogueBox />
          <div className="choices-container">
            <ChoiceBox text="Choice 1" onClick={() => {}} />
            <ChoiceBox text="Choice 2" onClick={() => {}} />
            <ChoiceBox text="Choice 3" onClick={() => {}} />
          </div>
        </>
      )}
    </div>
  );
};

export default GameContainer; 