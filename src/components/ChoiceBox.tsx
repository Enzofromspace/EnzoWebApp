import { playClickSound } from '@/utils/soundEffects';
import gsap from 'gsap';

interface ChoiceBoxProps {
  text: string;
  onClick: () => void;
}

const ChoiceBox = ({ text, onClick }: ChoiceBoxProps) => {
  const handleClick = async () => {
    try {
      await playClickSound();
      onClick();
    } catch (err) {
      console.error('Error playing choice sound:', err);
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