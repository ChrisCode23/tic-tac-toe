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

    // Returns the board under form of a 2d array
    const getBoard = () => board;

    // Returns the board under form of a 2d array (with each cell's value)
    const getCells = () => {
        // Gets the value of each cell, useful to figure out when someone wins a round
        const boardToCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        return boardToCellValues;
    };



    // It determines if any move on the board is possible by checking if any cell is available
    const checkCells = () => {
        let availableCells = 0;

        // Returns a value that will be checked in playRound
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
        board[row][column].addSign(player);
    }

    // Console version of the board UI
    const printBoard = () => {
        console.log(getCells());
    };

    return { getBoard, getCells, markSign, printBoard, checkCells };

};


/* A Cell is a square of the gameboard
** 0: no sign is in the square
** "X": User's sign
** "O": CPU's sign
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
            return;
        }
    };

    const getValue = () => value;

    return {
        addSign,
        getValue
    }
};



const gameController = (
    // Sets default players names
    playerOneName = "PlayerOne",
    playerTwoName = "PlayerTwo"
) => {

    // The sign number indicates which player has marked it
    const players = [
        {
            name: playerOneName,
            sign: "X",
        },
        {
            name: playerTwoName,
            sign: "O",
        }
    ];

    const board = Gameboard();

    // Sets default player who starts the game
    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    let isGameOver = false;

    const gameOver = () => isGameOver = true;

    const switchPlayersTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    // Checks for 3-in-a-row marked cells by the player (horizontally, vertically, diagonally)
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
                if (rowCount === win || colCount === win || diagLeftCount === win || diagRightCount === win) {
                    // Returns a "win" message and ends the game
                    console.log(`${getActivePlayer().name} has won!`);
                    gameOver();
                    return true;
                }
            } rowCount = 0;
        }
    };

    const printNewRound = () => {
        board.printBoard();
        console.log(`It's ${getActivePlayer().name}'s turn!`);
    };



    // Execution of a round
    const playRound = (row, column) => {
        if (!isGameOver) {
            // Passes the row and column coordinates taken from the displayController click handler
            board.markSign(row, column, getActivePlayer().sign);

            // Prevents player from marking more signs if the game has ended
            if (checkWin(board.getCells(), getActivePlayer()) == true) {
                return;
            } else if (board.checkCells() == false) {
                console.log("No more moves available! This is a tie");
                gameOver();
                return;
            };

            switchPlayersTurn();
            printNewRound();
        }
    };

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };

}

// Manages the game's display/DOM elements 
const displayController = () => {
    const game = gameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    const updateDisplay = () => {
        // Clears the board
        boardDiv.textContent = "";

        // Gets the updated board and current player
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Displays player's turn
        playerTurnDiv.textContent = `${activePlayer.name}'s turn`;

        // Renders the board
        board.forEach((row, index) => {
            const rowDiv = document.createElement("div");
            rowDiv.classList.add("row");
            
            // Assigns a data-attribute to the row that allows to identify it
            rowDiv.dataset.row = index;

            boardDiv.appendChild(rowDiv);
            row.forEach((cell, index) => {
                const cellDiv = document.createElement("div");
                cellDiv.classList.add("cell");

                // Assigns a data-attribute to the cell that allows to identify it
                cellDiv.dataset.column = index;

                // If the cell is marked, renders the sign
                if (cell.getValue() != 0) {
                    const signDiv = document.createElement("div");
                    signDiv.classList.add("sign");

                    signDiv.textContent = cell.getValue();

                    // Adds a specific color based on the sign to help it stand out 
                    cell.getValue() == "X" ? signDiv.style.color = "#031268" : signDiv.style.color = "#e41a1a";

                    cellDiv.appendChild(signDiv);
                } else {
                    // Otherwise, leaves the cell blank
                    cellDiv.textContent = "";
                }
                rowDiv.appendChild(cellDiv);
            })
        })
    }

    // Add click eventListener for the board
    const clickHandlerBoard = (e) => {
        // Takes the data-attributes of the selected cell
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.parentNode.dataset.row;

        // Clicking anything but the actual cells on the board is not allowed (e.g. gaps between cells)
        if (!selectedColumn || !selectedRow) {
            return;
        }

        // Passes the selected cell data-attributes as "coordinates" that are used to mark that cell
        game.playRound(selectedRow, selectedColumn);
        
        updateDisplay();

    };

    boardDiv.addEventListener("click", clickHandlerBoard);

    // Initially renders the board before player clicks
    updateDisplay();


}

displayController();

const newRound = document.querySelector(".new-round");



newRound.addEventListener("click", () => {
    game.playRound();
})










