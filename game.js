"use strict";

//constants
var BLOCK_SIZE = 15;
var COLS = 20;
var ROWS = 45;
var canvas;
var ctx;
var playStatus = 'idleStart'
var totalPiecesDropped = 0
var playBtn = document.getElementById("play-btn")
var pauseBtn = document.getElementById("pause-btn")
var resetBtn = document.getElementById("reset-btn")
var scoreElement = document.getElementById('score')
var levelElement = document.getElementById("level")
var linesElement = document.getElementById("lines");
var pieces = [];
var currentScore = 0;
var currentLines = 0;
var currentLevels = 0;

class Piece { // responsible for supplying color, shape, and location of piece
    constructor() {
        this.x = 15;
        this.y = 0;
        this.defaultVelocity = 1;
        this.yvelocity = 1;
        this.xvelocity = 0;
        this.setStatus = false;
        this.pieceId = Math.floor((Math.random() * 1000)) + 1
        this.color = this.chooseRandomPieceColor();
        this.shape = this.determineShape()
        pieces.push(this);
    }


    chooseRandomPieceColor() {
        let colorArray = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
        let num = Math.floor(Math.random() * 6)
        let color = colorArray[num];

        return color;
    }

    determineShape() {
        const SHAPES = [
            [[0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]],

            [[2, 0, 0],
            [2, 2, 2],
            [0, 0, 0]],

            [[0, 0, 3], // 0,0 -> 2,0 ; 0,1 -> 1,0 ; 0,2 -> 0,0
            [3, 3, 3], // 1,0 -> 2,1 ; 1,1 -> 1,1 ; 1,2 -> 0,1 
            [0, 0, 0]],// 2,0 -> 2,2 ; 2,1 -> 1,2 ; 2,2 -> 0,2

            [[4, 4],
            [4, 4]],

            [[0, 5, 5],
            [5, 5, 0],
            [0, 0, 0]],

            [[0, 6, 0],
            [6, 6, 6],
            [0, 0, 0]],

            [[7, 7, 0],
            [0, 7, 7],
            [0, 0, 0]]
        ];

        let row = Math.floor(Math.random() * SHAPES.length);
        let pieceShape = SHAPES[row];

        for (let i = 0; i < pieceShape.length; i++) {
            for (let j = 0; j < pieceShape[i].length; j++) {
                if (pieceShape[i][j] > 0) {
                    pieceShape[i][j] = this.pieceId;
                }
            }
        }



        return pieceShape;
    }

    rotate() {

        let copyArr = []
        if (!mainPiece.setStatus) {
            for (let y = 0; y < this.shape.length; ++y) {
                for (let x = 0; x < y; ++x) {
                    [this.shape[x][y], this.shape[y][x]] =
                        [this.shape[y][x], this.shape[x][y]];
                }
            }

            // Reverse the order of the columns.
            this.shape.forEach(row => row.reverse());
        }

        for (let i = 0; i < this.shape.length; i++) {
            for (let j = 0; j < this.shape[i].length; j++) {

                if (this.shape[i][j] > 0) {
                    if (this.x + j < 0) {
                        this.x = this.x + 2;
                    } else if (this.x + j >= COLS) {
                        this.x = this.x - 1
                    }

                    if (this.y + i >= ROWS) {
                        this.y = this.y - 1;
                    }

                    if (board.grid[this.y + i][this.x + j] > 0) {
                        this.x = this.x + 2;
                    }
                }
            }
        }

    }

}

class Board {

    constructor() {
        this.grid = this.getClearBoard();
    }

    resetBoard() {
        this.grid = this.getClearBoard()
    }

    getClearBoard() {
        return Array.from(
            { length: ROWS }, () => Array(COLS).fill(0)
        );
    }

