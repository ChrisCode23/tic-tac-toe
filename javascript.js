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


    // It determines if any move is possible by checking if any cell is available
    const checkCells = () => {
        let availableCells = 0;

        // Loops through all the cells in the board
        // Keeps going until it finds one that is available
        // Based on the result, it either returns a true or false value for "makeMove" function
        board.forEach((row) => {
            row.forEach((column) => {
                if (column.getValue() == 0) {
                    availableCells++;
                    return true;
                } 
            })
        })
        if (availableCells == 0) { return false };
    }




    // Takes the *coordinates* of the cell which is marked by the player on the board
    // Changes that cell's value to represent the player that marked it
    const markSign = (row, column, player) => {
        // Both row and column values are deducted by 1 to allow player input to be correct
        row = row - 1;
        column = column - 1;
    
        // Changes the cell value selected by the player (the actual value is related to the player himself)
        board[row][column].addSign(player);
    }

    // Renders a similar *preview* of what the board should look like after building UI
    const printBoard = () => {
        console.log(getBoard());
    };

    return { getBoard, markSign, printBoard, checkCells };

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
    let winScore = 5;

    // The sign number indicates which player has marked it
    const players = [
        {
            name: "PlayerOne",
            sign: 1,
            score: 0
        },
        {
            name: "PlayerTwo",
            sign: 2,
            score: 0
        }
    ];

    const board = Gameboard();

    // Sets default player who starts the game
    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const switchPlayersTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };



    // Execution of a single round
    const playRound = () => {
        let isRoundFinished = false;

        // Checks if the current player has won the round
        const checkWin = (board, player) => {
            let win = 3;
            let rowCount = 0;
            let colCount = 0;
            let diagLeftCount = 0;
            let diagRightCount = 0;
            let length = board.length;

            for (let i = 0; i < length; i++) {
                for (let j = 0; j < length; j++) {
                    (board[i][j] === player.sign) ? rowCount++ : rowCount = 0;

                    (board[j][i] === player.sign) ? colCount++ : colCount = 0;

                    if ((board[i][j] === player.sign) && i < length - win + 1) {
                        diagRightCount = 0;
                        diagLeftCount = 0;
                        for (let z = 0; z < win; z++) {
                            (board[i + z][j + z] === player.sign) ? diagRightCount++ : diagRightCount = 0;
                            (board[i + z][j - z] === player.sign) ? diagLeftCount++ : diagLeftCount = 0;
                        }
                    }
                }
                if (rowCount === win || colCount === win || diagLeftCount === win || diagRightCount === win) {
                    console.log(`${getActivePlayer().name} has won the round`);                    
                    isRoundFinished = true;
                    return true;
                }

            } rowCount = 0;

        };

        const printNewRound = () => {
            board.printBoard();
            if (!isRoundFinished) {
                console.log(`It's ${getActivePlayer().name}'s turn!`);
            }
        };

        // Player chooses cell to mark and the value is added to that cell
        const makeMove = () => {
            let row = 0;
            let column = 0;
            
            // The prompt asks the active player the move he wants to make by entering "coordinates"
            // If both row or column are less than 1 or higher than 3, consider it invalid and make player input again
            const chooseRow = () => {
                do {
                row = parseInt(prompt("Choose row", ""), 10);
            } while (row < 1 || row > 3 || isNaN(row));
            }

            const chooseColumn = () => {
                do {
                    column = parseInt(prompt("Choose column", ""), 10);
                } while (column < 1 || column > 3 || isNaN(column));
                }
            
            // Once both prompts have been entered, check if the coordinates match a cell that's already been selected
            // If so, make user enter the coordinates again until they don't match an occupied cell
            chooseRow();
            chooseColumn();
            while (board.getBoard()[row - 1][column - 1] != 0) {
                chooseRow();
                chooseColumn();
            }
            
            // If no cells are available based on value returned by "checkCells", then no move is made
            // Else it logs the move, makes it and checks if we have a winner
            if (board.checkCells() == false) {
                console.log("No more moves available!");
                isRoundFinished = true;
                return;
            } else {
            console.log(`${getActivePlayer().name} has made his move`);
            board.markSign(row, column, getActivePlayer().sign);

            // Every time after player makes his move, checks if he's won
            checkWin(board.getBoard(), players[0]);
            checkWin(board.getBoard(), players[1]);
            }
        }

        printNewRound();

        if (isRoundFinished === true) { return } else { makeMove(3, 1) };

        switchPlayersTurn();

        printNewRound();

        if (isRoundFinished === true) { return } else { makeMove(3, 2) };

        switchPlayersTurn();

        printNewRound();

        if (isRoundFinished === true) { return } else { makeMove(1, 2) };

        switchPlayersTurn();

        printNewRound();

        if (isRoundFinished === true) { return } else { makeMove(2, 3) };

        switchPlayersTurn();

        printNewRound();

        if (isRoundFinished === true) { return } else { makeMove(2, 1) };

        switchPlayersTurn();

        printNewRound();


        if (isRoundFinished === true) { return } else { makeMove(1, 1) };

        switchPlayersTurn();

        printNewRound();

        if (isRoundFinished === true) { return } else { makeMove(2, 2) };

        switchPlayersTurn();

        printNewRound();

        if (isRoundFinished === true) { return } else { makeMove(3, 3) };

        switchPlayersTurn();

        printNewRound();


        if (isRoundFinished === true) { return } else { makeMove(1, 3) };

        switchPlayersTurn();

        printNewRound();

        if (isRoundFinished === true) { return } else { makeMove(3, 3) };

        switchPlayersTurn();

        printNewRound();


    };

    return { playRound };
}

const game = gameController();

game.playRound();
