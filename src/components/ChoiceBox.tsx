import { playClickSound } from '@/utils/soundEffects';

interface ChoiceBoxProps {
  text: string;
  onClick: () => void;
  socialLink?: string;
}

const ChoiceBox = ({ text, onClick, socialLink }: ChoiceBoxProps) => {
  const getSocialStyle = (text: string) => {
    if (!text.includes('\n')) return {};
    
    const platform = text.split('\n')[0].toLowerCase();
    const styles: { [key: string]: React.CSSProperties } = {
      youtube: {
        background: 'rgba(255, 0, 0, 0.9)',
        color: 'white'
      },
      linkedin: {
        background: 'rgba(0, 119, 181, 0.9)',
        color: 'white'
      },
      twitch: {
        background: 'rgba(145, 70, 255, 0.9)',
        color: 'white'
      },
      twitter: {
        background: 'rgba(29, 161, 242, 0.9)',
        color: 'white'
      },
      tiktok: {
        background: 'linear-gradient(45deg, #00f2ea, #ff0050)',
        color: 'white'
      }
    };

    return styles[platform] || {};
  };

  const handleClick = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setTimeout(async () => {
      try {
        await playClickSound();
        if (socialLink) {
          window.open(socialLink, '_blank');
        }
        onClick();
      } catch (err) {
        console.error('Error playing choice sound:', err);
        onClick();
      }
    }, 50);
  };

  const [title, icon, description] = text.split('\n');
  const isSocialButton = text.includes('\n');

  return (
    <button 
      className={`choice-box ${isSocialButton ? 'social-choice' : ''}`}
      onClick={handleClick}
      onTouchStart={() => {}}
      style={getSocialStyle(text)}
    >
      {isSocialButton ? (
        <>
          <div className="social-title">{title}</div>
          <div className="social-icon">{icon}</div>
          <div className="social-description">{description}</div>
        </>
      ) : text}
    </button>
  );
};

export default ChoiceBox; 