import { resetToHome } from '@/utils/dialogueManager';
import { playClickSound } from '@/utils/soundEffects';

const ResetButton = () => {
  const handleReset = () => {
    playClickSound();
    resetToHome();
  };

  return (
    <button 
      className="reset-button" 
      onClick={handleReset}
    >
      🏠 Home
    </button>
  );
};

export default ResetButton; 