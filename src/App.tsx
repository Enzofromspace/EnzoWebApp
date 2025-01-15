import GameContainer from '@/components/GameContainer';
import '@/index.css';
import { initSoundEffects } from './utils/soundEffects';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Initialize sound effects and trigger initial dialogue state
    const init = async () => {
      await initSoundEffects();
      // Dispatch initial dialogue update event
      window.dispatchEvent(new CustomEvent('dialogue-update'));
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