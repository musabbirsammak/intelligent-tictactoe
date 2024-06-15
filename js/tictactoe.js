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

/**
 * Handles click event on any cell in the board.
 * 
 * @param {int} square - Id of the clicked cell.
 */
function click(square) {
    if (typeof board[square.target.id] === 'number') {
        mark(square.target.id, humanPlayer);
        let best = bestMove();
        console.log(best);
        mark(bestMove(), aiPlayer);
    } else {
        console.log("Already marked!");
    }
}

/**
 * Mark a specific cell.
 * 
 * @param {int} squareId - Cell id to mark.
 * @param {string} player - Current player.
 */
function mark(squareId, player) {
    board[squareId] = player;
    document.getElementById(squareId).innerText = player;
    
    let won = hasWon(board, player);
    if (won) {
        gameOver(won);
        return;
    }

    if (isTied()) {
        disableBoard();
        declareResult("The game is tied!");
    }
}

/**
 * Checks if the player has won the game or not.
 * 
 * @param {Array} board - An array of 9 integers representing 9 cells.
 * @param {String} player - Player whose turn it is.
 * @returns {Object} Index and player if the player has won, null otherwise.
 */
function hasWon(board, player) {
    result = null;

    let plays = board.reduce((a, e, i) => (e === player)? a.concat(i): a, []);
    for (let [index, win] of winCombinations.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            result = {index: index, player: player};
            return result;
        }
    }

    return result;
}

/**
 * Checks whether the game is tied or not. Must be called after hasWon, because
 * it may happen that all the cells are marked and someone has won.
 * 
 * @param {Array} board - Array of cells.
 * @returns {boolean} true if the game is tied, false otherwise.
 */
function isTied(board) {
    if (emptySquares().length == 0) {
        return true;
    } else {
        return false;
    }
}

/**
 * Disables the board and marks the winning cells.
 * 
 * @param {Object} result - Result object with winning player.
 */
function gameOver(result) {
    disableBoard();

    declareResult(result.player === 'X'? 'AI has won!': 'You have won!');
    for (let index of winCombinations[result.index]) {
        document.getElementById(index).style.backgroundColor = (result.player == humanPlayer)? 'red':'blue';
    }
}

/**
 * Disables the whole after the match has been won or tied.
 */
function disableBoard() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].style.backgroundColor = 'gray';
        cells[i].removeEventListener('click', click, false);
    }
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

/**
 * Returns the cells that are emtpy or where the users have not put their
 * marks yet.
 * 
 * @returns {Array} Array of indices of empty cells.
 */
function emptySquares() {
    return board.filter(s => typeof s === 'number');
}

function bestMove() {
    return minimax(board, aiPlayer).index;
}

/**
 * Runs MiniMax algorithm to find the best move.
 * 
 * @param {Array} board - Board of Tic-Tac-Toe.
 * @param {String} player - Current player.
 * @returns {Object} Object with best move and respective score.
 */
function minimax(board, player) {
    let available = emptySquares();
    
    if (hasWon(board, humanPlayer)) {
        return {score: -10};
    } else if (hasWon(board, aiPlayer)) {
        return {score: 10};
    } else if (available.length === 0) {
        return {score: 0};
    }

    let moves = [];
    for (let i = 0; i < available.length; i++) {
        let move = {};
        move.index = board[available[i]];
        board[available[i]] = player;

        if (player == aiPlayer) {
            let result = minimax(board, humanPlayer);
            move.score = result.score;
        } else {
            let result = minimax(board, aiPlayer);
            move.score = result.score;
        }

        board[available[i]] = move.index;
        moves.push(move);
    }

    let bestMove = null;
    if (player === aiPlayer) {
        let bestScore = -1000000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestMove = i;
                bestScore = moves[i].score;
            }
        }
    } else {
        let bestScore = 1000000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestMove = i;
                bestScore = moves[i].score;
            }
        }
    }

    return moves[bestMove];
}