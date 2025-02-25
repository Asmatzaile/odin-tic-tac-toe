const displayController = (() => {
    const boardDiv = document.querySelector("#board");
    const gameoverDialog = document.querySelector('#gameover-dialog');
    const dialogSpan = gameoverDialog.querySelector('span');
    gameoverDialog.querySelector('button').onclick = () => {
        gameoverDialog.close();
        game.restart();
    }

    const renderBoard = () => {
        const board = gameboard.getBoard();
        const newChildren = board.map((cell, index) => {
            let cellEl;
            if (cell === undefined) {
                cellEl = document.createElement("button");
                cellEl.onclick = () => game.playTurn(index);
            } else {
                cellEl = document.createElement("div");
                cellEl.textContent = cell;
            }
            return cellEl;
        })
        boardDiv.replaceChildren(...newChildren);
    }

    const showDialog = (message) => {
        dialogSpan.textContent = message;
        gameoverDialog.showModal();
    }

    return { renderBoard, showDialog };
})();

const gameboard = (() => {
    const board = new Array(9);
    const getBoard = () => [...board];
    const placeToken = (token, index) => {
        board[index] = token;
        return getBoard();
    }
    const reset = () => board.fill(undefined);
    return { getBoard, placeToken, reset }
})();

const createPlayer = (name, token) => {
    const placeToken = index => gameboard.placeToken(token, index);
    return { name, placeToken }
};

const game = (() => {
    const players = [
        createPlayer("P1", "X"),
        createPlayer("P2", "O")
    ];

    let currentTurn;
    const restart = () => {
        currentTurn = 0;
        gameboard.reset();
        displayController.renderBoard();
    }
    
    const getCurrentPlayer = () => players[currentTurn];
    const advanceTurn = () => currentTurn = (currentTurn + 1) % 2;

    const winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
        [0, 4, 8], [2, 4, 6] // diagonal
    ]
    const checkWin = () => {
        const board = gameboard.getBoard();
        return winCombos.find(combo => {
            const comboCells = combo.map(index => board[index]);
            return utils.allEqual(comboCells) && !comboCells.includes(undefined);
        }) !== undefined;
    }

    const endGame = (winnerName) => {
        const message = `Game over! ${winnerName ? `${winnerName} wins.` : "You tied."}`;
        displayController.showDialog(message);
    }

    const playTurn = index => {
        const currentPlayer = getCurrentPlayer();
        const board = currentPlayer.placeToken(index);
        displayController.renderBoard();
        const win = checkWin();
        if (win) return endGame(currentPlayer.name);
        if (!board.includes(undefined)) return endGame();
        advanceTurn();
    };

    restart();
    return { playTurn, restart };
})();

const utils = (()=> {
    const allEqual = arr => arr.every(el => el === arr[0]);
    return { allEqual };
})();
