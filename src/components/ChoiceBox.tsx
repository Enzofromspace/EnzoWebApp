import { playClickSound } from '../utils/soundEffects';

interface ChoiceBoxProps {
  text: string;
  onClick: () => void;
}

const ChoiceBox = ({ text, onClick }: ChoiceBoxProps) => {
  const handleClick = () => {
    playClickSound();
    onClick();
  };

  return (
    <button className="choice-box" onClick={handleClick}>
      {text}
    </button>
  );
};

export default ChoiceBox; 