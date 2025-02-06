// Select cells and message
const cells = document.querySelectorAll('[data-cell]');
const messageElement = document.getElementById('message');
let isXTurn = true; // Track whose turn it is
let players = localStorage.getItem('players') || 2; // Get number of players
let difficulty = localStorage.getItem('difficulty') || 'easy'; // Get difficulty

// difficulty
document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        difficulty = e.target.value;
        localStorage.setItem('difficulty', difficulty);
    });
});

// Set the number of players and reset the game
function setPlayers(num) {
    players = num;
    localStorage.setItem('players', num);
    resetGame();
    document.querySelectorAll('.player-buttons button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`.player-buttons button:nth-child(${num})`).classList.add('active');
}

// Reset the game board
function resetGame() {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('marked');
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    messageElement.textContent = '';
    isXTurn = true;
    if (players == 1 && !isXTurn) {
        setTimeout(computerMove, 500);
    }
}

// Add click event listeners to cells
cells.forEach(cell => {
    cell.addEventListener('click', handleClick, { once: true });
});

// Handle cell click
function handleClick(e) {
    const cell = e.target;
    const currentClass = isXTurn ? 'X' : 'O';
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        messageElement.textContent = `${currentClass} wins!`;
        messageElement.style.top = 'auto';
        messageElement.style.bottom = '20px';
    } else if (isDraw()) {
        messageElement.textContent = 'Draw!';
        messageElement.style.top = 'auto';
        messageElement.style.bottom = '20px';
    } else {
        swapTurns();
        if (players === 1 && !isXTurn) {
            setTimeout(computerMove, 500);
        }
    }
}

// Place mark on the cell
function placeMark(cell, currentClass) {
    cell.textContent = currentClass;
    cell.classList.add('marked');
}

// Swap turns
function swapTurns() {
    isXTurn = !isXTurn;
}

// Check if the current player has won
function checkWin(currentClass) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].textContent === currentClass;
        });
    });
}

// Check if the game is a draw
function isDraw() {
    return [...cells].every(cell => {
        return cell.textContent === 'X' || cell.textContent === 'O';
    });
}

// Handle computer move
function computerMove() {
    const emptyCells = [...cells].filter(cell => cell.textContent === '');
    let randomCell;
    if (difficulty === 'easy') {
        randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } else if (difficulty === 'medium') {
        // medium difficulty logic
        randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } else if (difficulty === 'hard') {
        randomCell = getBestMove();
    }
    placeMark(randomCell, 'O');
    if (checkWin('O')) {
        messageElement.textContent = 'O wins!';
        messageElement.style.top = 'auto';
        messageElement.style.bottom = '20px';
    } else if (isDraw()) {
        messageElement.textContent = 'Draw!';
        messageElement.style.top = 'auto';
        messageElement.style.bottom = '20px';
    } else {
        swapTurns();
    }
}

// move for the computer minimax algorithm
function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].textContent === '') {
            cells[i].textContent = 'O';
            let score = minimax(cells, 0, false);
            cells[i].textContent = '';
            if (score > bestScore) {
                bestScore = score;
                move = cells[i];
            }
        }
    }
    return move;
}

// Minimax algorithm to determine move
function minimax(cells, depth, isMaximizing) {
    if (checkWin('O')) {
        return 1;
    } else if (checkWin('X')) {
        return -1;
    } else if (isDraw()) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].textContent === '') {
                cells[i].textContent = 'O';
                let score = minimax(cells, depth + 1, false);
                cells[i].textContent = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].textContent === '') {
                cells[i].textContent = 'X';
                let score = minimax(cells, depth + 1, true);
                cells[i].textContent = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// saved settings on page load
document.addEventListener('DOMContentLoaded', () => {
    setPlayers(players);
    document.getElementById(difficulty).checked = true;
});
