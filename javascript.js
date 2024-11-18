// Represents the state of the board, on which the players mark their signs on the cells
const Gameboard = () => {
    const rows = 3;
    const columns = 3;
    const board = [];

    // We loop through the rows and the columns that represent a 2d array of the gameboard
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        };
    };

    // This returns the board under form of a 2d array, formed by three arrays which represent each row
    const getBoard = () => board;

    // Takes the *coordinates* of the cell which is marked by the player on the board
    // Changes that cell's value to represent the player that marked it
    const markSign = (row, column, player) => {
        // Look for the available cells by filtering through each row, and within it each column
        // The board array represents the rows
        // We need to loop through all them to look for cells with value "0" which means they're available
        // We then return only the available cells
        const availableCells = board.filter((row) => row.filter((cell) => cell.getValue() == 0));

        // Stop execution when no more cells are available
        if (!availableCells.length) return;

        // Changes the cell value selected by the player (the actual value is related to the player himself)
        // Both row and column values are deducted by 1 to allow player input to be correct
        board[row - 1][column - 1].addSign(player);
    }

    // Renders a similar *preview* of what the board should look like after building UI
    const printBoard = () => {
        const boardToCell = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardToCell);
    };

    return { getBoard, markSign, printBoard };

};


/* A Cell is a square of the gameboard
** 0: no sign is in the square
** 1: Player 1's sign
** 2: Player 2's (aka CPU's) sign
*/

const Cell = () => {
    let value = 0;

    // Changes the cell value based on the sign property passed by the player
    const addSign = (player) => {
        // Prevents the cell value from being changed if it was previously set by one of the players
        if (value != 0) {
            return;
        } else {
            value = player;
        }
    };

    const getValue = () => value;

    return {
        addSign,
        getValue
    }
};

const gameController = () => {
    // The sign number indicates which player has marked it
    const players = [
        {
            name: "PlayerOne",
            sign: 1
        },
        {
            name: "PlayerTwo",
            sign: 2
        }
    ];

    const board = Gameboard();

    // Sets default player who starts the game
    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const switchPlayersTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const printNewRound = () => {
        console.log(`It's ${getActivePlayer().name}'s turn!`);
    };

    // Active player chooses cell to mark
    const makeMove = (row, column) => {
        console.log(`${getActivePlayer().name} has marked his sign on cell located in row ${row}, column ${column}`);
        board.markSign(row, column, getActivePlayer().sign);
    }

    // Execution of a single round
    const playRound = () => {
        printNewRound();

        makeMove(1, 2);

        board.printBoard();

        switchPlayersTurn();

        printNewRound();

        makeMove(2, 3);

        board.printBoard();

        switchPlayersTurn();
    };

    return { playRound };
}

const game = gameController();

game.playRound();
