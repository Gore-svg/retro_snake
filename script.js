const SIZE = 24;
const START_SPEED = 135;
const MIN_SPEED = 65;
const SPEED_STEP = 3;

const board = document.getElementById("gameBoard");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const messageEl = document.getElementById("message");

let snake;
let apple;
let direction;
let nextDirection;
let score;
let highScore = Number(localStorage.getItem("retroSnakeHighScore") || 0);
let gameTimer = null;
let running = false;
let paused = false;
let gameOver = false;
let speed = START_SPEED;

highScoreEl.textContent = formatScore(highScore);
createBoard();
showStartMessage();

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < SIZE * SIZE; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    board.appendChild(cell);
  }
}

function formatScore(value) {
  return String(value).padStart(5, "0");
}

function startGame() {
  clearInterval(gameTimer);

  snake = [
    { x: 12, y: 12 },
    { x: 11, y: 12 },
    { x: 10, y: 12 }
  ];

  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  speed = START_SPEED;
  running = true;
  paused = false;
  gameOver = false;

  placeApple();
  updateScore();
  hideMessage();
  render();

  gameTimer = setInterval(tick, speed);
}

function tick() {
  if (!running || paused) return;

  direction = nextDirection;

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  // Old-school Snake: hitting the border ends the game.
  if (
    head.x < 0 ||
    head.x >= SIZE ||
    head.y < 0 ||
    head.y >= SIZE ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    score += 10;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("retroSnakeHighScore", highScore);
    }

    speed = Math.max(MIN_SPEED, START_SPEED - score / 10 * SPEED_STEP);
    clearInterval(gameTimer);
    gameTimer = setInterval(tick, speed);

    placeApple();
    updateScore();
  } else {
    snake.pop();
  }

  render();
}

function placeApple() {
  do {
    apple = {
      x: Math.floor(Math.random() * SIZE),
      y: Math.floor(Math.random() * SIZE)
    };
  } while (snake && snake.some(segment => segment.x === apple.x && segment.y === apple.y));
}

function render() {
  const cells = board.children;

  for (const cell of cells) {
    cell.className = "cell";
  }

  snake.forEach((segment, index) => {
    const cell = cells[segment.y * SIZE + segment.x];
    cell.classList.add("snake");
    if (index === 0) cell.classList.add("snake-head");
  });

  cells[apple.y * SIZE + apple.x].classList.add("apple");
}

function updateScore() {
  scoreEl.textContent = formatScore(score);
  highScoreEl.textContent = formatScore(highScore);
}

function endGame() {
  running = false;
  gameOver = true;
  clearInterval(gameTimer);
  gameTimer = null;

  render();
  messageEl.innerHTML = `
    <div class="message-title">GAME OVER</div>
    <div>SCORE ${formatScore(score)}</div>
    <div>PRESS SPACE TO RESTART</div>
  `;
  messageEl.classList.remove("hidden");
}

function showStartMessage() {
  messageEl.innerHTML = `
    <div class="message-title">SNAKE</div>
    <div>PRESS SPACE TO START</div>
    <div class="controls">W A S D TO MOVE</div>
  `;
  messageEl.classList.remove("hidden");
}

function hideMessage() {
  messageEl.classList.add("hidden");
}

function togglePause() {
  if (!running || gameOver) return;

  paused = !paused;

  if (paused) {
    messageEl.innerHTML = `
      <div class="message-title">PAUSED</div>
      <div>PRESS SPACE TO CONTINUE</div>
    `;
    messageEl.classList.remove("hidden");
  } else {
    hideMessage();
  }
}

function setDirection(x, y) {
  if (!running || paused) return;

  // Prevent instant 180-degree turns.
  if (direction.x === -x && direction.y === -y) return;

  nextDirection = { x, y };
}

document.addEventListener("keydown", event => {
  const key = event.key.toLowerCase();

  if (["w", "a", "s", "d", " "].includes(key)) {
    event.preventDefault();
  }

  if (key === " " && (!running || gameOver)) {
    startGame();
    return;
  }

  if (key === " " && running) {
    togglePause();
    return;
  }

  if (key === "r") {
    startGame();
    return;
  }

  switch (key) {
    case "w":
      setDirection(0, -1);
      break;
    case "a":
      setDirection(-1, 0);
      break;
    case "s":
      setDirection(0, 1);
      break;
    case "d":
      setDirection(1, 0);
      break;
  }
});
