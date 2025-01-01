import { Stage } from '@pixi/react';
import { useEffect, useState, useCallback } from 'react';
import Background from '@/components/Background';
import Character from '@/components/Character';
import DialogueBox from '@/components/DialogueBox';
import ChoiceBox from '@/components/ChoiceBox';
import { initSoundEffects } from '@/utils/soundEffects';
import { getCurrentChoices, makeChoice, DialogueChoice } from '@/utils/dialogueManager';
import gsap from 'gsap';

const GameContainer = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [choices, setChoices] = useState<DialogueChoice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    // Initialize choices immediately
    try {
      const currentChoices = getCurrentChoices();
      setChoices(currentChoices);
    } catch (err) {
      console.error('Failed to load initial choices:', err);
      setError('Failed to load choices');
    }
  }, []); // Empty dependency array means this runs once on mount

  const initialize = useCallback(async () => {
    if (isInitialized) return;
    
    try {
      console.log('Initializing game components...');
      await initSoundEffects();
      setIsInitialized(true);
    } catch (err) {
      console.error('Initialization error:', err);
      setError('Failed to initialize game components');
    }
  }, [isInitialized]);

  const handleChoice = async (index: number) => {
    if (!isInitialized) {
      await initialize();
    }
    
    try {
      gsap.to('.choices-container', {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          makeChoice(index);
          setChoices(getCurrentChoices());
          gsap.to('.choices-container', {
            opacity: 1,
            duration: 0.3
          });
        }
      });
    } catch (err) {
      console.error('Choice handling error:', err);
      setError('Failed to process choice');
    }
  };

  useEffect(() => {
    const handleFirstInteraction = () => {
      initialize();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [initialize]);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

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
      {isInitialized && (
        <>
          <DialogueBox />
          <div className="choices-container">
            {choices.map((choice, index) => (
              <ChoiceBox 
                key={index}
                text={choice.text}
                onClick={() => handleChoice(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GameContainer; 