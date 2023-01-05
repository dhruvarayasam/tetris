

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
var collisionBool = false;

class Piece { // responsible for supplying color, shape, and location of piece
    constructor() {
        this.x = 4;
        this.y = 1;
        this.defaultVelocity = 1;
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


}

var mainPiece = new Piece();
var board = new Board();

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
    setInterval(update, 1000/10)
    // update()
}

pauseFunc = function() {
    playStatus = false;
}

resetBoard = function() {
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

function generateNewPieceCond() { // determines whether new piece should be generated or not
    // new piece should be generated when:
    // when the first piece (piece you start the game with) or when any piece after is set in its position

    return false;
    
}

// movement logic
function constantMovement() {
    let yOperation = mainPiece.y + mainPiece.yvelocity
    let xOperation = mainPiece.x + mainPiece.xvelocity;

    if (!collisionDetection(xOperation, yOperation)) {
        mainPiece.x = xOperation;
        mainPiece.y = yOperation;
    }
    renderPiece(mainPiece)

}

function userInput(e) {
    if (e.code === "ArrowDown" ) {
        mainPiece.yvelocity = mainPiece.defaultVelocity + 2;
        mainPiece.xvelocity = 0;
    } else if (e.code === "ArrowLeft") {
        mainPiece.yvelocity = 0;
        mainPiece.xvelocity = -mainPiece.defaultVelocity;
    } else if (e.code === "ArrowRight") {
        mainPiece.yvelocity = 0;
        mainPiece.xvelocity = mainPiece.defaultVelocity;
    } 
    
    else if (e.code === "ArrowUp") {
        mainPiece.rotate();
    }
}

function releaseUserInput(e) {
    if (e.code === "ArrowDown" || e.code === "ArrowLeft" || e.code === "ArrowRight") {
        mainPiece.yvelocity = mainPiece.defaultVelocity;
        mainPiece.xvelocity = 0;
    }
}

function collisionDetection(x, y) {
    console.log(x, y)
    if (x > COLS) {
        return true;
    } if (x === 0) {
        return true;
    } if (y === 0) {
        return true;
    } if (y > ROWS) {
        return true;
    }

    return false;
}

// points/levels logic

// play/pause logic
// code //



// end of game logic
// code //

// classes


//main game logic

function renderAllPieces() { // renders pieces that are stillon the board

}





