// Game variables
let playing = true;
let enemySpeed = 0.25;
let score = 100;
let level = 1;
let lives = 5;
let scoreDisplay = document.querySelector('.score');
let levelDisplay = document.querySelector('.level');
let livesDisplay = document.querySelector('.lives');
let modal = document.getElementById('modal');

// Reset all game stats upon restart
function resetStats() {
  score = 100;
  scoreDisplay.innerText = score;
  level = 1;
  levelDisplay.innerText = level;
  lives = 5;
  livesDisplay.innerText = lives;
  modal.style.display = "none";
  score = 100;
  playing = true;
  enemySpeed = 0.25;
  allEnemies = [...Array(3)].map((_, i) => new Enemy(0, i + 1, Math.random() * (1 - 0.5) + 0.5));
}

// Update game stats
function updateScore() {
  score += 100;
  scoreDisplay.innerText = score;
}

function levelUp() {
  level++;
  levelDisplay.innerText = level;
}

// Display modal when game over
function lostLife() {
  if (lives > 1) {
    lives--;
    livesDisplay.innerText = lives;
  } else {
    playing = false;
    lives--;
    livesDisplay.innerText = lives;
    modal.style.display = "block";
    modal.innerHTML = `<span>
                      <h2>Great play!</h2>
                      <p>Total Score: ${score}</p>
                      <p>Highest Level: ${level}</p>
                      <br />
                      <button onClick="resetStats()">Play New Game</button>
                      </span>`
  }
}

// Player class requires an update(), render() and a handleInput() method.
class Player {
  constructor() {
    this.sprite = 'images/char-boy.png';
    this.x = 2;
    this.y = 5;
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83);
  }

  update(dt) {
    this.boundaryY = this.y < 1;

    // Check to see if player has won
    if (this.boundaryY) {
      this.x = 2; // Move player back to starting point if won
      this.y = 5;
      enemySpeed = enemySpeed + 0.25; // Increase enemy speed
      allEnemies.push(new Enemy(0, Math.floor(Math.random() * (5 - 1) + 1), enemySpeed));
      updateScore();
      levelUp();
    }
  }

  handleInput(input) {
    switch(input) {
        case 'left':
          this.x = this.x > 0 ? this.x - 1 : this.x;
          break;
        case 'right':
          this.x = this.x < 4 ? this.x + 1 : this.x;
          break;
        case 'up':
          this.y = this.y > 0 ? this.y - 1 : this.y;
          break;
        case 'down':
          this.y = this.y < 5 ? this.y + 1 : this.y;
        default:
          break;
    }
  }
}

// Enemies our player must avoid
class Enemy {
  // The image/sprite for our enemies, this uses a helper we've provided to easily load images
  constructor(x, y, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed + Math.floor(Math.random() * enemySpeed);
  }

  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83);
  }

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  update(dt) {
    this.boundaryX = this.x > 5;

    if (this.boundaryX) {
      this.x = -1;
    } else {
      // Average speed = distance travelled (= change in x) / time travelled (= dt)
      // this.x = this.x + (dt)
      this.x += this.speed * dt;
    }
  }

  checkCollisions(player) {
    if (this.y === player.y) {
      if (this.x >= player.x - 0.5 && this.x <= player.x + 0.5) {
        lostLife();
        return true;
      }
    } else {
      return false;
    }
  }
}

// Now instantiate your objects
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [...Array(3)].map((_, i) => new Enemy(0, i + 1, Math.random() * (1 - 0.5) + 0.5));
const player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    if (playing === true) {
      player.handleInput(allowedKeys[e.keyCode]);
    }
});
