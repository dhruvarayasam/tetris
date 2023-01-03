

//constants
var BLOCK_SIZE = 30;
var COLS = 12;
var ROWS = 22;
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
        this.x = 4;
        this.y = 0;
        this.defaultVelocity = 0.3;
        this.yvelocity = this.defaultVelocity;
        this.xvelocity = 0;
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

        return pieceShape;
    }

    rotate() {
        console.log(this.shape)
        for (let y = 0; y < this.shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
              [this.shape[x][y], this.shape[y][x]] = 
              [this.shape[y][x], this.shape[x][y]];
            }
          }
          
          // Reverse the order of the columns.
          this.shape.forEach(row => row.reverse());

          console.log(this.shape)
    }




}
var mainPiece = new Piece();

//canvas and context, defines default fill color to red and rows/cols, also scales ctx


window.onload = function() {
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

gameLoop = function() {
    playStatus = true;
    setInterval(update, 1000)
}

pauseFunc = function() {
    playStatus = false;
}

resetBoard = function() {
    playStatus = false;
    reset()
}

function update() {

    if (playStatus) { // play game

        if (generateNewPieceCond()) {
            mainPiece = new Piece();
        }

        ctx.fillStyle = mainPiece.color;
        console.log(mainPiece.xvelocity);
        constantMovement()



    } else { // freeze game

    }


    
}

function reset() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameStart = false;
}


// piece logic
function renderPiece(piece) {
    for (let i = 0; i<piece.shape.length; i++) {
        for (let j = 0; j<piece.shape[i].length; j++) {
            if (piece.shape[i][j] > 0) {
                ctx.fillRect(piece.x+j, piece.y + i, 1, 1)
            }
        }
    }
}

function clearPiece(piece) {
    for (let i = 0; i<piece.shape.length; i++) {
        for (let j = 0; j<piece.shape[i].length; j++) {
            if (piece.shape[i][j] > 0) {
                ctx.clearRect(piece.x+j, piece.y + i, 1, 1)
            }
        }
    }
}

function generateNewPieceCond() { // determines whether new piece should be generated or not
    // new piece should be generated when:
    // when the first piece (piece you start the game with) or when any piece after is set in its position

    return false;
    
}

// movement logic
function constantMovement() {
    renderPiece(mainPiece);
    clearPiece(mainPiece)
    mainPiece.y = mainPiece.y + mainPiece.yvelocity;
    mainPiece.x = mainPiece.x + mainPiece.xvelocity;
    renderPiece(mainPiece)
}

function userInput(e) {
    if (e.code === "ArrowDown") {
        mainPiece.yvelocity = mainPiece.defaultVelocity + 0.2;
        mainPiece.xvelocity = 0;
    } else if (e.code === "ArrowLeft") {
        mainPiece.yvelocity = 0;
        mainPiece.xvelocity = -mainPiece.defaultVelocity;
    } else if (e.code === "ArrowRight") {
        mainPiece.yvelocity = 0;
        mainPiece.xvelocity = mainPiece.defaultVelocity;
    } else if (e.code === "ArrowUp") {
        mainPiece.rotate();
    }
}

function releaseUserInput(e) {
    if (e.code === "ArrowDown" || e.code === "ArrowLeft" || e.code === "ArrowRight") {
        mainPiece.yvelocity = mainPiece.defaultVelocity;
        mainPiece.xvelocity = 0;
    }
}

function collisionDetection(mainPiece) {
    
}

// points/levels logic

// play/pause logic
// code //



// end of game logic
// code //

//board class
class Board {

    constructor() {
        this.grid = this.getClearBoard();
        this.pieces = []; // contains all Piece objects
    }

    resetBoard() {
        this.grid = this.getClearBoard()
    }

    getClearBoard() {
        return Array.from(
            {length: ROWS}, () => Array(COLS).fill(0)
          );
    }

    draw() { //renders pieces on board, called everytime a new piece needs to be rendered

    }

}

// classes


//main game logic

//board
let board = new Board();



