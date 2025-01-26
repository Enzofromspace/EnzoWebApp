import { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { getCurrentText, handleEasterEggClick } from '@/utils/dialogueManager';
import { playTextBlip } from '@/utils/soundEffects';

const DialogueBox = () => {
  // Text display state
  const [displayText, setDisplayText] = useState(getCurrentText());
  const [fullText, setFullText] = useState(getCurrentText());
  const [isAnimating, setIsAnimating] = useState(true);
  
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
    const handleDialogueUpdate = (event: CustomEvent) => {
      const newText = getCurrentText();
      setFullText(newText);
      
      if (event.detail?.skipAnimation) {
        setDisplayText(newText);
        setIsAnimating(false);
        window.dispatchEvent(new CustomEvent('text-animation-complete'));
      } else {
        if (dialogueRef.current) {
          gsap.fromTo(dialogueRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5 }
          );
        }
        animateText(newText);
      }
    };

    // Start initial animation immediately with the current text
    setDisplayText(getCurrentText());
    
    window.addEventListener('dialogue-update', handleDialogueUpdate as EventListener);
    return () => {
      window.removeEventListener('dialogue-update', handleDialogueUpdate as EventListener);
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
      window.dispatchEvent(new CustomEvent('text-animation-complete'));
    } else if (fullText.includes('🎮') || fullText.includes('🔓') || fullText.includes('🎯')) {
      handleEasterEggClick();
      // Add visual feedback
      if (dialogueRef.current) {
        gsap.fromTo(dialogueRef.current,
          { scale: 1 },
          { 
            scale: 1.05, 
            duration: 0.2, 
            yoyo: true, 
            repeat: 1,
            ease: 'power2.out'
          }
        );
      }
    }
  };

  if (!fullText) return null;

  return (
    <div 
      ref={dialogueRef} 
      className={`dialogue-box ${isAnimating ? 'clickable' : ''} ${
        fullText.includes('🎮') || fullText.includes('🔓') || fullText.includes('🎯') 
          ? 'easter-egg' 
          : ''
      }`}
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