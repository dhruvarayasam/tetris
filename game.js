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

    }

    getEmptyBoard() {

    }

    clearBoard() {

    }

}

//piece class

class Piece {

}



