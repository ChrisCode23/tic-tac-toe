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
    const getBoard = () => {
        // Gets the value of each cell, useful to figure out when someone wins a round
        const boardToCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        return boardToCellValues;
    };




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
        console.log(getBoard());
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
    let gameFinished = false;

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
        board.printBoard();
        console.log(`It's ${getActivePlayer().name}'s turn!`);
    };
    
    // Execution of a single round
    const playRound = () => {
        
        let isRoundFinished = false;

        // Checks if the current player has won the round
        const checkWin = (board) => {
            let win = 3;
            let rowCount = 0;
            let colCount = 0;
            let diagLeftCount = 0;
            let diagRightCount = 0;
            let length = board.length;
    
            for (let i = 0; i < length; i++) {
                for (let j = 0; j < length; j++) {
                    (board[i][j] == 1 || board[i][j] == 2) ? rowCount++ : rowCount = 0;
    
                    (board[j][i] == 1 || board[j][i] == 2) ? colCount++ : colCount = 0;
    
                    if ((board[i][j] == 1 || board[i][j] == 2) && i < length - win + 1) {
                        diagLeftCount = 0;
                        diagRightCount = 0;
                        for (let z = 0; z < win; z++) {
                            (board[i + z][j + z]) == 1 ? diagRightCount++ : diagRightCount = 0;
                            (board[i + z][j - z]) == 1 ? diagLeftCount++ : diagLeftCount = 0;
                        }
                    }
    
                    if (rowCount == win || colCount == win || diagLeftCount == win || diagRightCount == win) {
                        console.log(`${getActivePlayer().name} has won the round`);
                        isRoundFinished = true;
                        return true;
                    }
                } rowCount = 0;
                
            }
            
        };

        // Player chooses cell to mark and the value is added to that cell
        const makeMove = (row, column) => {
            console.log(`${getActivePlayer().name} has marked his sign on cell located in row ${row}, column ${column}`);
            board.markSign(row, column, getActivePlayer().sign);
            // Every time after player makes his move, checks if he's won
            checkWin(board.getBoard());
            
        }
    
        
        if (isRoundFinished === true) { return } else { makeMove(2, 2) };

        switchPlayersTurn();

        printNewRound();

        if (isRoundFinished === true) { return } else { makeMove(1, 1) };

        switchPlayersTurn();

        printNewRound();

        if (isRoundFinished === true) { return } else { makeMove(3, 3) };

        switchPlayersTurn();

        printNewRound();

        if (isRoundFinished === true) { return } else { makeMove(1, 2) };

        switchPlayersTurn();

        printNewRound();

        if (isRoundFinished === true) { return } else { makeMove(3, 1) };

        switchPlayersTurn();

        printNewRound();

        if (isRoundFinished === true) { return } else { makeMove(2, 3) };

        switchPlayersTurn();

        printNewRound();
    };

    printNewRound();



    return { playRound };
}

const game = gameController();

game.playRound();
