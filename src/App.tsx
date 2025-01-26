import GameContainer from '@/components/GameContainer';
import '@/index.css';
import { initSoundEffects } from './utils/soundEffects';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const init = async () => {
      await initSoundEffects();
    };
    
    init().catch(console.error);
  }, []);

  return (
    <div className="app">
      <GameContainer />
    </div>
  );
}

export default App; 