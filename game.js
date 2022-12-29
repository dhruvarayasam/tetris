"use strict"

//constants
var BLOCK_SIZE = 30;
var COLS = 10;
var ROWS = 20;

//canvas and context, defines default fill color to red and rows/cols, also scales ctx
var canvas = document.getElementById("gameCanvas");
canvas.height = BLOCK_SIZE * ROWS;
canvas.width = BLOCK_SIZE * COLS;

var ctx = canvas.getContext("2d");
ctx.fillStyle = "#FF0000"




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

    draw() { //renders pieces on board

    }

}

//piece class
class Piece { // responsible for supplying color, shape, and location of piece
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




}


//main game logic

//board
let board = new Board();

function playGame() {
    console.table(board.grid);
    ctx.fillRect(0, 0, 20, 20);
}

function reset() {
    board.resetBoard()
}



