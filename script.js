const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const gridSize = 20;
const snakeSpeed = 100;
let gameStarted = false;
let score = 0;
let lastScore = 0;
let highScore = 0;
let computerSnake = [];



let snake = [{ x: gridSize * 5, y: gridSize * 5 }];
let food = { x: gridSize * 10, y: gridSize * 10 };
let snakeDirection = { x: gridSize, y: 0 };
let newSnakeSegments = 1;

function gameLoop() {
  if (gameStarted) {
    moveSnake();
    checkFoodCollision();
    checkSnakeCollision();
    checkBoundaryCollision();
    checkComputerSnakeCollision()
    if (score >= 5 && computerSnake.length === 0) {
      // Spawn computer-controlled snake with a length of 5 at a random boundary
      const startPosition = [
        { x: 0, y: gridSize * Math.floor(Math.random() * (canvas.height / gridSize)) },
        { x: canvas.width - gridSize, y: gridSize * Math.floor(Math.random() * (canvas.height / gridSize)) },
        { x: gridSize * Math.floor(Math.random() * (canvas.width / gridSize)), y: 0 },
        { x: gridSize * Math.floor(Math.random() * (canvas.width / gridSize)), y: canvas.height - gridSize },
      ];
      const initialPosition = startPosition[Math.floor(Math.random() * startPosition.length)];
      for (let i = 0; i < 5; i++) {
        computerSnake.push({ x: initialPosition.x, y: initialPosition.y });
      }
    }
    moveComputerSnake();
  }
  drawGameBoard();
  if (!gameStarted) {
    drawStartScreen();
  } else {
    drawSnake();
    drawFood();
    drawBorder();
    drawScore();
    drawComputerSnake();
  }
  setTimeout(gameLoop, snakeSpeed);
}


function moveComputerSnake() {
  if (computerSnake.length === 0) {
    return;
  }

  const directions = [
    { x: gridSize, y: 0 },
    { x: -gridSize, y: 0 },
    { x: 0, y: gridSize },
    { x: 0, y: -gridSize },
  ];

  // Get the current direction of the computer-controlled snake
  let currentDirection = {
    x: computerSnake[0].x - computerSnake[1].x,
    y: computerSnake[0].y - computerSnake[1].y,
  };

  // With a probability of 1/3, choose a new direction
  if (Math.random() < 1 / 3) {
    // Remove the opposite direction from the options
    const oppositeDirection = { x: -currentDirection.x, y: -currentDirection.y };
    const availableDirections = directions.filter(
      (direction) => direction.x !== oppositeDirection.x || direction.y !== oppositeDirection.y
    );

    // Choose a new direction randomly from the available directions
    currentDirection = availableDirections[Math.floor(Math.random() * availableDirections.length)];
  }

  const newHead = {
    x: computerSnake[0].x + currentDirection.x,
    y: computerSnake[0].y + currentDirection.y,
  };

  // Keep the computer-controlled snake within the boundary
  newHead.x = Math.max(0, Math.min(canvas.width - gridSize, newHead.x));
  newHead.y = Math.max(0, Math.min(canvas.height - gridSize, newHead.y));

  computerSnake.unshift(newHead);
  computerSnake.pop();
}


function drawComputerSnake() {
  if (computerSnake.length === 0) {
    return;
  }

  context.fillStyle = 'blue';
  for (const segment of computerSnake) {
    context.fillRect(segment.x, segment.y, gridSize, gridSize);
  }
}

function checkComputerSnakeCollision() {
  for (const segment of computerSnake) {
    if (snake[0].x === segment.x && snake[0].y === segment.y) {
      gameStarted = false;
      lastScore = score;
      highScore = Math.max(highScore, score);
      score = 0;
      snake = [{ x: gridSize * 5, y: gridSize * 5 }];
      snakeDirection = { x: gridSize, y: 0 };
      computerSnake = [];
    }
  }
}


function drawScore() {
  context.fillStyle = 'white';
  context.font = '16px sans-serif';
  context.textAlign = 'center';
  context.fillText(`Score: ${score}`, canvas.width / 2, 20);
}



function drawBorder() {
  context.strokeStyle = 'white';
  context.lineWidth = 2;
  context.strokeRect(0, 0, canvas.width, canvas.height);
}


function drawStartScreen() {
  context.fillStyle = 'white';
  context.font = '24px sans-serif';
  context.textAlign = 'center';
  context.fillText('Press Space to Start', canvas.width / 2, canvas.height / 2);

  if (lastScore > 0) {
    context.font = '16px sans-serif';
    context.fillText(`Last Score: ${lastScore}`, canvas.width / 2, canvas.height / 2 + 30);
  }

  if (highScore > 0) {
    context.font = '16px sans-serif';
    context.fillText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 + 60);
  }
}



function moveSnake() {
  const newHead = {
    x: snake[0].x + snakeDirection.x,
    y: snake[0].y + snakeDirection.y,
  };

  for (let i = 0; i < newSnakeSegments; i++) {
    snake.push({});
    newSnakeSegments--;
  }

  snake.unshift(newHead);
  snake.pop();
}

function checkFoodCollision() {
  if (snake[0].x === food.x && snake[0].y === food.y) {
    newSnakeSegments += 1;
    score += 1;
    placeFood();
  }
}

function checkBoundaryCollision() {
  if (
    snake[0].x < 0 ||
    snake[0].x >= canvas.width ||
    snake[0].y < 0 ||
    snake[0].y >= canvas.height
  ) {
    gameStarted = false;
    lastScore = score;
    highScore = Math.max(highScore, score);
    score = 0;
    snake = [{ x: gridSize * 5, y: gridSize * 5 }];
    snakeDirection = { x: gridSize, y: 0 };
  }
}

function checkSnakeCollision() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      gameStarted = false;
      lastScore = score;
      highScore = Math.max(highScore, score);
      score = 0;
      snake = [{ x: gridSize * 5, y: gridSize * 5 }];
      snakeDirection = { x: gridSize, y: 0 };
    }
  }
}


function drawGameBoard() {
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  context.fillStyle = 'lime';
  for (const segment of snake) {
    context.fillRect(segment.x, segment.y, gridSize, gridSize);
  }
}

function drawFood() {
  context.fillStyle = 'red';
  context.fillRect(food.x, food.y, gridSize, gridSize);
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
  };
}

document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    gameStarted = true;
  } else if (e.key === 'ArrowUp' && snakeDirection.y === 0) {
    snakeDirection = { x: 0, y: -gridSize };
  } else if (e.key === 'ArrowDown' && snakeDirection.y === 0) {
    snakeDirection = { x: 0, y: gridSize };
  } else if (e.key === 'ArrowLeft' && snakeDirection.x === 0) {
    snakeDirection = { x: -gridSize, y: 0 };
  } else if (e.key === 'ArrowRight' && snakeDirection.x === 0) {
    snakeDirection = { x: gridSize, y: 0 };
  }
});


gameLoop();
