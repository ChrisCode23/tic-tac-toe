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

    const getTest = () => board;


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

    return { getBoard, getTest, markSign, printBoard, checkCells };

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
        }
    };

    const getValue = () => value;

    return {
        addSign,
        getValue
    }
};

const displayController = (board) => {

    // Remove existing sign DOM elements
    // Loop through all cells
    for (let i = 0; i < board.getTest().length; i++) {
        for (let j = 0; j < board.getTest()[i].length; j++) {
            const cell = document.querySelector(`#row-${i} .cell-${j}`);
            const sign = cell.querySelector(".sign");

            // If that cell contains a sign container, deletes it
            if (sign) {
                cell.removeChild(sign);
            }
        }
    }


    // Used when a player makes a move to render it to the actual board
    // Board object is passed as argument to allow to retrieve the current state of the board array
    const renderBoard = () => {
        // Loop through each row of the board
        for (let i = 0; i < board.getTest().length; i++) {
            // Loop through each cell contained in that row
            for (let j = 0; j < board.getTest()[i].length; j++) {
                const cell = document.querySelector(`#row-${i} .cell-${j}`);
                const domSign = cell.querySelector(".sign");

                // Checks if a sign has already been added to the DOM
                // If so, skip this cell and continue with the loop
                if (domSign) {
                    continue;
                }
                
                
                // If the cell value matches player's sign, and sign hasn't been added to the DOM, add sign based on which player is making the move
                if (board.getTest()[i][j].getValue() == game.getActivePlayer().sign) {
                    const domSign = document.createElement("div");

                    domSign.classList.add("sign");

                    if (game.getActivePlayer().name === "User") {
                        const xRotateL = document.createElement("div");
                        xRotateL.classList.add("x-rotate-l");
                        const xRotateR = document.createElement("div");
                        xRotateR.classList.add("x-rotate-r");

                        cell.appendChild(domSign);
                        domSign.appendChild(xRotateL);
                        domSign.appendChild(xRotateR);
                    } else if (game.getActivePlayer().name === "CPU") {
                        const o = document.createElement("div");
                        o.classList.add("o");

                        cell.appendChild(domSign);
                        domSign.appendChild(o);

                    }
                }
            }
        }
    }
    return { renderBoard };
}


const gameController = () => {
    let gameFinished = false;
    let winScore = 5;

    // The sign number indicates which player has marked it
    const players = [
        {
            name: "User",
            sign: "X",
            score: 0
        },
        {
            name: "CPU",
            sign: "O",
            score: 0
        }
    ];



    // Sets default player who starts the game
    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const switchPlayersTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    let isGameOver = () => {
        if (players[0].score == 5 || players[1].score == 5) {
            return true;
        }
        return false;
    }

    const gameOver = () => {
        let winner = players[0].score == winScore ? players[0].name : players[1].name;
        console.log(`${winner} has won the game!!`);
    }



    // Execution of a single round
    const playRound = () => {
        // When a round ends, the score of the current player increases if he won
        // Anytime a round start, it checks if one of the players has won
        // If thats the case, it ends the game
        // Otherwise, it plays the round

        // Prevents to start a new round when a winner is found
        if (players[0].score == 5 || players[1].score == 5) {
            return;
        }

        // Resets the board after new round starts
        const board = Gameboard();

        // Resets the dom elements in the board so that the ones from previous round are removed
        const dom = displayController(board);

        let isRoundFinished = false;


        // Checks if the current player has won the round and the game
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
                    getActivePlayer().score++;
                    isRoundFinished = true;
                    // Ends the game if one of the players has reached the target score
                    if (isGameOver()) {
                        return gameOver();
                    }
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
            // Holds the only row/column selectable by the User. Allows the CPU to select one of these numbers
            let validAns = [1, 2, 3];

            /* The prompt asks the active player the move he wants to make by entering "coordinates"
            ** If both row or column are less than 1 or higher than 3, consider it invalid and make User input again
            ** If it's CPU's turn instead, it generates a random number for row and column
            ** Allowing to make it choose *coordinates* automatically
            */
            const chooseRow = () => {
                if (getActivePlayer() === players[0]) {
                    do {
                        row = parseInt(prompt("Choose row", ""), 10);
                    } while (row < validAns[0] || row > validAns[2] || isNaN(row));
                }
                if (getActivePlayer() === players[1]) {
                    row = validAns[Math.floor(Math.random() * validAns.length)];
                }
            }
            const chooseColumn = () => {
                if (getActivePlayer() === players[0]) {
                    do {
                        column = parseInt(prompt("Choose column", ""), 10);
                    } while (column < validAns[0] || column > validAns[2] || isNaN(column));
                }
                if (getActivePlayer() === players[1]) {
                    column = validAns[Math.floor(Math.random() * validAns.length)];
                }
            }


            // Once both prompts have been entered, check if the coordinates match a cell that's already been selected
            // If so, make player enter the coordinates again until they don't match an occupied cell
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
                dom.renderBoard(board);
                // Every time after player makes his move, checks if he's won
                checkWin(board.getBoard(), players[0]);
                checkWin(board.getBoard(), players[1]);
            }
        }



        printNewRound();

        if (isRoundFinished === true) { return } else { makeMove() };

        switchPlayersTurn();

        printNewRound();

        if (isRoundFinished === true) { return } else { makeMove() };

        switchPlayersTurn();

        printNewRound();

        if (isRoundFinished === true) { return } else { makeMove() };

        switchPlayersTurn();

        printNewRound();

        if (isRoundFinished === true) { return } else { makeMove() };

        switchPlayersTurn();

        printNewRound();

        if (isRoundFinished === true) { return } else { makeMove() };

        switchPlayersTurn();

        printNewRound();


        if (isRoundFinished === true) { return } else { makeMove() };

        switchPlayersTurn();

        printNewRound();

        if (isRoundFinished === true) { return } else { makeMove() };

        switchPlayersTurn();

        printNewRound();

        if (isRoundFinished === true) { return } else { makeMove() };

        switchPlayersTurn();

        printNewRound();


        if (isRoundFinished === true) { return } else { makeMove() };

        switchPlayersTurn();

        printNewRound();

        if (isRoundFinished === true) { return } else { makeMove() };

        switchPlayersTurn();

        printNewRound();


    };


    return { playRound, getActivePlayer };
}

const game = gameController();

const newRound = document.querySelector(".new-round");



newRound.addEventListener("click", () => {
    game.playRound();
})


