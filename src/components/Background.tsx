import { Sprite } from '@pixi/react';
import { useState, useEffect } from 'react';

const Background = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    scale: { x: 1, y: 1 },
    position: { x: 0, y: 0 }
  });

  const updateDimensions = (imgWidth: number, imgHeight: number) => {
    const windowAspectRatio = window.innerWidth / window.innerHeight;
    const imageAspectRatio = imgWidth / imgHeight;
    let scale = { x: 1, y: 1 };
    let position = { x: 0, y: 0 };

    if (windowAspectRatio > imageAspectRatio) {
      // Window is wider than image
      scale.x = scale.y = window.innerWidth / imgWidth;
      position.y = (window.innerHeight - (imgHeight * scale.y)) / 2;
    } else {
      // Window is taller than image
      scale.x = scale.y = window.innerHeight / imgHeight;
      position.x = (window.innerWidth - (imgWidth * scale.x)) / 2;
    }

    setDimensions({
      width: imgWidth,
      height: imgHeight,
      scale,
      position
    });
  };

  useEffect(() => {
    const img = new Image();
    img.src = '/images/background.png';
    
    img.onload = () => {
      setIsLoaded(true);
      updateDimensions(img.width, img.height);
    };

    const handleResize = () => {
      if (img.complete) {
        updateDimensions(img.width, img.height);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isLoaded) return null;

  return (
    <Sprite
      image={'/images/background.png'}
      width={dimensions.width}
      height={dimensions.height}
      scale={dimensions.scale}
      x={dimensions.position.x}
      y={dimensions.position.y}
      anchor={{ x: 0, y: 0 }}
    />
  );
};

export default Background; 