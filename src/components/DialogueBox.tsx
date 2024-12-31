import { useEffect, useState } from 'react';
import gsap from 'gsap';

const DialogueBox = () => {
  const [text, setText] = useState('Welcome to the experience!');
  
  useEffect(() => {
    // Fade in animation
    gsap.from('.dialogue-box', {
      opacity: 0,
      duration: 1,
      y: 20
    });
  }, []);

  return (
    <div className="dialogue-box">
      {text}
    </div>
  );
};

export default DialogueBox; 