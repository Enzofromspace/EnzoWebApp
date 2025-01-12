import GameContainer from '@/components/GameContainer';
import '@/index.css';
import { initSoundEffects } from './utils/soundEffects';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Initialize sound effects when component mounts
    initSoundEffects().catch(console.error);
  }, []);

  return (
    <div className="app">
      <GameContainer />
    </div>
  );
}

export default App; 