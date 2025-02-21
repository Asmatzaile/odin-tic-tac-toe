const displayController = (() => {
    const boardDiv = document.querySelector("#board");
    const renderBoard = () => {
        const board = gameboard.getBoard();
        const newChildren = board.map(cell => {
            const cellEl = document.createElement(cell === undefined ? "button" : "div");
            cellEl.textContent = cell ?? "";
            return cellEl;
        })
        boardDiv.replaceChildren(...newChildren);
    }
    return { renderBoard };
})();

const gameboard = (() => {
    const board = new Array(9);
    const getBoard = () => [...board];
    const placeToken = (token, index) => {
        board[index] = token;
        return getBoard();
    }
    return { getBoard, placeToken }
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

    let currentTurn = 0;
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
        if (winnerName) return console.log(`Game over! ${winnerName} wins.`);
        return console.log(`Game over! You tied.`)
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

    displayController.renderBoard();
    return { playTurn };
})();

const utils = (()=> {
    const allEqual = arr => arr.every(el => el === arr[0]);
    return { allEqual };
})();
