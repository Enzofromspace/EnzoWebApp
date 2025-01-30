export const initSnakeGame = () => {
  const canvas = document.getElementById('snake-game') as HTMLCanvasElement;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const GRID_SIZE = 20;
  const GAME_SIZE = 400;
  
  let snake = [{ x: 10, y: 10 }];
  let food = { x: 15, y: 15 };
  let direction = { x: 0, y: 0 };
  let lastDirection = { x: 0, y: 0 }; // Track last direction for collision detection
  let score = 0;
  let gameInterval: ReturnType<typeof setInterval> | null = null;
  let isGameOver = false;
  let blinkInterval: ReturnType<typeof setInterval> | null = null;
  // let showPlayAgain = true;

  // Draw the snake segments
  const drawSnake = () => {
    ctx.fillStyle = '#00ff00';
    snake.forEach(segment => {
      ctx.fillRect(
        segment.x * GRID_SIZE,
        segment.y * GRID_SIZE,
        GRID_SIZE - 2,
        GRID_SIZE - 2
      );
    });
  };

  // Draw food pellet
  const drawFood = () => {
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(
      food.x * GRID_SIZE,
      food.y * GRID_SIZE,
      GRID_SIZE - 2,
      GRID_SIZE - 2
    );
  };

  // Check for collisions with snake body
  const checkCollision = (head: { x: number; y: number }) => {
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
  };

  // Check for opposite direction movement
  const isOppositeDirection = (newDir: { x: number; y: number }) => {
    return (newDir.x !== 0 && newDir.x === -lastDirection.x) || 
           (newDir.y !== 0 && newDir.y === -lastDirection.y);
  };

  // Handle game over state
  const endGame = () => {
    isGameOver = true;
    if (gameInterval) clearInterval(gameInterval);
    
    // Start blinking "Play Again?" text
    let blink = true;
    blinkInterval = setInterval(() => {
      ctx.clearRect(0, 0, GAME_SIZE, GAME_SIZE);
      drawSnake();
      drawFood();
      
      if (blink) {
        ctx.fillStyle = '#00ff00';
        ctx.font = '20px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('Play Again?', GAME_SIZE / 2, GAME_SIZE / 2);
      }
      blink = !blink;
    }, 500);

    // Remove scroll prevention
    document.body.classList.remove('game-active');
    window.removeEventListener('keydown', preventScroll);
  };

  const checkAchievement = () => {
    if (score === 50) {
      if (gameInterval) clearInterval(gameInterval);
      
      // Create black background by clearing canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, GAME_SIZE, GAME_SIZE);
      
      // Draw achievement text in green
      ctx.fillStyle = '#00ff00';
      ctx.font = '16px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText('Achievement Unlocked!', GAME_SIZE / 2, GAME_SIZE / 2 - 60);
      ctx.fillText('Deep Lore Passcode:', GAME_SIZE / 2, GAME_SIZE / 2 - 20);
      ctx.fillText('666999', GAME_SIZE / 2, GAME_SIZE / 2 + 20);
      
      // Add continue button below
      const continueBtn = document.createElement('button');
      continueBtn.textContent = 'Continue Game';
      continueBtn.className = 'continue-game-btn';
      continueBtn.style.cssText = `
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: ${GAME_SIZE / 2 + 60}px;
      `;
      
      const gameModal = document.querySelector('.game-modal');
      gameModal?.appendChild(continueBtn);
      
      continueBtn.onclick = () => {
        continueBtn.remove();
        gameInterval = setInterval(gameLoop, 100);
      };
    }
  };

  const moveSnake = () => {
    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;
    
    // Wrap around screen edges
    if (head.x < 0) head.x = GAME_SIZE / GRID_SIZE - 1;
    if (head.x >= GAME_SIZE / GRID_SIZE) head.x = 0;
    if (head.y < 0) head.y = GAME_SIZE / GRID_SIZE - 1;
    if (head.y >= GAME_SIZE / GRID_SIZE) head.y = 0;
    
    // Check for collisions
    if (checkCollision(head)) {
      endGame();
      return;
    }
    
    snake.unshift(head);
    lastDirection = { ...direction };
    
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      document.querySelector('.score')!.textContent = `Score: ${score}`;
      checkAchievement();
      food = {
        x: Math.floor(Math.random() * (GAME_SIZE / GRID_SIZE)),
        y: Math.floor(Math.random() * (GAME_SIZE / GRID_SIZE))
      };
    } else {
      snake.pop();
    }
  };

  const gameLoop = () => {
    if (isGameOver) return;
    ctx.clearRect(0, 0, GAME_SIZE, GAME_SIZE);
    moveSnake();
    drawFood();
    drawSnake();
  };

  const preventScroll = (e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }
  };

  const startGame = () => {
    // Add class to prevent scrolling
    document.body.classList.add('game-active');
    // Add scroll prevention
    window.addEventListener('keydown', preventScroll);
    // Reset game state
    if (blinkInterval) clearInterval(blinkInterval);
    if (gameInterval) clearInterval(gameInterval);
    
    isGameOver = false;
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    direction = { x: 1, y: 0 };
    lastDirection = { x: 1, y: 0 };
    score = 0;
    document.querySelector('.score')!.textContent = `Score: 0`;
    
    gameInterval = setInterval(gameLoop, 100);
  };

  const handleDirectionChange = (newDirection: string) => {
    const directionMap = {
      'up': { x: 0, y: -1 },
      'down': { x: 0, y: 1 },
      'left': { x: -1, y: 0 },
      'right': { x: 1, y: 0 }
    };

    const newDir = directionMap[newDirection as keyof typeof directionMap];
    if (newDir && !isOppositeDirection(newDir)) {
      direction = newDir;
    }
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      // Clean up and close modal
      cleanup();
      const modal = document.querySelector('.game-modal');
      modal?.remove();
      return;
    }

    if (isGameOver && e.key === 'Enter') {
      startGame();
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
        handleDirectionChange('up');
        break;
      case 'ArrowDown':
        handleDirectionChange('down');
        break;
      case 'ArrowLeft':
        handleDirectionChange('left');
        break;
      case 'ArrowRight':
        handleDirectionChange('right');
        break;
    }
  };

  const cleanup = () => {
    document.body.classList.remove('game-active');
    window.removeEventListener('keydown', preventScroll);
    if (gameInterval) clearInterval(gameInterval);
    if (blinkInterval) clearInterval(blinkInterval);
    document.removeEventListener('keydown', handleKeydown);
  };

  document.getElementById('start-game')?.addEventListener('click', startGame);
  document.addEventListener('keydown', handleKeydown);

  // Add mobile controls
  if (window.innerWidth <= 768) {
    const controls = document.createElement('div');
    controls.className = 'snake-controls';
    controls.innerHTML = `
      <button class="control-button control-up">⬆️</button>
      <button class="control-button control-right">➡️</button>
      <button class="control-button control-down">⬇️</button>
      <button class="control-button control-left">⬅️</button>
    `;
    
    const gameControls = document.querySelector('.game-controls');
    if (gameControls) {
      gameControls.appendChild(controls);
    }

    // Handle both click and touch events
    const buttons = {
      up: controls.querySelector('.control-up'),
      down: controls.querySelector('.control-down'),
      left: controls.querySelector('.control-left'),
      right: controls.querySelector('.control-right')
    };

    // Add both click and touch handlers
    Object.entries(buttons).forEach(([dir, button]) => {
      if (button) {
        const handleInput = (e: Event) => {
          e.preventDefault();
          handleDirectionChange(dir);
        };
        
        button.addEventListener('touchstart', handleInput, { passive: false });
        button.addEventListener('mousedown', handleInput);
      }
    });
  }

  // Add exit handler
  const exitButton = document.querySelector('.close-button');
  exitButton?.addEventListener('click', () => {
    cleanup();
    // ... existing exit code
  });

  return cleanup;
}; 