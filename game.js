"use strict";

//constants
var BLOCK_SIZE = 10;
var COLS = 36;
var ROWS = 66;
var canvas;
var ctx;
var playStatus = false;
var gameStart = false;
var playBtn = document.getElementById("play-btn")
var pauseBtn = document.getElementById("pause-btn")
var resetBtn = document.getElementById("reset-btn")
var pieces = [];

class Piece { // responsible for supplying color, shape, and location of piece
    constructor() {
        this.x = 0;
        this.y = 0;
        this.defaultVelocity = 1;
        this.yvelocity = 1;
        this.xvelocity = 0;
        this.setStatus = false;
        this.pieceId = Math.floor((Math.random() * 100)) + 1
        this.color = this.chooseRandomPieceColor();
        this.shape = this.determineShape()
        pieces.push(this);
    }

    chooseRandomPieceColor() {
        let colorArray = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
        let num = Math.floor(Math.random() * 7)
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

        let index = Math.floor(Math.random() * SHAPES.length);
        let pieceShape = SHAPES[index];

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

    updateBoard() {
        this.displayPieces(mainPiece)
        console.log(this.grid)
    }


    displayPieces(piece) {
        this.resetBoard()
        

            for (let i = piece.y; i < piece.y + piece.shape.length; i++) {
                for (let j = piece.x; j < piece.x + piece.shape[0].length; j++) {

                    this.grid[i][j] = piece.shape[i-piece.y][j-piece.x]
                }
            }

        return this.grid;
    }

    collisionDetection(piece, proposedCoords) {
        // goes through each block in tetronimo and simulates shift in position 
        // if any part of tetronimo is outside bounds, returns true for collision detected


        let dy = proposedCoords[1] - piece.y
        let dx = proposedCoords[0] - piece.x


        for (let i = 0; i < piece.shape.length; i++) {
            for (let j = 0; j < piece.shape[i].length; j++) {

                if (piece.shape[i][j] > 0) {
	                if (piece.x + j + dx < 0 || piece.x + j + dx >= COLS) {
	                    return true;
	                }
	
	                if (piece.y + i + dy >= ROWS) {
                        piece.yvelocity = 0;
                        piece.setStatus = true;
	                    return true;
	                }
                }
            }
        }

        return false;


    }

}

var mainPiece = new Piece();
var board = new Board();

//canvas and context, defines default fill color to red and rows/cols, also scales ctx


window.onload = function () {
    canvas = document.getElementById("gameCanvas");
    canvas.height = BLOCK_SIZE * ROWS;
    canvas.width = BLOCK_SIZE * COLS;

    ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FF0000"
    ctx.scale(BLOCK_SIZE, BLOCK_SIZE);


    //event listeners
    playBtn.addEventListener('click', gameLoop, false);
    pauseBtn.addEventListener('click', pauseFunc, false);
    resetBtn.addEventListener('click', resetBoard, false);

    document.addEventListener('keydown', userInput, false)
    document.addEventListener('keyup', releaseUserInput, false)


}

// game loop logic

let gameLoop = function () {
    playStatus = true;
    setInterval(update, 1000/10)
    // update()
}

let pauseFunc = function () {
    playStatus = false;
}

let resetBoard = function () {
    playStatus = false;
    reset()
}

function update() {

    ctx.clearRect(0, 0, COLS, ROWS);


    if (playStatus) { // play game

        if (generateNewPieceCond()) {
            mainPiece = new Piece();
        }
        ctx.fillStyle = mainPiece.color;


        constantMovement()
        // board.updateBoard()
        renderPiece(mainPiece)



    } else { // freeze game
        renderPiece(mainPiece);
    }
}

function reset() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameStart = false;
}


// piece logic
function renderPiece(piece) {

    
    for (let i = 0; i < piece.shape.length; i++) {
        for (let j = 0; j < piece.shape[i].length; j++) {
            if (piece.shape[i][j] > 0) {
                ctx.fillStyle= "red"
                ctx.fillRect(piece.x + j, piece.y + i, 1, 1)
            } else {
                ctx.fillStyle = "yellow"
                ctx.fillRect(piece.x + j, piece.y + i, 1, 1)
            }
        }
    }
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
    let proposedY =  mainPiece.y + mainPiece.yvelocity;


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
    } // add support for space bar to instantly make it go down

    else if (e.code === "ArrowUp") {
        mainPiece.rotate();
    }
}

function releaseUserInput(e) {
    if (e.code === "ArrowDown" || e.code === "ArrowLeft" || e.code === "ArrowRight") {
        mainPiece.yvelocity = mainPiece.defaultVelocity;
        mainPiece.xvelocity = 0;
        console.log(e.code)
    }
}

function renderAllPieces() { // renders pieces that are stillon the board

}





