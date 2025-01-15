import { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { getCurrentText, handleEasterEggClick } from '@/utils/dialogueManager';
import { playTextBlip } from '@/utils/soundEffects';

const DialogueBox = () => {
  // Text display state
  const [displayText, setDisplayText] = useState(getCurrentText());  // Initialize with current text
  const [fullText, setFullText] = useState(getCurrentText());       // Initialize with current text
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Refs for animation control
  const dialogueRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  // Animation timing constant
  const CHAR_DELAY = 50; // ms between each character

  // Text animation handler with sound
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

  // Handle dialogue state updates
  useEffect(() => {
    const handleDialogueUpdate = () => {
      const newText = getCurrentText();
      setFullText(newText);
      
      // Animate dialogue box entry
      if (dialogueRef.current) {
        gsap.fromTo(dialogueRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5 }
        );
      }
      
      // Start text animation
      animateText(newText);
    };

    // Trigger initial animation
    handleDialogueUpdate();

    window.addEventListener('dialogue-update', handleDialogueUpdate);
    return () => {
      window.removeEventListener('dialogue-update', handleDialogueUpdate);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [animateText]);

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