const setupDisplayController = (() => {
    const setupDialogEl = document.querySelector('#setup-dialog');
    const p1NameInput = setupDialogEl.querySelector('#p1-name');
    const p2NameInput = setupDialogEl.querySelector('#p2-name');
    setupDialogEl.querySelector('button').onclick = () => {
        const p1Name = p1NameInput.value;
        const p2Name = p2NameInput.value;
        game.setupPlayers(p1Name, p2Name);
    }
    const show = () => setupDialogEl.showModal();
    return { show }
})();

const gameoverDisplayController = (() => {
    const gameoverDialogEl = document.querySelector('#gameover-dialog');
    const span = gameoverDialogEl.querySelector('span');
    const show = (message) => {
        span.textContent = message;
        gameoverDialogEl.showModal();

    };
    gameoverDialogEl.querySelector('button').onclick = () => {
        gameoverDialogEl.close();
        game.restart();
    }
    return { show }
})();

const boardDisplayController = (() => {
    const boardDiv = document.querySelector("#board");
    const render = () => {
        const board = gameboard.getBoard();
        const newChildren = board.map((cell, index) => createCellEl(cell, index))
        boardDiv.replaceChildren(...newChildren);
    }
    const createCellEl = (cell, index) => {
        let cellEl;
        if (cell === undefined) {
            cellEl = document.createElement("button");
            cellEl.onclick = () => game.playTurn(index);
        } else {
            cellEl = document.createElement("div");
            cellEl.textContent = cell;
        }
        return cellEl;
    }
    return { render }
})();

const gameboard = (() => {
    const board = new Array(9);
    const getBoard = () => [...board];
    const onBoardModified = () => {
        boardDisplayController.render();
    }
    const placeToken = (token, index) => {
        board[index] = token;
        onBoardModified();
        return getBoard();
    }
    const reset = () => {
        board.fill(undefined);
        onBoardModified();
    }
    return { getBoard, placeToken, reset }
})();

const createPlayer = (name, token) => {
    const placeToken = index => gameboard.placeToken(token, index);
    return { name, placeToken }
};

const game = (() => {
    let players;
    const setupPlayers = (p1Name, p2Name) => players = createPlayers(p1Name, p2Name);
    const createPlayers = (p1Name="P1", p2Name="P2") => [
        createPlayer(p1Name, "X"),
        createPlayer(p2Name, "O")
    ]

    let currentTurn;
    const restart = () => {
        currentTurn = 0;
        gameboard.reset();
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
        gameoverDisplayController.show(message);
    }

    const playTurn = index => {
        const currentPlayer = getCurrentPlayer();
        const board = currentPlayer.placeToken(index);
        const win = checkWin();
        if (win) return endGame(currentPlayer.name);
        if (!board.includes(undefined)) return endGame();
        advanceTurn();
    };

    setupDisplayController.show();
    restart();
    return { playTurn, restart, setupPlayers };
})();

const utils = (()=> {
    const allEqual = arr => arr.every(el => el === arr[0]);
    return { allEqual };
})();
