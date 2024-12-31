import { Sprite } from '@pixi/react';
import { useState, useEffect } from 'react';

const Character = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const characterTexture = '/images/character.png';

  useEffect(() => {
    const img = new Image();
    img.src = characterTexture;
    console.log('Attempting to load character:', img.src);
    
    img.onload = () => {
      console.log('Character loaded successfully');
      setIsLoaded(true);
    };

    img.onerror = (e) => {
      console.error('Failed to load character:', e);
    };
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <Sprite 
      image={characterTexture}
      x={100}
      y={window.innerHeight / 2}
      anchor={{ x: 0.5, y: 0.5 }}
      scale={0.5}
    />
  );
};

export default Character; 