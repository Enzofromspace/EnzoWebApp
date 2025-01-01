import { Sprite } from '@pixi/react';
import { useState, useEffect } from 'react';

const Character = () => {
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const characterTexture = '/images/character.png';

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = characterTexture;
    
    img.onload = () => {
      setIsLoaded(true);
    };
  }, []);

  if (!isLoaded) return null;

  return (
    <Sprite 
      image={characterTexture}
      x={window.innerWidth * 0.2}
      y={isMobile ? window.innerHeight * 0.45 : window.innerHeight * 0.8}
      anchor={{ x: 0.5, y: 0.5 }}
      scale={isMobile ? 0.4 : 0.5}
    />
  );
};

export default Character; 