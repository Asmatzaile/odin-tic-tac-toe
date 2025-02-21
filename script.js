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

    const playTurn = index => {
        const board = getCurrentPlayer().placeToken(index);
        advanceTurn();
        return board;
    };

    return { playTurn };
})();
