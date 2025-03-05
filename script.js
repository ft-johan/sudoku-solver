document.addEventListener("DOMContentLoaded", () => {
    createBoard();
    document.getElementById("solve-button").addEventListener("click", solveSudokuUI);
    document.getElementById("clear-button").addEventListener("click", clearBoard);
});

// Example Sudoku puzzle (0 = empty)
let examplePuzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

function createBoard() {
    let board = document.getElementById("sudoku-board");
    board.innerHTML = ""; // Clear previous grid

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            let input = document.createElement("input");
            input.type = "text";
            input.classList.add("cell");
            input.id = `cell-${row}-${col}`;
            input.maxLength = 1;

            // Prefill the board
            if (examplePuzzle[row][col] !== 0) {
                input.value = examplePuzzle[row][col];
                input.readOnly = true;
                input.style.backgroundColor = "#ddd"; // Gray out pre-filled cells
            }

            // Allow only numbers 1-9
            input.addEventListener("input", (e) => {
                let val = e.target.value;
                if (!/^[1-9]?$/.test(val)) e.target.value = ""; // Clear invalid input
            });

            board.appendChild(input);
        }
    }
}

function getBoardFromUI() {
    let board = [];
    for (let row = 0; row < 9; row++) {
        let rowArr = [];
        for (let col = 0; col < 9; col++) {
            let value = document.getElementById(`cell-${row}-${col}`).value;
            rowArr.push(value ? parseInt(value) : 0);
        }
        board.push(rowArr);
    }
    return board;
}

function updateUIWithBoard(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            let cell = document.getElementById(`cell-${row}-${col}`);
            if (!cell.readOnly) { // Do not overwrite prefilled values
                cell.value = board[row][col] || "";
            }
        }
    }
}

function solveSudokuUI() {
    let board = getBoardFromUI();
    if (solveSudoku(board)) {
        updateUIWithBoard(board);
    } else {
        alert("No solution exists!");
    }
}

function clearBoard() {
    examplePuzzle = Array(9).fill(0).map(() => Array(9).fill(0)); // Reset puzzle
    createBoard();
}

// --- Sudoku Solver (Backtracking) ---
function solveSudoku(board) {
    if (solve(board)) return board;
    return null;
}

function solve(board) {
    let [row, col] = findEmptyCell(board);
    if (row === -1) return true;

    for (let num = 1; num <= 9; num++) {
        if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board)) return true;
            board[row][col] = 0; // Backtrack
        }
    }
    return false;
}

function findEmptyCell(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) return [row, col];
        }
    }
    return [-1, -1];
}

function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) return false;
    }
    
    let boxRow = Math.floor(row / 3) * 3;
    let boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[boxRow + i][boxCol + j] === num) return false;
        }
    }
    return true;
}
