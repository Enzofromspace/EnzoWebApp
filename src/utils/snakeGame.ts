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
  let score = 0;
  let gameInterval: ReturnType<typeof setInterval> | null = null;

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

  const drawFood = () => {
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(
      food.x * GRID_SIZE,
      food.y * GRID_SIZE,
      GRID_SIZE - 2,
      GRID_SIZE - 2
    );
  };

  const moveSnake = () => {
    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;
    
    if (head.x < 0) head.x = GAME_SIZE / GRID_SIZE - 1;
    if (head.x >= GAME_SIZE / GRID_SIZE) head.x = 0;
    if (head.y < 0) head.y = GAME_SIZE / GRID_SIZE - 1;
    if (head.y >= GAME_SIZE / GRID_SIZE) head.y = 0;
    
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      document.querySelector('.score')!.textContent = `Score: ${score}`;
      food = {
        x: Math.floor(Math.random() * (GAME_SIZE / GRID_SIZE)),
        y: Math.floor(Math.random() * (GAME_SIZE / GRID_SIZE))
      };
    } else {
      snake.pop();
    }
  };

  const gameLoop = () => {
    ctx.clearRect(0, 0, GAME_SIZE, GAME_SIZE);
    moveSnake();
    drawFood();
    drawSnake();
  };

  const startGame = () => {
    // Clear any existing interval
    if (gameInterval) {
      clearInterval(gameInterval);
    }
    
    // Reset game state
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    direction = { x: 1, y: 0 };
    score = 0;
    document.querySelector('.score')!.textContent = `Score: 0`;
    
    // Start new game loop
    gameInterval = setInterval(gameLoop, 100);
  };

  // Add cleanup function
  const cleanup = () => {
    if (gameInterval) {
      clearInterval(gameInterval);
    }
    document.removeEventListener('keydown', handleKeydown);
  };

  const handleKeydown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp': direction = { x: 0, y: -1 }; break;
      case 'ArrowDown': direction = { x: 0, y: 1 }; break;
      case 'ArrowLeft': direction = { x: -1, y: 0 }; break;
      case 'ArrowRight': direction = { x: 1, y: 0 }; break;
    }
  };

  document.getElementById('start-game')?.addEventListener('click', startGame);
  document.addEventListener('keydown', handleKeydown);

  // Return cleanup function
  return cleanup;
}; 