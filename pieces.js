import { Board } from './board.js'

class Piece extends Board {
	constructor(color, piece, row, col) {
		super()
		this.color = color
		this.piece = piece
		this.row = row
		this.col = col
	}
}

class Pawn extends Piece {
	constructor(color, piece, row, col) {
		super(color, piece, row, col)
	}
}

const whitePieces = []
const blackPieces = []

for (let color of ['white', 'black']) {
	for (let i = 0; i < 8; i++) {
		color === 'white'
			? whitePieces.push(new Pawn(color, 'pawn', 6, i))
			: blackPieces.push(new Pawn(color, 'pawn', 1, i))
	}
}

export { whitePieces, blackPieces }
