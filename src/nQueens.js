
const queenBoard = document.querySelector("#queen-board");
const solvedBoards = document.querySelector("#solved-boards");
const submitNum = document.querySelector("#submit-queen-range");
const noOfQueens = document.querySelector("#no-of-queens");
const stopExecution = document.querySelector(".n-queens-container #stop-execution");
const result = document.querySelector("#result h3");
const solveSpeed = document.querySelector("#queen-speed");


let stopEx = false;
let combinations = 0;
let count = 0;

let board;

let isSolving = false;

submitNum.addEventListener("click", async function() {
    result.textContent = "Total: ";
    combinations = 0;
    isSolving = true;
    solvedBoards.textContent = "";
    submitNum.disabled = true;

    await nQueens();

    submitNum.disabled = false;
    stopEx = false;
    isSolving = false;
});

stopExecution.addEventListener("click", function() {

    stopEx = true;

});


if (!isSolving) {
    createDefaultBoard();
    createBoard();
}

let value1 = 200;
let value2 = 500;

solveSpeed.addEventListener("change", function(event) {

    switch(event.target.value) {
        case "Slow":
            value1 = 500;
            value2 = 1000;
            break;
        case "Medium":
            value1 = 100;
            value2 = 200;
            break;
        case "Fast":
            value1 = 0;
            value2 = 0;
            break;
    }

});


async function nQueens() {

    if (board.length > 0) {

        if (count == 0) {
          
            count = 1;

            await solveForNQueens(board, 0);
            
            count = 0;
        }
    
    }

}

function createDefaultBoard() {
    const newBoard = [];

    for (let i = 0; i < 4; i++) {

        newBoard[i] = [];

        for (let j = 0; j < 4; j++) {

            const div = document.createElement("div");
            newBoard[i][j] = div;
            queenBoard.append(div);

            colorFields(div, i, j);
        }
    }
    queenBoard.style = `display: grid; grid-template: repeat(4, 1fr) / repeat(4, 1fr)`;
    board = newBoard;
}

function colorFields(div, i, j) {

    if (i % 2 === 0) {

        if (j % 2 !== 0) {
            div.style.backgroundColor = "rgba(135,50,0,.5)";
        }

    } else {

        if (j % 2 === 0) {
            div.style.backgroundColor = "rgba(135,50,0,.5)";
        }

    }

}

async function createQueenBoard(value) {

    return new Promise((resolve) => {

        const newBoard = [];
        queenBoard.textContent = "";
    
        for (let i = 0; i < value; i++) {

            newBoard[i] = [];
    
            for (let j = 0; j < value; j++) {

                const div = document.createElement("div");
                newBoard[i][j] = div;
                queenBoard.append(div);

                colorFields(div, i, j);
                
            
            }
        }
    
        queenBoard.style = `display: grid; grid-template: repeat(${value}, 1fr) / repeat(${value}, 1fr)`;
        
        board = newBoard; // Update the global board variable

        resolve(board);

      });

}

function createBoard() {

    const pickerValue = document.querySelector("#number-value");

    noOfQueens.addEventListener("change", async function (event) {


        if (!isSolving) {

            const value = event.target.value;
            pickerValue.textContent = "Value: " + value;
            if (board) {
                // Remove the previous board before creating a new one
                queenBoard.textContent = "";
            }
            
            board = await createQueenBoard(value);            
        
        }
        
      });

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function solveForNQueens(board, row) {

    if (!stopEx) {
        if (row == board.length) {
            appendBoard(board);
            combinations += 1;
            
            result.textContent = "Total: " + combinations;

            return;
        }
    
        for (let col = 0; col < board.length; col++) {

            await sleep(value1);    

            board[row][col].textContent = "\u2655";
            board[row][col].style.color = "rgba(255, 0, 0, 0.6)";
            
            await sleep(value2);      
            
            board[row][col].textContent = "";  
    
            if (isSafe(board, row, col)) {
            
                board[row][col].style.color = "green";
                board[row][col].textContent = "\u2655";
                await sleep(value1);
                await solveForNQueens(board, row + 1);
                await sleep(value2);  
                board[row][col].textContent = "";   
    
            }
    
        }
    
    }

    

}

function appendBoard(board) {
    
    const solvedBoards = document.querySelector("#solved-boards");
    const boardDiv = document.createElement("div");
    boardDiv.id = "solved-board-div";

    for (let i = 0; i < board.length; i++) {

    
        for (let j = 0; j < board[i].length; j++) {

            const div = document.createElement("div");
            
            if (board[i][j].style.backgroundColor) {
                div.style.backgroundColor = board[i][j].style.backgroundColor;
            }


            if (board[i][j].textContent == "\u2655") {
                div.textContent = "\u2655";
            } else {
                div.textContent = "";
            }
            boardDiv.append(div);
        }
    }
    boardDiv.style = `display: grid; grid-template: repeat(${board.length}, 1fr) / repeat(${board[0].length}, 1fr); margin-top: 1em`;
    
    solvedBoards.append(boardDiv);


} 

function isSafe(board, row, col) {


    // check vertical
    for (let r = 0; r < board.length; r++) {
        if (board[r][col].textContent == "\u2655") {
            return false;
        }
    }

    // check right diagonal

    const rightEnd = Math.min(row, board.length - col - 1);
    for (let d = 1; d <= rightEnd; d++) {
        if (board[row-d][col+d].textContent == "\u2655") {
            return false;
        }
    }

    // check left diagonal
    const leftEnd = Math.min(row, col);
    for (let d = 1; d <= leftEnd; d++) {
        if (board[row-d][col-d].textContent == "\u2655") {
            return false;
        }
    }

    return true;


}

export { nQueens, colorFields };
