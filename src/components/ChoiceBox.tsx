import { playClickSound } from '@/utils/soundEffects';
import gsap from 'gsap';

interface ChoiceBoxProps {
  text: string;      // Choice text to display
  onClick: () => void; // Parent callback for choice selection
}

const ChoiceBox = ({ text, onClick }: ChoiceBoxProps) => {
  // Handle click with sound effect
  const handleClick = async () => {
    try {
      // Play sound before triggering choice action
      await playClickSound();
      onClick();
    } catch (err) {
      console.error('Error playing choice sound:', err);
      // Ensure choice still works if sound fails
      onClick();
    }
  };

  return (
    <button 
      className="choice-box"
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default ChoiceBox; 