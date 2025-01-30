import { Container as PixiContainer, Sprite as PixiSprite } from '@pixi/react';
import { useState, useEffect } from 'react';

const Character = () => {
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const characterTexture = `${import.meta.env.BASE_URL}assets/images/character.png`;
  
  const position = {
    x: isMobile ? window.innerWidth * 0.5 : window.innerWidth * 0.15,
    y: isMobile ? window.innerHeight * 0.5 : window.innerHeight * 0.85
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      // Emit position change event
      window.dispatchEvent(new CustomEvent('character-move', {
        detail: {
          x: window.innerWidth * 0.15,
          y: window.innerWidth <= 768 ? window.innerHeight * 0.45 : window.innerHeight * 0.85
        }
      }));
    };

    setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    
    const img = new Image();
    img.src = characterTexture;
    img.onload = () => setIsLoaded(true);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!isLoaded) return null;

  return (
    <PixiContainer>
      <PixiSprite 
        image={characterTexture}
        x={position.x}
        y={position.y}
        anchor={{ x: 0.5, y: 1 }}
        scale={isMobile ? 0.4 : 0.5}
      />
    </PixiContainer>
  );
};

export default Character; 