import { Sprite } from '@pixi/react';
import { useCallback } from 'react';

const Character = () => {
  // Load character texture
  const characterTexture = './assets/images/character.png';

  const onLoad = useCallback(() => {
    // Add character animations here
    console.log('Character loaded');
  }, []);

  return (
    <Sprite 
      image={characterTexture}
      x={100}
      y={window.innerHeight / 2}
      anchor={{ x: 0.5, y: 0.5 }}
      onLoad={onLoad}
    />
  );
};

export default Character; 