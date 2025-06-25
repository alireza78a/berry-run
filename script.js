const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

let score = 0;
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
let playerName = prompt("Enter your name:") || "Berry";
let playerX = 50;
let playerY = 300;
let playerWidth = 50;
let playerHeight = 50;
let velocityY = 0;
let gravity = 1;
let isJumping = false;

const berryImg = new Image();
berryImg.src = "berry.png";

const coins = [];
const obstacles = [];

const coinSound = new Audio("coin.mp3");
const gameOverSound = new Audio("gameover.mp3");
const bgMusic = new Audio("bgmusic.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.4;
bgMusic.play();

function spawnCoin() {
  const x = canvas.width;
  const y = 300;
  coins.push({ x, y, width: 20, height: 20 });
}

function spawnObstacle() {
  const x = canvas.width;
  obstacles.push({ x, y: 320, width: 20, height: 60 });
}

function update() {
  velocityY += gravity;
  playerY += velocityY;

  if (playerY > 300) {
    playerY = 300;
    velocityY = 0;
    isJumping = false;
  }

  for (let i = coins.length - 1; i >= 0; i--) {
    coins[i].x -= 5;
    if (
      playerX < coins[i].x + coins[i].width &&
      playerX + playerWidth > coins[i].x &&
      playerY < coins[i].y + coins[i].height &&
      playerY + playerHeight > coins[i].y
    ) {
      coins.splice(i, 1);
      score++;
      coinSound.play();
    }
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= 6;
    if (
      playerX < obstacles[i].x + obstacles[i].width &&
      playerX + playerWidth > obstacles[i].x &&
      playerY < obstacles[i].y + obstacles[i].height &&
      playerY + playerHeight > obstacles[i].y
    ) {
      gameOver();
      return;
    }
  }

  draw();
  scoreDisplay.textContent = `Score: ${score}`;
  requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(berryImg, playerX, playerY, playerWidth, playerHeight);

  for (const coin of coins) {
    ctx.beginPath();
    ctx.arc(coin.x, coin.y + 10, 10, 0, Math.PI * 2);
    ctx.fillStyle = "gold";
    ctx.fill();
    ctx.closePath();
  }

  for (const obs of obstacles) {
    ctx.fillStyle = "red";
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  }
}

function gameOver() {
  gameOverSound.play();
  bgMusic.pause();
  alert("Game Over!\nScore: " + score);
  highScores.push({ name: playerName, score });
  highScores.sort((a, b) => b.score - a.score);
  highScores = highScores.slice(0, 5);
  localStorage.setItem("highScores", JSON.stringify(highScores));
  displayLeaderboard();
  location.reload();
}

function displayLeaderboard() {
  let table = "\nLeaderboard:\n";
  highScores.forEach((entry, index) => {
    table += `${index + 1}. ${entry.name} - ${entry.score}\n`;
  });
  alert(table);
}

window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !isJumping) {
    velocityY = -15;
    isJumping = true;
  }
});

setInterval(spawnCoin, 1500);
setInterval(spawnObstacle, 2500);
update();