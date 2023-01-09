class Piece { // responsible for supplying color, shape, and location of piece
    constructor() {
        this.x = 0;
        this.y = 0;
        this.defaultVelocity = 1;
        this.yvelocity = this.defaultVelocity;
        this.xvelocity = 0;
        this.color = this.chooseRandomPieceColor();
        this.shape = this.determineShape()
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

let piece = new Piece();
let furthestRight = 0;

    for (let i = 0; i < piece.shape.length; i++) {
        for (let j = piece.shape[i].length-1; j > 0; j--) {
            if (piece.shape[i][j] > 0) {
                if (j > furthestRight) {
                    furthestRight = j;
                    rightLoc = [piece.x + j, piece.y + i]
                }
            }
        }
    }