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





    // Takes the *coordinates* of the cell which is marked by the player on the board
    // Changes that cell's value to represent the player that marked it
    const markSign = (row, column, player) => {
        board[row][column].addSign(player);
    }

    // Console version of the board UI
    const printBoard = () => {
        console.log(getCells());
    };

    // Rolls the value of each board-cell back to 0
    const resetBoard = () => {
        board.forEach((row) => {
            row.forEach((column) => {
                column.resetValue();
            })
        })
    }

    return {
        getBoard,
        getCells,
        markSign,
        printBoard,
        resetBoard
    };

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

    const resetValue = () => value = 0;

    return {
        addSign,
        getValue,
        resetValue
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

    const switchPlayersTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    // Set to null as long as there's no winner (falsy)
    let winner = null;

    const getWinner = () => winner;

    let isGameOver = false;

    const getGameStatus = () => isGameOver;

    // Cancels ruling that prevents players from marking more signs and removes winner after the previous game ended
    const startGame = () => {
        isGameOver = false;
        winner = null;
    }

    const endGame = () => isGameOver = true;

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
                    // console.log(`${getActivePlayer().name} has won!`);
                    winner = getActivePlayer().name;
                    endGame();
                    return true;
                }
            }
            rowCount = 0;
            colCount = 0;
        }
    };

    // It determines if any move on the board is possible by checking if any cell is available
    const checkTie = (board) => {
        board = board.getBoard();

        let availableCells = 0;

        board.forEach((row) => {
            row.forEach((column) => {
                if (column.getValue() == 0) {
                    availableCells++;
                    return false;
                }
            })
        })
        if (availableCells == 0) {
            endGame();
            return true;
        };
    }

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
            if (checkWin(board.getCells(), getActivePlayer()) == true || checkTie(board) == true) {
                return;
            }

            switchPlayersTurn();
            printNewRound();
        }
    };

    return {
        playRound,
        getActivePlayer,
        getGameStatus,
        getWinner,
        getBoard: board.getBoard,
        resetBoard: board.resetBoard,
        startGame
    };

}

// Manages the game's display/DOM elements 
const displayController = (player1, player2) => {

    const game = gameController(player1, player2);
    const gameDiv = document.querySelector(".game");
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const restartBtn = document.querySelector(".restart");



    // Shows win/tie result upon game-end
    const winnerScreen = () => {

        // Only works when game is over
        if (game.getGameStatus() === true) {

            // Prevents from printing more than one result per game
            if (document.querySelector(".result")) {
                return;
            }

            const result = document.createElement("div");
            result.classList.add("result");

            // Checks if game has a winner and prints a win message
            if (game.getWinner()) {
                result.textContent = `${game.getWinner()} has won!`;
            // Otherwise it's a tie
            } else if (game.getWinner() == null) {
                result.textContent = "No more moves available. It's a tie!";
            };

            gameDiv.appendChild(result);
        }
    }




    const updateDisplay = () => {
        // Clears win message from previous game after restarting so it doesn't carry over to the next one
        if (game.getGameStatus() === false && document.querySelector(".result")) {
            gameDiv.removeChild(document.querySelector(".result"));
        }
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

        winnerScreen();

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

    // Add click eventListener to button for restarting the game
    restartBtn.addEventListener("click", () => {
        game.resetBoard();
        game.startGame();
        updateDisplay();
    })

    // Initially renders the board before player clicks
    updateDisplay();


}

// Controls the DOM elements of the game-intro screen upon loading the page
const introScreen = (function () {

    /* Dialogs are used to allow both players to enter their names
    // Players should enter a username (a default one is already entered)
    ** We can't directly use the submit button to send data, so we prevent the default use of the button
    ** Upon pressing it, we retrieve the data entered (if it's valid) and store it in players variables
    ** These are then passed in displayController, and gameController as the actual usernames
    */

    // Declare placeholder variables where players' names are stored
    let player1 = "Player1";
    let player2 = "Player2";

    const introDiv = document.querySelector(".intro");
    const gameDiv = document.querySelector(".game");
    const playBtn = document.querySelector(".play");

    const playerOneDialog = document.querySelector(".playerOneDialog");
    const playerTwoDialog = document.querySelector(".playerTwoDialog");

    const playerOneLabel = playerOneDialog.querySelector("label[for=username]");
    const playerTwoLabel = playerTwoDialog.querySelector("label[for=username]");
    const playerOneInput = playerOneDialog.querySelector("input[id=username]");
    const playerTwoInput = playerTwoDialog.querySelector("input[id=username]");
    const playerOneSubmitBtn = playerOneDialog.querySelector("button[type=submit]");
    const playerTwoSubmitBtn = playerTwoDialog.querySelector("button[type=submit]");

    playerOneLabel.textContent = `${player1}, please enter your username`;
    playerTwoLabel.textContent = `${player2}, please enter your username`;

    // Checks if the username entered is valid
    const testUsername = (testcase) => {
        const validUsername = /^[0-9A-Za-z]{6,16}$/;
        return validUsername.test(testcase);
    }

    playBtn.addEventListener("click", () => {
        playerOneDialog.showModal();
    })


    playerOneSubmitBtn.addEventListener("click", (event) => {
        event.preventDefault();
        // Player must enter username again if it's incorrect
        if (!testUsername(playerOneInput.value)) {
            return;
        }
        playerOneDialog.close(playerOneInput.value);
    })

    playerOneDialog.addEventListener("close", () => {
        player1 = playerOneDialog.returnValue;
        playerTwoDialog.showModal();
    })


    playerTwoSubmitBtn.addEventListener("click", (event) => {
        event.preventDefault();
        if (!testUsername(playerTwoInput.value)) {
            return;
        }
        playerTwoDialog.close(playerTwoInput.value);
    })

    playerTwoDialog.addEventListener("close", () => {
        player2 = playerTwoDialog.returnValue;

        // Removes the intro-screen and shows the actual game
        introDiv.style.display = "none";
        gameDiv.style.display = "block";

        // Useful when pressing "Esc" to exit out of dialog before entering a name
        // Sets both usernames to default names set in gameController
        if (player1.length === 0) player1 = undefined;
        if (player2.length === 0) player2 = undefined;

        // Passes the usernames which have been entered in the dialog windows
        displayController(player1, player2);
    })
})();























