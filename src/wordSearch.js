const searchBoard = document.querySelector("#search-board");
const searchForWord = document.querySelector("#find-word");
const wordToFind = document.querySelector("#word-to-find");
const generateBoard = document.querySelector("#generate-word-board");
const searchSpeed = document.querySelector("#search-speed");
const stopExecution = document.querySelector("#stop-search-execution");

let value = 300;
let hasFinished = true;
let stop = false;

let board = [];

searchSpeed.addEventListener("change", function (event) {
  switch (event.target.value) {
    case "Slow":
      value = 300;
      break;
    case "Medium":
      value = 150;
      break;
    case "Fast":
      value = 0;
      break;
  }
});

stopExecution.addEventListener("click", function () {
  stop = true;
});

wordSearch();

export default function wordSearch() {
  displayBoard();

  generateBoard.addEventListener("click", function () {
    if (hasFinished) {
      searchBoard.textContent = "";
      displayBoard();
    }
  });

  if (board) {
    searchForWord.addEventListener("click", async function () {
      clearColors();
      if (wordToFind.value != "") {
        hasFinished = false;
        const found = await findStartAndEnd(board);
        stop = false;
        hasFinished = true;
      }
    });
  }
}

function clearColors() {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      board[r][c].style.backgroundColor = "white";
    }
  }
}

async function findStartAndEnd(board) {
  const word = wordToFind.value.toUpperCase();

  const ch = word.charAt(0);

  let visited = [];

  for (let i = 0; i < board.length; i++) {
    visited[i] = [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ];
  }

  if (!stop) {
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        if (board[r][c].textContent === ch) {
          const found = await findWord(board, visited, word, r, c, 0);

          if (found) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function findWord(board, visited, word, r, c, idx) {
  if (!stop) {
    if (idx === word.length) {
      return true;
    }

    if (r < 0 || c < 0) {
      return false;
    }

    if (r > board.length - 1 || c > board[r].length - 1) {
      return false;
    }
    if (word.charAt(idx) === board[r][c].textContent) {
      await sleep(value);
      board[r][c].style.backgroundColor = "rgba(0, 255, 0, 0.6)";
    }

    if (word.charAt(idx) !== board[r][c].textContent) {
      if (board[r][c].style.backgroundColor !== "rgba(0, 255, 0, 0.6)") {
        await sleep(value);
        board[r][c].style.backgroundColor = "red";
      }
      return false;
    }

    if (visited[r][c]) {
      return false;
    }

    visited[r][c] = true;

    await sleep(value);

    let isWord =
      (await findWord(board, visited, word, r + 1, c, idx + 1)) ||
      (await findWord(board, visited, word, r - 1, c, idx + 1)) ||
      (await findWord(board, visited, word, r, c + 1, idx + 1)) ||
      (await findWord(board, visited, word, r, c - 1, idx + 1));

    await sleep(value);

    visited[r][c] = false;

    return isWord;
  }
}

function displayBoard() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let r = 0; r < 12; r++) {
    board[r] = [];
    for (let c = 0; c < 12; c++) {
      const index = Math.floor(Math.random() * characters.length);
      const div = document.createElement("div");
      board[r][c] = div;
      div.textContent = characters[index];
      searchBoard.append(div);
    }
  }
}
