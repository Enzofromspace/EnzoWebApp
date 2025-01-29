import { Sprite as PixiSprite } from '@pixi/react';
import { useState, useEffect } from 'react';

const Background = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const backgroundTexture = `${import.meta.env.BASE_URL}assets/images/background.png`;

  useEffect(() => {
    const img = new Image();
    img.src = backgroundTexture;
    img.onload = () => setIsLoaded(true);
  }, []);

  if (!isLoaded) return null;

  return (
    <PixiSprite
      image={backgroundTexture}
      width={window.innerWidth}
      height={window.innerHeight}
      x={0}
      y={0}
    />
  );
};

export default Background; 