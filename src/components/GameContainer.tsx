import { Stage } from '@pixi/react';
import { useEffect, useState } from 'react';
import Background from '@/components/Background';
import Character from '@/components/Character';
import DialogueBox from '@/components/DialogueBox';
import ChoiceBox from '@/components/ChoiceBox';
import { initSoundEffects } from '@/utils/soundEffects';

const GameContainer = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const init = async () => {
      try {
        await initSoundEffects();
        console.log('Sound effects initialized');
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to initialize sound effects:', error);
      }
    };

    init();

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="game-container">
      <Stage 
        width={dimensions.width} 
        height={dimensions.height}
        options={{
          backgroundColor: 0x000000,
          antialias: true,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
        }}
      >
        <Background />
        <Character />
      </Stage>
      
      {isLoaded && (
        <>
          <DialogueBox />
          <div className="choices-container">
            <ChoiceBox text="Choice 1" onClick={() => console.log('Choice 1 clicked')} />
            <ChoiceBox text="Choice 2" onClick={() => console.log('Choice 2 clicked')} />
            <ChoiceBox text="Choice 3" onClick={() => console.log('Choice 3 clicked')} />
          </div>
        </>
      )}
    </div>
  );
};

export default GameContainer; 