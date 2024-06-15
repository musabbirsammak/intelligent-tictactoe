// board is an array of 9 elements representing 9 cells
// of a tic-tac-toe game. Initially, each index will contain
// numbers from 0 to 9 in them. It will later be changed to X or
// O depending on which player marks the cell.
let board;

// reference to all the 9 HTML cells.
const cells = document.querySelectorAll('.cell');

// human player will mark the cells as O and AI will mark them as X.
const humanPlayer = 'O';
const aiPlayer = 'X';

// list of winning combinations of a standard 3x3 tic-tac-toe game.
const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2],
]

// sets up a new board.
setupBoard();

/**
 * Setup a new tic-tac-toe board.
 */
function setupBoard() {
    document.querySelector("#result").style.display = "none";
    
    board = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', click, false);
    }
}

function click(square) {
    if (typeof board[square.target.id] === 'number') {
        let result = mark(square.target.id, humanPlayer);
        if (!result) {
            result = mark(bestMove(), aiPlayer);
        } 
        if (result) {
            gameOver(result);
        }
    } else {
        console.log("Already marked!");
    }
}

function mark(squareId, player) {
    board[squareId] = player;
    document.getElementById(squareId).innerText = player;
    return checkResult(board, player);
}

/**
 * Checks if the player has won the game or not.
 * 
 * @param {Array} board - An array of 9 integers representing 9 cells.
 * @param {String} player - Player whose turn it is.
 * @returns {Object} Index and player if the player has won, null otherwise.
 */
function checkResult(board, player) {
    result = null;

    let plays = board.reduce((a, e, i) => (e === player)? a.concat(i): a, []);
    for (let [index, win] of winCombinations.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            result = {index: index, player: player};
            return result;
        }
    }

    if (emptySquares().length == 0) {
        result = {tie: true};
        return result;
    }
    
    return result;
}

function gameOver(result) {
    disableBoard();
    if (result.tie) {
        declareResult("The game is tied!");
    } else {
        declareResult(result.player === 'X'? 'AI has won!': 'You have won!');
        for (let index of winCombinations[result.index]) {
            document.getElementById(index).style.backgroundColor = (result.player == humanPlayer)? 'red':'blue';
        }
    }
}

function disableBoard() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].style.backgroundColor = 'gray';
        cells[i].removeEventListener('click', click, false);
    }
}

/**
 * Returns the cells that are emtpy or where the users have not put their
 * marks yet.
 * 
 * @returns {Array} Array of indices of empty cells.
 */
function emptySquares() {
    return board.filter(s => typeof s === 'number');
}

/**
 * Declares result of the game.
 * 
 * @param {string} result - Result of the game.
 */
function declareResult(result) {
    document.querySelector("#result").style.display = "block";
    document.querySelector("#result-text").innerText = result;
}

function bestMove() {
    return emptySquares()[0];
}