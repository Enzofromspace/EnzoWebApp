import { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { getCurrentText, handleEasterEggClick } from '@/utils/dialogueManager';
import { playTextBlip } from '@/utils/soundEffects';

const DialogueBox = () => {
  const [displayText, setDisplayText] = useState('');
  const [fullText, setFullText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const dialogueRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const CHAR_DELAY = 50; // ms between each character

  const animateText = useCallback((text: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setIsAnimating(true);
    setDisplayText('');
    let currentIndex = 0;

    const showNextChar = async () => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        
        if (currentIndex < text.length && text[currentIndex]?.trim()) {
          await playTextBlip();
        }
        
        currentIndex++;
        timeoutRef.current = setTimeout(showNextChar, CHAR_DELAY);
      } else {
        setIsAnimating(false);
        window.dispatchEvent(new CustomEvent('text-animation-complete'));
      }
    };

    showNextChar();
  }, []);

  // Separate effect for handling dialogue updates
  useEffect(() => {
    const handleDialogueUpdate = () => {
      const newText = getCurrentText();
      setFullText(newText);
      
      if (dialogueRef.current) {
        gsap.fromTo(dialogueRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5 }
        );
      }
      
      // Always animate new text
      animateText(newText);
    };

    // Initial text load
    handleDialogueUpdate();

    // Listen for updates
    window.addEventListener('dialogue-update', handleDialogueUpdate);
    return () => {
      window.removeEventListener('dialogue-update', handleDialogueUpdate);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [animateText]); // Only depend on animateText

  const handleClick = () => {
    if (isAnimating) {
      // Skip animation if clicked during animation
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setDisplayText(fullText);
      setIsAnimating(false);
    } else if (fullText.includes('🎮') || fullText.includes('🔓') || fullText.includes('🎯')) {
      handleEasterEggClick();
    }
  };

  if (!fullText) return null;

  return (
    <div 
      ref={dialogueRef} 
      className={`dialogue-box ${isAnimating ? 'clickable' : ''}`}
      onClick={handleClick}
      style={{ 
        cursor: (isAnimating || fullText.includes('🎮') || fullText.includes('🔓') || fullText.includes('🎯')) 
          ? 'pointer' 
          : 'default' 
      }}
    >
      <div className="dialogue-tail"></div>
      {displayText}
    </div>
  );
};

export default DialogueBox; 