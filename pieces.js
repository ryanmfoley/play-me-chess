import { Board } from './board.js'

class Piece extends Board {
	constructor(color, name, row, col) {
		super()
		this.color = color
		this.name = name
		this.row = row
		this.col = col
	}

	removePieceFromSquare() {
		Board.board[this.row][this.col].color = ''
		Board.board[this.row][this.col].piece = ''
		Board.board[this.row][this.col].empty = true
	}

	changePosition(row, col) {
		this.row = row
		this.col = col
	}

	assignPieceToSquare() {
		Board.board[this.row][this.col].color = this.color
		Board.board[this.row][this.col].piece = this
		Board.board[this.row][this.col].empty = false
	}

	printPiece() {
		console.log(this.piece)
	}
}

class Pawn extends Piece {
	constructor(color, piece, row, col) {
		super(color, piece, row, col)
	}

	checkIfMoveIsValid(landingSquare) {
		if (this.color === 'white') {
			if (
				(this.col === landingSquare.col &&
					!landingSquare.piece &&
					landingSquare.row === this.row - 1) ||
				(this.row === 6 && landingSquare.row === this.row - 2)
			) {
				return true
			}
		} else {
			if (
				(this.col === landingSquare.col &&
					!landingSquare.piece &&
					landingSquare.row === this.row + 1) ||
				(this.row === 1 && landingSquare.row === this.row + 2)
			) {
				return true
			}
		}
		return false
	}
}

class Knight extends Piece {
	constructor(color, piece, row, col) {
		super(color, piece, row, col)
	}
	checkForValidMove() {}
}

class Bishop extends Piece {
	constructor(color, piece, row, col) {
		super(color, piece, row, col)
	}
	checkForValidMove() {}
}

class Rook extends Piece {
	constructor(color, piece, row, col) {
		super(color, piece, row, col)
	}
	checkForValidMove() {}
}

class Queen extends Piece {
	constructor(color, piece, row, col) {
		super(color, piece, row, col)
	}
	checkForValidMove() {}
}

class King extends Piece {
	constructor(color, piece, row, col) {
		super(color, piece, row, col)
	}
	checkForValidMove() {}
}

const whitePieces = []
const blackPieces = []

// Add pieces to whitePieces and blackPieces array
for (let color of ['white', 'black']) {
	for (let i = 0; i < 8; i++) {
		color === 'white'
			? whitePieces.push(new Pawn(color, 'pawn', 6, i))
			: blackPieces.push(new Pawn(color, 'pawn', 1, i))
	}
}

whitePieces.push(new Knight('white', 'knight', 7, 1))
whitePieces.push(new Knight('white', 'knight', 7, 6))
whitePieces.push(new Bishop('white', 'bishop', 7, 2))
whitePieces.push(new Bishop('white', 'bishop', 7, 5))
whitePieces.push(new Rook('white', 'rook', 7, 0))
whitePieces.push(new Rook('white', 'rook', 7, 7))
whitePieces.push(new Queen('white', 'queen', 7, 3))
whitePieces.push(new King('white', 'king', 7, 4))

blackPieces.push(new Knight('black', 'knight', 0, 1))
blackPieces.push(new Knight('black', 'knight', 0, 6))
blackPieces.push(new Bishop('black', 'bishop', 0, 2))
blackPieces.push(new Bishop('black', 'bishop', 0, 5))
blackPieces.push(new Rook('black', 'rook', 0, 0))
blackPieces.push(new Rook('black', 'rook', 0, 7))
blackPieces.push(new Queen('black', 'queen', 0, 3))
blackPieces.push(new King('black', 'king', 0, 4))

// Assign pieces to squares on board
const placePiecesOnBoard = () => {
	whitePieces.forEach((piece) => {
		piece.assignPieceToSquare()
	})

	blackPieces.forEach((piece) => {
		piece.assignPieceToSquare()
	})
}

export { placePiecesOnBoard, whitePieces, blackPieces }