    collisionDetection(piece, proposedCoords) {
        // goes through each block in tetronimo and simulates shift in position 
        // if any part of tetronimo is outside bounds, returns true for collision detected


        let dy = proposedCoords[1] - piece.y
        let dx = proposedCoords[0] - piece.x
        console.log(totalPiecesDropped)

        for (let i = 0; i < piece.shape.length; i++) {
            for (let j = 0; j < piece.shape[i].length; j++) {

                if (piece.shape[i][j] > 0) {
                    if (piece.x + j + dx < 0 || piece.x + j + dx >= COLS) { // side border collision
                        return true;
                    }

                    if (piece.y + i + dy >= ROWS) { // bottom border collision
                        piece.yvelocity = 0;
                        piece.setStatus = true;
                        this.setPieces(piece)
                        modifyScore(40 * (currentLevels+1))
                        this.clearLines()

                        console.table(this.grid)
                        return true;
                    }

                    if (this.grid[piece.y+i+dy][piece.x+j] > 0 && piece.y + i <= 0) {
                        endGame()
                        return true;
                    }

                    if (this.grid[Math.floor(piece.y)+i+dy][piece.x+j] > 0) {
                        piece.yvelocity = 0;
                        piece.setStatus = true;
                        this.setPieces(piece)
                        modifyScore(40 * (currentLevels+1))

                        this.clearLines()
                        
                        console.table(this.grid)
                        return true;
                    }

                    if (this.grid[i + Math.floor(piece.y)][piece.x + j + dx] > 0) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    setPieces(piece) {
        if (piece.setStatus) {
            for (let i = 0; i < piece.shape.length; i++) {
                for (let j = 0; j < piece.shape[i].length; j++) {
                    if (piece.shape[i][j] > 0) {
	                        this.grid[i + piece.y][j + piece.x] = piece.shape[i][j]
                    }
                }
            }
        }
    }

    detectLines() {
        // goes through each row in grid and sees whether complete row exists
        // if complete row exists, it adds index of row to completeLines
        // returns empty array if no rows contain complete lines

        let completeLines = [] // contains indices of rows w/ complete lines
        for (let i = 0; i < this.grid.length; i++) {
            if (!this.grid[i].includes(0)) {
                completeLines.push(i);
            }
        }

        return completeLines;
    }

    clearLines() {
        // objective --> takes rows that need to be cleared and clears them

        let linesArr = this.detectLines()

        if (linesArr.length > 0) { // if rows are complete, they need to be cleared
            linesArr.forEach((rowNum) => {
                modifyLines()
                modifyScore(100 * (currentLevels + 1))
                // first clear row on this.grid
                for (let i = 0; i < this.grid[rowNum].length; i++) {
                    this.grid[rowNum][i] = 0; 
                }

                // move existing pieces down
                for (let i = rowNum-1; i > 0; i--) {
                    for (let j = 0; j < this.grid[i].length; j++) {
                        if (this.grid[i][j] > 0) {
                            this.grid[i+1][j] = this.grid[i][j]
                            this.grid[i][j] = this.grid[i-1][j]
                        }
                    }
                }

            })
        }

    }
}


var mainPiece = new Piece();
var board = new Board();

//canvas and context, defines default fill color to red and rows/cols, also scales ctx


window.onload = function () {
    canvas = document.getElementById("gameCanvas");
    canvas.height = BLOCK_SIZE * ROWS;
    canvas.width = BLOCK_SIZE * COLS;
    playStatus = "notplaying"

    ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FF0000"
    ctx.scale(BLOCK_SIZE, BLOCK_SIZE);


    //event listeners
    playBtn.addEventListener('click', gameLoop, false);
    pauseBtn.addEventListener('click', pauseFunc, false);
    resetBtn.addEventListener('click', resetBoard, false);

    document.addEventListener('keydown', userInput, false)
    document.addEventListener('keyup', releaseUserInput, false)

    setInterval(update, 1000/10)


}

// game loop logic

let gameLoop = function () {
    playStatus = 'play'
    // update()
}

let pauseFunc = function () {
    playStatus = 'pause';
}

let resetBoard = function () {
    playStatus = 'notplaying'
}

let endGame = function () {
    playStatus = 'notplaying'
    // other endgame stuff
    alert("you lost.")
}

function update() {

    ctx.clearRect(0, 0, COLS, ROWS);


    if (playStatus === 'play') { // play game

        if (generateNewPieceCond()) {
            mainPiece = new Piece();
        }


        constantMovement()
        mainPiece.y = Math.floor(mainPiece.y)
        // board.updateBoard()
        renderPiece(mainPiece);
        renderSetPieces();
        updateScores();



    } else if (playStatus === 'pause') { // freeze game
        renderPiece(mainPiece);
        renderSetPieces()
    }
    else {
        reset()
    }
}

function reset() {
    playStatus = 'notplaying'
    board.resetBoard()
    resetAllScores()
    mainPiece = new Piece()

}

function resetAllScores() {

}

function updateScores() {
    modifyLevels()
    scoreElement.innerHTML = `score: ${currentScore}`;
    linesElement.textContent = `lines: ${currentLines}`
    levelElement.textContent = `level: ${currentLevels}`
}


// piece logic
function renderPiece(piece) {


    for (let i = 0; i < piece.shape.length; i++) {
        for (let j = 0; j < piece.shape[i].length; j++) {
            if (piece.shape[i][j] > 0) {
                ctx.fillStyle = piece.color;
                ctx.fillRect(piece.x + j, piece.y + i, 1, 1)
            }
        }
    }

}

function renderSetPieces() {
    let piece = undefined;
    let index = 0;
    for (let i = 0; i < board.grid.length; i++) {
        for (let j = 0; j < board.grid[i].length; j++) {
            if (board.grid[i][j] > 0) {
                if (searchPieces(board.grid[i][j]) !== -1) {
                    index = searchPieces(board.grid[i][j])
                    piece = pieces[index]
                    ctx.fillStyle = piece.color;
                    ctx.fillRect(j, i, 1, 1)
                }
            }
        }
    }
}

function searchPieces(id) { // returns index of piece in pieces array, otherwise returns -1
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].pieceId === id) {
            return i;
        }
    }

    return -1;
}

function generateNewPieceCond() { // determines whether new piece should be generated or not
    // new piece should be generated when:
    // when the first piece (piece you start the game with) or when any piece after is set in its position
    if (mainPiece.setStatus) {
        return true;
    } else {
        return false;
    }

}

// movement logic
function constantMovement() {

    // only allow movement downward if collisionDetection() allows it

    let proposedX = mainPiece.x + mainPiece.xvelocity;
    let proposedY = mainPiece.y + mainPiece.yvelocity;


    if (!board.collisionDetection(mainPiece, [proposedX, proposedY])) {
        mainPiece.x = proposedX;
        mainPiece.y = proposedY;
    }

    //info
    console.log("x, y: " + mainPiece.x, mainPiece.y);
    console.log("xvel, yvel: ", mainPiece.xvelocity, mainPiece.yvelocity);
}

function userInput(e) {

    // *EDIT --> only allow movement in directions that are allowed by collisionDetection()
    // if player attempts to move in direction that is restricted, set velocity respective to direction to 0
    // else reset velocity to default

    if (e.code === "ArrowLeft") {
        mainPiece.yvelocity = 0;
        mainPiece.xvelocity = -mainPiece.defaultVelocity;
    } else if (e.code === "ArrowRight") {
        mainPiece.yvelocity = 0;
        mainPiece.xvelocity = mainPiece.defaultVelocity;
    } else if (e.code === "ArrowUp") {
        mainPiece.rotate();
    } else if (e.code === 'Space') {
        // determine closest location that piece can land 
        let collision = false;
        let yValue = mainPiece.y;
        console.log('reached')
        while (!collision) {
            yValue++
            for (let i = 0; i < mainPiece.shape.length; i++) {
                for (let j = 0; j < mainPiece.shape[i].length; j++) {
                    // x condition
                    if (yValue + i >= ROWS || (board.grid[yValue + i][mainPiece.x + j] > 0)) {
                        mainPiece.y = yValue - 1
                        collision = true;
                    }
                }
            }
        }
    }
}

function releaseUserInput(e) {
    if (e.code === "ArrowDown" || e.code === "ArrowLeft" || e.code === "ArrowRight") {
        mainPiece.yvelocity = mainPiece.defaultVelocity;
        mainPiece.xvelocity = 0;
        console.log(e.code)
    }
}

function modifyScore(points) {
    currentScore += points;
}

function modifyLines() {
    currentLines++;
}

function modifyLevels() {
    if (currentLines % 10 === 0 && currentLines > 0) {
        currentLevels++;
    }
}

function resetAllScores() {
    currentScore = 0;
    currentLines = 0;
    currentLevels = 0;

}