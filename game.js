"use strict"

//constants
var BLOCK_SIZE = 30;
var COLS = 10;
var ROWS = 22;

//canvas and context, defines default fill color to red and rows/cols, also scales ctx
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "#FF0000"
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);


//board class

class Board {

    constructor() {
        this.grid = this.getClearBoard();
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

//piece class
class Piece {
    constructor() {
        this.x = 5;
        this.y = 0;
        this.color = this.chooseRandomPieceColor();
    }

    chooseRandomPieceColor() {
        let colorArray = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
        let num = Math.floor(Math.random() * 7)
        let color = colorArray[num];

        return color;
    }

    determineRandomShape(num) {

    }




}


//main game logic

//board
let board = new Board();

function playGame() {
    console.table(board.grid);
}

function reset() {
    board.resetBoard()
}

playGame()



