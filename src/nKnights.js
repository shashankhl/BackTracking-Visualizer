
import { colorFields } from "./nQueens";

const knightBoard = document.querySelector("#knight-board");
const solvedBoards = document.querySelector("#knight-solved-boards");
const submitNum = document.querySelector("#submit-knight-range");
const noOfKnights = document.querySelector("#no-of-knights");
const stopExecution = document.querySelector("#stop-knight-execution");
const result = document.querySelector("#knight-result h3");
const solveSpeed = document.querySelector("#knight-speed");


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

    await nKnights();

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

})


export default async function nKnights() {

    if (board.length > 0) {

        if (count == 0) {
          
            count = 1;

            await solveForNKnights(board, 0, 0, board.length);
            
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
            knightBoard.append(div);

            colorFields(div, i, j);
        }
    }
    knightBoard.style = `display: grid; grid-template: repeat(4, 1fr) / repeat(4, 1fr)`;
    board = newBoard;
}

async function createKnightBoard(value) {

    return new Promise((resolve) => {

        const newBoard = [];
        knightBoard.textContent = "";
    
        for (let i = 0; i < value; i++) {

            newBoard[i] = [];
    
            for (let j = 0; j < value; j++) {

                const div = document.createElement("div");
                newBoard[i][j] = div;
                knightBoard.append(div);
            
                colorFields(div, i, j);

            }
        }
    
        knightBoard.style = `display: grid; grid-template: repeat(${value}, 1fr) / repeat(${value}, 1fr)`;
        
        board = newBoard; // Update the global board variable

        resolve(board);

      });

}

function createBoard() {

    const pickerValue = document.querySelector("#knight-number-value");

    noOfKnights.addEventListener("change", async function (event) {


        if (!isSolving) {

            const value = event.target.value;
            pickerValue.textContent = "Value: " + value;
            if (board) {
                // Remove the previous board before creating a new one
                knightBoard.textContent = "";
            }
            
            board = await createKnightBoard(value);            
        
        }
        
      });

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function solveForNKnights(board, row, col, target) {

    if (!stopEx) {
        if (target == 0) {
            appendBoard(board);
            combinations += 1;
            
            result.textContent = "Total: " + combinations;

            return;
        }

        if (row == board.length-1 && col == board.length) {
            return;
        }

        if (row == board.length) {
            return;
        }
    
        if (col == board[row].length) {
            await solveForNKnights(board, row + 1, 0, target);
            return;
        }

        await sleep(value1);    

        board[row][col].textContent = "\u265E";
        board[row][col].style.color = "rgba(255, 0, 0, 0.6)";
        
        await sleep(value2);   
        board[row][col].textContent = "";

        if (isSafe(board, row, col)) {

            board[row][col].style.color = "green";
            board[row][col].textContent = "\u265E";
            
            await sleep(value1);
            
            await solveForNKnights(board, row, col + 1, target - 1);

            await sleep(value2);  
            
            board[row][col].textContent = "";
        } 


        
        await solveForNKnights(board, row, col + 1, target);


    }

    

}

function appendBoard(board) {
    
    const solvedBoards = document.querySelector("#knight-solved-boards");
    const boardDiv = document.createElement("div");
    boardDiv.id = "solved-board-div";

    for (let i = 0; i < board.length; i++) {

    
        for (let j = 0; j < board[i].length; j++) {

            const div = document.createElement("div");
                        
            if (board[i][j].style.backgroundColor) {
                div.style.backgroundColor = board[i][j].style.backgroundColor;
            }

            if (board[i][j].textContent == "\u265E") {
                div.textContent = "\u265E";
            } else {
                div.textContent = "";
            }
            boardDiv.append(div);
        }
    }
    boardDiv.style = `display: grid; grid-template: repeat(${board.length}, 1fr) / repeat(${board[0].length}, 1fr); margin-top: 1em`;
    
    solvedBoards.append(boardDiv);


} 

function isValid(board, row, col) {

    if (row >= 0 && row <= board.length-1 && col >= 0 && col <= board[row].length-1) {
        return true;
    }
    return false;

}

function isSafe(board, row, col) {

    if (isValid(board, row - 2, col - 1)) {
        if (board[row - 2][col - 1].textContent == "\u265E") {
            return false;
        }
    }
    if (isValid(board, row - 1, col - 2)) {
        if (board[row - 1][col - 2].textContent  == "\u265E") {
            return false;
        }
    }
    if (isValid(board, row - 2, col + 1)) {
        if (board[row - 2][col + 1].textContent  == "\u265E") {
            return false;
        }
    }
    if (isValid(board, row - 1, col + 2)) {
        if (board[row - 1][col + 2].textContent  == "\u265E") {
            return false;
        }
    }
    if (isValid(board, row + 2, col - 1)) {
        if (board[row + 2][col - 1].textContent  == "\u265E") {
            return false;
        }
    }
    if (isValid(board, row + 1, col - 2)) {
        if (board[row + 1][col - 2].textContent  == "\u265E") {
            return false;
        }
    }
    if (isValid(board, row + 2, col + 1)) {
        if (board[row + 2][col + 1].textContent  == "\u265E") {
            return false;
        }
    }
    if (isValid(board, row + 1, col + 2)) {
        if (board[row + 1][col + 2].textContent  == "\u265E") {
            return false;
        }
    }
    


    return true;


}
