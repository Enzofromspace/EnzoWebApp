import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { getCurrentText } from '@/utils/dialogueManager';

const DialogueBox = () => {
  const [text, setText] = useState<string>('');
  const dialogueRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    try {
      const currentText = getCurrentText();
      setText(currentText);

      if (dialogueRef.current) {
        gsap.fromTo(dialogueRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 }
        );
      }
    } catch (err) {
      console.error('Dialogue initialization error:', err);
    }
  }, []);

  if (!text) return null;

  return (
    <div ref={dialogueRef} className="dialogue-box">
      {text}
    </div>
  );
};

export default DialogueBox; 