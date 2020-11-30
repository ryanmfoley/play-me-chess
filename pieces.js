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

	movePiece(board, landingSquare) {
		this.removePieceFromSquare()
		this.changePosition(landingSquare.row, landingSquare.col)
		this.assignPieceToSquare()

		board.clearBoard()
		board.updateBoard()
		board.displayPieces()
	}

	printPiece() {
		console.log(this.piece)
	}
}

class Pawn extends Piece {
	constructor(color, piece, row, col) {
		super(color, piece, row, col)
	}

	checkForValidMove(landingSquare) {
		if (this.color === 'white') {
			if (
				(this.col === landingSquare.col &&
					!landingSquare.piece &&
					landingSquare.row === this.row - 1) ||
				(this.col === landingSquare.col &&
					this.row === 6 &&
					landingSquare.row === this.row - 2 &&
					!landingSquare.piece) ||
				// Check for capture of opponents piece
				(Math.abs(this.row - landingSquare.row) === 1 &&
					Math.abs(this.col - landingSquare.col) === 1 &&
					landingSquare.piece &&
					this.color !== landingSquare.piece.color)
			) {
				return true
			}
		} else {
			if (
				(this.col === landingSquare.col &&
					!landingSquare.piece &&
					landingSquare.row === this.row + 1) ||
				(this.col === landingSquare.col &&
					this.row === 1 &&
					landingSquare.row === this.row + 2 &&
					!landingSquare.piece) ||
				// Check for capture of opponents piece
				(Math.abs(this.row - landingSquare.row) === 1 &&
					Math.abs(this.col - landingSquare.col) === 1 &&
					landingSquare.piece &&
					this.color !== landingSquare.piece.color)
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
	checkForValidMove(landingSquare) {
		if (
			(Math.abs(this.row - landingSquare.row) === 1 &&
				Math.abs(this.col - landingSquare.col) === 2 &&
				this.color !== landingSquare.piece.color) ||
			(Math.abs(this.row - landingSquare.row) === 2 &&
				Math.abs(this.col - landingSquare.col) === 1 &&
				this.color !== landingSquare.piece.color)
		) {
			return true
		}
		return false
	}
}

class Bishop extends Piece {
	constructor(color, piece, row, col) {
		super(color, piece, row, col)
	}
	checkForValidMove(landingSquare) {
		// Get board
		const board = Board.board

		// Check movement direction
		const xDirection = landingSquare.col < this.col ? 'left' : 'right'
		const yDirection = landingSquare.row < this.row ? 'up' : 'down'
		let direction
		if (yDirection === 'up' && xDirection === 'left') direction = 'upLeft'
		if (yDirection === 'up' && xDirection === 'right') direction = 'upRight'
		if (yDirection === 'down' && xDirection === 'left') direction = 'downLeft'
		if (yDirection === 'down' && xDirection === 'right') direction = 'downRight'

		// Check if movement is diagonal
		if (
			Math.abs(this.row - landingSquare.row) ===
			Math.abs(this.col - landingSquare.col)
		) {
			// Check for piece in the way
			let isPieceInWay = false
			if (direction === 'upLeft') {
				let row = this.row - 1
				let col = this.col - 1
				for (; row > landingSquare.row; row--, col--) {
					if (board[row][col].piece) {
						isPieceInWay = true
					}
				}
			} else if (direction === 'upRight') {
				let row = this.row - 1
				let col = this.col + 1
				for (; row > landingSquare.row; row--, col++) {
					if (board[row][col].piece) {
						isPieceInWay = true
					}
				}
			} else if (direction === 'downLeft') {
				let row = this.row + 1
				let col = this.col - 1
				for (; row < landingSquare.row; row++, col--) {
					if (board[row][col].piece) {
						isPieceInWay = true
					}
				}
			} else if (direction === 'downRight') {
				let row = this.row + 1
				let col = this.col + 1
				for (; row < landingSquare.row; row++, col++) {
					if (board[row][col].piece) {
						isPieceInWay = true
					}
				}
			}

			if (!isPieceInWay && landingSquare.piece.color !== this.color) return true
		}
		return false
	}
}

class Rook extends Piece {
	constructor(color, piece, row, col) {
		super(color, piece, row, col)
	}
	checkForValidMove(landingSquare) {
		// Get board
		const board = Board.board

		// Check movement direction
		let direction
		if (landingSquare.col < this.col) {
			direction = 'left'
		} else if (landingSquare.col > this.col) {
			direction = 'right'
		} else if (landingSquare.row < this.row) {
			direction = 'up'
		} else if (landingSquare.row > this.row) direction = 'down'

		let isPieceInWay = false
		if (direction === 'left') {
			console.log('left')
			for (let i = this.col - 1; i > landingSquare.col; i--) {
				if (board[this.row][i].piece) {
					isPieceInWay = true
				}
			}
		} else if (direction === 'right') {
			console.log('right')
			for (let i = this.col + 1; i > landingSquare.col; i++) {
				if (board[this.row][i].piece) {
					isPieceInWay = true
				}
			}
		} else if (direction === 'up') {
			for (let i = this.row - 1; i > landingSquare.row; i--) {
				if (board[i][this.col].piece) {
					isPieceInWay = true
				}
			}
		} else if (direction === 'down') {
			console.log('down')
			for (let i = this.row + 1; i > landingSquare.row; i++) {
				if (board[i][this.col].piece) {
					isPieceInWay = true
				}
			}
			console.log(!isPieceInWay && landingSquare.piece.color !== this.color)
		}
		if (!isPieceInWay && landingSquare.piece.color !== this.color) return true
		return false
	}
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
