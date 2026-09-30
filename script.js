let board = ["", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let gameMode = "friends";

let scoreX = 0;
let scoreO = 0;
let draws = 0;

const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const newGameButton = document.getElementById("newGame");
const scoreXText = document.getElementById("scoreX");
const scoreOText = document.getElementById("scoreO");
const drawScoreText = document.getElementById("drawScore");
const gameModeText = document.getElementById("gameModeText");
const playerOLabel = document.getElementById("playerOLabel");

const winningPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

function startGame(mode) {
    gameMode = mode;

    document.getElementById("modeScreen").classList.add("hidden");
    document.getElementById("gameScreen").classList.remove("hidden");

    if (mode === "robot") {
        gameModeText.textContent = "🤖 Play with Robot";
        playerOLabel.textContent = "Robot O";
    } else {
        gameModeText.textContent = "👥 Play with Friends";
        playerOLabel.textContent = "Player O";
    }

    startNewGame();
}

function goBack() {
    document.getElementById("gameScreen").classList.add("hidden");
    document.getElementById("modeScreen").classList.remove("hidden");
}

cells.forEach(function(cell) {
    cell.addEventListener("click", function() {
        const index = Number(cell.getAttribute("data-index"));

        if (gameMode === "robot" && currentPlayer === "O") {
            return;
        }

        makeMove(index);
    });
});

function makeMove(index) {
    if (board[index] !== "" || !gameActive) {
        return;
    }

    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    cells[index].classList.add(currentPlayer.toLowerCase());

    checkWinner();

    if (gameActive && gameMode === "robot" && currentPlayer === "O") {
        setTimeout(robotMove, 500);
    }
}

function checkWinner() {
    for (let pattern of winningPatterns) {
        const [a,b,c] = pattern;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {
            gameActive = false;

            cells[a].classList.add("winner");
            cells[b].classList.add("winner");
            cells[c].classList.add("winner");

            if (currentPlayer === "X") {
                scoreX++;
                scoreXText.textContent = scoreX;
            } else {
                scoreO++;
                scoreOText.textContent = scoreO;
            }

            statusText.textContent =
                "🎉 " + (currentPlayer === "O" && gameMode === "robot"
                    ? "Robot Wins!"
                    : "Player " + currentPlayer + " Wins!");

            return;
        }
    }

    if (!board.includes("")) {
        gameActive = false;
        draws++;
        drawScoreText.textContent = draws;
        statusText.textContent = "🤝 It's a Draw!";
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    if (gameMode === "robot" && currentPlayer === "O") {
        statusText.textContent = "🤖 Robot's Turn";
    } else {
        statusText.textContent = "Player " + currentPlayer + "'s Turn";
    }
}

function robotMove() {
    if (!gameActive || gameMode !== "robot" || currentPlayer !== "O") {
        return;
    }

    const emptyCells = [];

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            emptyCells.push(i);
        }
    }

    if (emptyCells.length === 0) {
        return;
    }

    // First try to win
    for (let index of emptyCells) {
        board[index] = "O";
        if (hasWinner("O")) {
            board[index] = "";
            makeMove(index);
            return;
        }
        board[index] = "";
    }

    // Then block Player X
    for (let index of emptyCells) {
        board[index] = "X";
        if (hasWinner("X")) {
            board[index] = "";
            makeMove(index);
            return;
        }
        board[index] = "";
    }

    // Prefer center
    if (board[4] === "") {
        makeMove(4);
        return;
    }

    // Otherwise choose randomly
    const randomIndex =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

    makeMove(randomIndex);
}

function hasWinner(player) {
    return winningPatterns.some(function(pattern) {
        const [a,b,c] = pattern;
        return board[a] === player &&
               board[b] === player &&
               board[c] === player;
    });
}

function startNewGame() {
    board = ["", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;

    cells.forEach(function(cell) {
        cell.textContent = "";
        cell.classList.remove("x", "o", "winner");
    });

    statusText.textContent = "Player X's Turn";
}

newGameButton.addEventListener("click", startNewGame);
