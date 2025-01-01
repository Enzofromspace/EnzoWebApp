import GameContainer from '@/components/GameContainer';
import '@/index.css';
import { startAutoPlay } from './utils/dialogueManager';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Start auto-play after a short delay to ensure UI is ready
    const timer = setTimeout(() => {
      startAutoPlay();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app">
      <GameContainer />
    </div>
  );
}

export default App; 