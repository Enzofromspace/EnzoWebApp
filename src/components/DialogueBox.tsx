import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { getCurrentText, handleEasterEggClick } from '@/utils/dialogueManager';

const DialogueBox = () => {
  const [text, setText] = useState<string>('');
  const dialogueRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const updateText = () => {
      const newText = getCurrentText();
      if (newText !== text) {
        setText(newText);
        if (dialogueRef.current) {
          gsap.fromTo(dialogueRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5 }
          );
        }
      }
    };

    // Initial text
    updateText();

    // Listen for dialogue updates
    window.addEventListener('dialogue-update', updateText);
    return () => window.removeEventListener('dialogue-update', updateText);
  }, [text]);

  const handleClick = () => {
    if (text.includes('🎮') || text.includes('🔓') || text.includes('🎯')) {
      handleEasterEggClick();
    }
  };

  if (!text) return null;

  return (
    <div 
      ref={dialogueRef} 
      className="dialogue-box"
      onClick={handleClick}
      style={{ cursor: text.includes('🎮') || text.includes('🔓') || text.includes('🎯') ? 'pointer' : 'default' }}
    >
      <div className="dialogue-tail"></div>
      {text}
    </div>
  );
};

export default DialogueBox; 