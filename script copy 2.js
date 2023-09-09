const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const muteAllButton = document.getElementById("mute-buttons");
const muteToggleButton = document.getElementById("sun");
const backgroundMusic = document.getElementById("background-music");
const cellElements = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const winningMessageElement = document.getElementById("winningMessage");

const userOrComputerElement = document.getElementById("userOrComputer");
const userVsComButton = document.getElementById("userVsCom");
const userVsUserButton = document.getElementById("userVsUser");
const mainMenuButtonClick = document.getElementById("mainMenuButton");
const restartButton = document.getElementById("restartButton");
const winningMessageTextElement = document.querySelector(
  "[data-winning-message-text]"
);
let circleTurn = false;
let computerMode = false;
let isSoundMuted = false;

restartButton.addEventListener("click", restartGame);
userOrComputerElement.classList.add("show");
userVsComButton.addEventListener("click", userVsCom);
userVsUserButton.addEventListener("click", userVsUser);
mainMenuButtonClick.addEventListener("click", mainMenu);
muteAllButton.addEventListener("click", toggleSound);

muteToggleButton.addEventListener("click", () => {
  backgroundMusic.muted = !backgroundMusic.muted;
});

function toggleSound() {
  isSoundMuted = !isSoundMuted;

  // Toggle individual sounds
  const oTurnSound = document.getElementById("o-turn-sound");
  const xTurnSound = document.getElementById("x-turn-sound");
  const clickSound = document.getElementById("click-sound");

  oTurnSound.muted = isSoundMuted;
  xTurnSound.muted = isSoundMuted;
  clickSound.muted = isSoundMuted;

  muteAllButton.innerHTML = isSoundMuted ? "🔇" : "🔊";
}

function playBackgroundMusic() {
  backgroundMusic.play();
}

function userVsCom() {
  const buttonSound = document.getElementById("click-sound");
  buttonSound.pause();
  buttonSound.currentTime = 0;
  buttonSound.play();
  computerMode = true;
  userOrComputerElement.classList.remove("show");
  startUserVsComGame();
}

function isValidMove(cell) {
  return (
    !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS)
  );
}

function userVsUser() {
  const buttonSound = document.getElementById("click-sound");
  buttonSound.pause();
  buttonSound.currentTime = 0;
  buttonSound.play();
  computerMode = false;
  userOrComputerElement.classList.remove("show");
  startGame();
}

function restartGame() {
  if (computerMode) {
    startUserVsComGame();
  } else {
    startGame();
  }

  const restartSound = document.getElementById("click-sound");
  restartSound.pause();
  restartSound.currentTime = 0;
  restartSound.play();
}

function mainMenu() {
  const menuSound = document.getElementById("click-sound");
  menuSound.pause();
  menuSound.currentTime = 0;
  menuSound.play();

  // When the sound ends, reload the page
  menuSound.addEventListener("ended", () => {
    location.reload();
  });
}

function startUserVsComGame() {
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove("show");
  if (computerMode && circleTurn) {
    setTimeout(computerMove, 500);
  }
}

function startGame() {
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove("show");
}

function handleClick(e) {
  const cell = e.target;
  if (!isValidMove(cell)) return;
  console.log(e.target.id);

  let myindex = parseInt(e.target.id[e.target.id.length - 1]);

  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  placeMark(cell, currentClass);

  // Play the appropriate turn sound
  if (currentClass === CIRCLE_CLASS) {
    // It's O's turn, play O's turn sound
    const oTurnSound = document.getElementById("o-turn-sound");
    oTurnSound.pause();
    oTurnSound.currentTime = 0;
    oTurnSound.play();
    matrix[myindex] = "O";
  } else {
    // It's X's turn, play X's turn sound
    const xTurnSound = document.getElementById("x-turn-sound");
    xTurnSound.pause();
    xTurnSound.currentTime = 0;
    xTurnSound.play();
    matrix[myindex] = "X";
  }
  console.log(matrix);
  if (checkWin(currentClass)) {
    endGame(false);
    return;
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
    if (computerMode && circleTurn) {
      setTimeout(computerMove, 500);
    }
  }
}

const matrix = ["", "", "", "", "", "", "", "", ""];
// 1
function computerMove() {
  let blocking = check4moves();

  const emptyCells = [...cellElements].filter(
    (cell) =>
      !cell.classList.contains(X_CLASS) &&
      !cell.classList.contains(CIRCLE_CLASS)
  );
  if (emptyCells.length === 0) return;

  // let myindex = parseInt(event.target.id[event.target.id.length - 1]);

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const randomCell = emptyCells[randomIndex];

  // Play the computer's turn sound
  const computerTurnSound = document.getElementById("o-turn-sound");
  computerTurnSound.pause();
  computerTurnSound.currentTime = 0;
  computerTurnSound.play();

  // matrix[myindex] = "O";

  placeMark(randomCell, CIRCLE_CLASS);
  if (checkWin(CIRCLE_CLASS)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
  }
}

// 1
function check4moves() {
  // WINNING_COMBINATIONS[0].filter((x) => matrix[x] == "X").length == 2;
  // WINNING_COMBINATIONS[0].filter((x) => matrix[x] == "").length == 1;
  let once = true;
  let cell_to_block = undefined;

  // let myindex = parseInt(matrix.id[matrix.id.length - 1]);

  WINNING_COMBINATIONS.forEach((arr) => {
    if (
      arr.filter((x) => matrix[x] == "X").length == 2 &&
      arr.filter((x) => matrix[x] == "").length == 1 &&
      once
    ) {
      cell_to_block = document.getElementById("cell" + x);
      // matrix[x] = console.log(cellToblock);

      once = false;
    }
  });
  return cell_to_block;
}

function endGame(draw) {
  if (draw) {
    const drawCell = "draw-cell";
    cellElements.forEach((cell) => {
      cell.classList.add(drawCell);
    });
    winningMessageTextElement.innerText = "Draw!";
    setTimeout(() => {
      cellElements.forEach((cell) => {
        cell.classList.remove(drawCell);
      });
    }, 1000);
  } else {
    winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`;
  }

  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  const winningCellClass = circleTurn ? "winning-cell-o" : "winning-cell-x";

  // מוצא את הקומבינציה המנצחת
  const winningCombination = WINNING_COMBINATIONS.find((combinations) => {
    return combinations.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });

  // משנה את המחלקות של התאים בקומבינציה המנצחת
  if (winningCombination) {
    winningCombination.forEach((index) => {
      cellElements[index].classList.add(winningCellClass);
    });
  }

  // השהיית הצגת ההודעה על הניצחון בזמן שהסגנון משתנה
  setTimeout(() => {
    // הסר את הסגנון של התאים בקומבינציה המנצחת
    if (winningCombination) {
      winningCombination.forEach((index) => {
        cellElements[index].classList.remove(winningCellClass);
      });
    }
    winningMessageElement.classList.add("show");
  }, 1500);
}

function isDraw() {
  return [...cellElements].every((cell) => {
    return (
      cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    );
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  circleTurn = !circleTurn;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some((combinations) => {
    return combinations.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

startGame();

playBackgroundMusic();
