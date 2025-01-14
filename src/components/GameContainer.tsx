import { useEffect, useState } from 'react';
import { Stage } from '@pixi/react';
import { DialogueChoice, getCurrentChoices, makeChoice, resetToHome } from '@/utils/dialogueManager';
import { initSoundEffects } from '@/utils/soundEffects';
import DialogueBox from './DialogueBox';
import ChoiceBox from './ChoiceBox';
import Character from './Character';
import gsap from 'gsap';
import Background from './Background';

const GameContainer = () => {
  // Core state for choice management
  const [choices, setChoices] = useState<DialogueChoice[]>([]);
  
  // Error handling state
  const [error, setError] = useState<string | null>(null);
  
  // Responsive layout state
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

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

  // Initialize sound effects and choices on mount
  useEffect(() => {
    const init = async () => {
      try {
        await initSoundEffects();
        const currentChoices = getCurrentChoices();
        setChoices(currentChoices);
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Failed to initialize game components');
      }
    };

    init();
  }, []);

  // Handle choice selection with animation
  const handleChoice = (index: number) => {
    try {
      // Fade out current choices
      gsap.to('.choices-container', {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          // Update dialogue state
          makeChoice(index);
          // Update local choice state
          setChoices(getCurrentChoices());
          // Fade in new choices
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

  const handleHomeClick = () => {
    resetToHome();
    setChoices(getCurrentChoices());
  };

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
      <DialogueBox />
      <div className="choices-container">
        {choices.map((choice, index) => (
          <ChoiceBox
            key={index}
            text={choice.text}
            onClick={() => handleChoice(index)}
          />
        ))}
        <button className="home-button" onClick={handleHomeClick}>
          🏠
        </button>
      </div>
    </div>
  );
};

export default GameContainer; 