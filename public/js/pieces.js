import { Board } from './board.js'

class Piece {
	constructor(color, name, row, col) {
		this.color = color
		this.name = name
		this.row = row
		this.col = col
		this.targets = []
	}

	changePosition(row, col) {
		this.row = row
		this.col = col
	}

	removePieceFromSquare(board = Board.board) {
		board[this.row][this.col].color = ''
		board[this.row][this.col].piece = ''
		board[this.row][this.col].empty = true
	}

	assignPieceToSquare(board = Board.board) {
		board[this.row][this.col].color = this.color
		board[this.row][this.col].piece = this
		board[this.row][this.col].empty = false
	}

	movePiece(landingSquare, opponent, board = Board.board) {
		// Remove piece from square
		this.removePieceFromSquare(board)

		// If capture, remove piece from game
		if (landingSquare.piece && arguments.length === 2)
			opponent.removePieceFromGame(landingSquare.piece)

		// Move piece to new square
		this.changePosition(landingSquare.row, landingSquare.col)
		this.assignPieceToSquare(board)
	}

	clearTargetSquares() {
		this.targets = []
	}

	printPiece() {
		console.log(this.piece)
	}
}

class Pawn extends Piece {
	constructor(color, piece, row, col) {
		super(color, piece, row, col)
	}

	checkForValidMove(player, { board }, landingSquare) {
		// Check if move puts their king in check
		const startingSquare = this.color === 'white' ? 6 : 1
		const oneSquareUp = this.color === 'white' ? this.row - 1 : this.row + 1
		const twoSquaresUp = this.color === 'white' ? this.row - 2 : this.row + 2

		if (
			// Check if landingSquare is a valid move
			(this.col === landingSquare.col &&
				!landingSquare.piece &&
				landingSquare.row === oneSquareUp) ||
			(this.col === landingSquare.col &&
				this.row === startingSquare &&
				landingSquare.row === twoSquaresUp &&
				!landingSquare.piece) ||
			// Check for capture of opponents piece
			(Math.abs(this.row - landingSquare.row) === 1 &&
				Math.abs(this.col - landingSquare.col) === 1 &&
				landingSquare.piece &&
				this.color !== landingSquare.piece.color)
		) {
			return true
		}
		return false
	}

	markEnemySquares(board) {
		// Get targeted squares
		let row
		if (this.color === 'white') {
			row = this.row > 0 ? this.row - 1 : null
		} else {
			row = this.row < 7 ? this.row + 1 : null
		}

		const leftCol = this.col > 0 ? this.col - 1 : null
		const rightCol = this.col < 7 ? this.col + 1 : null

		// Add squares to targets array
		if (row) {
			if (leftCol !== null) this.targets.push(board[row][leftCol])
			if (rightCol !== null) this.targets.push(board[row][rightCol])
		}
	}
}

class Knight extends Piece {
	constructor(color, piece, row, col) {
		super(color, piece, row, col)
	}

	checkForValidMove(player, { board }, landingSquare) {
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

	markEnemySquares(board) {
		// Mark target squares
		for (let row = this.row - 2; row <= this.row + 2; row++) {
			for (let col = this.col - 2; col <= this.col + 2; col++) {
				if (
					(Math.abs(this.row - row) === 2 && Math.abs(this.col - col) === 1) ||
					(Math.abs(this.row - row) === 1 && Math.abs(this.col - col) === 2)
				) {
					if (row >= 0 && row <= 7 && col >= 0 && col <= 7) {
						this.targets.push(board[row][col])
					}
				}
			}
		}
	}
}

class Bishop extends Piece {
	constructor(color, piece, row, col) {
		super(color, piece, row, col)
	}

	checkForValidMove(player, { board }, landingSquare) {
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

	markEnemySquares(board) {
		// Mark target squares

		// Check upLeft direction
		let row = this.row - 1
		let col = this.col - 1
		for (; row >= 0 && col >= 0; row--, col--) {
			this.targets.push(board[row][col])
			if (board[row][col].piece) {
				break
			}
		}

		// Check upRight direction
		row = this.row - 1
		col = this.col + 1
		for (; row >= 0 && col <= 7; row--, col++) {
			this.targets.push(board[row][col])
			if (board[row][col].piece) {
				break
			}
		}

		// Check downLeft direction
		row = this.row + 1
		col = this.col - 1
		for (; row <= 7 && col >= 0; row++, col--) {
			this.targets.push(board[row][col])
			if (board[row][col].piece) {
				break
			}
		}

		// Check upLeft direction
		row = this.row + 1
		col = this.col + 1
		for (; row <= 7 && col <= 7; row++, col++) {
			this.targets.push(board[row][col])
			if (board[row][col].piece) {
				break
			}
		}
	}
}

class Rook extends Piece {
	constructor(color, piece, row, col) {
		super(color, piece, row, col)
	}

	checkForValidMove(player, { board }, landingSquare) {
		// Check movement direction
		let direction
		if (landingSquare.col < this.col && landingSquare.row === this.row) {
			direction = 'left'
		} else if (landingSquare.col > this.col && landingSquare.row === this.row) {
			direction = 'right'
		} else if (landingSquare.row < this.row && landingSquare.col === this.col) {
			direction = 'up'
		} else if (landingSquare.row > this.row && landingSquare.col === this.col)
			direction = 'down'

		let isPieceInWay = false
		if (direction === 'left') {
			for (let i = this.col - 1; i > landingSquare.col; i--) {
				if (board[this.row][i].piece) {
					isPieceInWay = true
				}
			}
		} else if (direction === 'right') {
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
			for (let i = this.row + 1; i > landingSquare.row; i++) {
				if (board[i][this.col].piece) {
					isPieceInWay = true
				}
			}
		}
		if (direction && !isPieceInWay && landingSquare.piece.color !== this.color)
			return true
		return false
	}

	markEnemySquares(board) {
		// Mark target squares

		// Check left direction
		for (let col = this.col - 1; col >= 0; col--) {
			this.targets.push(board[this.row][col])
			if (board[this.row][col].piece) {
				break
			}
		}

		// Check right direction
		for (let col = this.col + 1; col <= 7; col++) {
			this.targets.push(board[this.row][col])
			if (board[this.row][col].piece) {
				break
			}
		}

		// Check up direction
		for (let row = this.row - 1; row >= 0; row--) {
			this.targets.push(board[row][this.col])
			if (board[row][this.col].piece) {
				break
			}
		}

		// Check down direction
		for (let row = this.row + 1; row <= 7; row++) {
			this.targets.push(board[row][this.col])
			if (board[row][this.col].piece) {
				break
			}
		}
	}
}

class Queen extends Piece {
	constructor(color, piece, row, col) {
		super(color, piece, row, col)
	}

	checkForValidMove(player, { board }, landingSquare) {
		const checkBishopMove = () => {
			// Check movement direction
			const xDirection = landingSquare.col < this.col ? 'left' : 'right'
			const yDirection = landingSquare.row < this.row ? 'up' : 'down'
			let direction
			if (yDirection === 'up' && xDirection === 'left') direction = 'upLeft'
			if (yDirection === 'up' && xDirection === 'right') direction = 'upRight'
			if (yDirection === 'down' && xDirection === 'left') direction = 'downLeft'
			if (yDirection === 'down' && xDirection === 'right')
				direction = 'downRight'

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

				if (!isPieceInWay && landingSquare.piece.color !== this.color)
					return true
			}
		}
		const checkRookMove = () => {
			// Check movement direction
			let direction
			if (landingSquare.col < this.col && landingSquare.row === this.row) {
				direction = 'left'
			} else if (
				landingSquare.col > this.col &&
				landingSquare.row === this.row
			) {
				direction = 'right'
			} else if (
				landingSquare.row < this.row &&
				landingSquare.col === this.col
			) {
				direction = 'up'
			} else if (landingSquare.row > this.row && landingSquare.col === this.col)
				direction = 'down'

			let isPieceInWay = false
			if (direction === 'left') {
				for (let i = this.col - 1; i > landingSquare.col; i--) {
					if (board[this.row][i].piece) {
						isPieceInWay = true
					}
				}
			} else if (direction === 'right') {
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
				for (let i = this.row + 1; i > landingSquare.row; i++) {
					if (board[i][this.col].piece) {
						isPieceInWay = true
					}
				}
			}
			if (
				direction &&
				!isPieceInWay &&
				landingSquare.piece.color !== this.color
			)
				return true
			return false
		}
		return checkBishopMove() || checkRookMove()
	}

	markEnemySquares(board) {
		// Mark target squares
		const markBishopSquares = () => {
			// Check upLeft direction
			let row = this.row - 1
			let col = this.col - 1
			for (; row >= 0 && col >= 0; row--, col--) {
				this.targets.push(board[row][col])
				if (board[row][col].piece) {
					break
				}
			}

			// Check upRight direction
			row = this.row - 1
			col = this.col + 1
			for (; row >= 0 && col <= 7; row--, col++) {
				this.targets.push(board[row][col])
				if (board[row][col].piece) {
					break
				}
			}

			// Check downLeft direction
			row = this.row + 1
			col = this.col - 1
			for (; row <= 7 && col >= 0; row++, col--) {
				this.targets.push(board[row][col])
				if (board[row][col].piece) {
					break
				}
			}

			// Check upLeft direction
			row = this.row + 1
			col = this.col + 1
			for (; row <= 7 && col <= 7; row++, col++) {
				this.targets.push(board[row][col])
				if (board[row][col].piece) {
					break
				}
			}
		}

		const markRookSquares = () => {
			// Mark target squares

			// Check left direction
			for (let col = this.col - 1; col >= 0; col--) {
				this.targets.push(board[this.row][col])
				if (board[this.row][col].piece) {
					break
				}
			}

			// Check right direction
			for (let col = this.col + 1; col <= 7; col++) {
				this.targets.push(board[this.row][col])
				if (board[this.row][col].piece) {
					break
				}
			}

			// Check up direction
			for (let row = this.row - 1; row >= 0; row--) {
				this.targets.push(board[row][this.col])
				if (board[row][this.col].piece) {
					break
				}
			}

			// Check down direction
			for (let row = this.row + 1; row <= 7; row++) {
				this.targets.push(board[row][this.col])
				if (board[row][this.col].piece) {
					break
				}
			}
		}

		markBishopSquares()
		markRookSquares()

		// Check if king is threatened
		// this.targets.forEach((target) => {
		// 	if (target.piece.name === 'king' && target.piece.color != this.color) {
		// 		this.color === 'white'
		// 			? (whitePlayer.inCheck = true)
		// 			: (blackPlayer.inCheck = true)
		// 	}
		// })
	}
}

class King extends Piece {
	constructor(color, piece, row, col) {
		super(color, piece, row, col)
	}
	// maybe remove player argument
	checkForValidMove(player, chessBoard, landingSquare) {
		const enemySquares =
			this.color === 'white'
				? chessBoard.blackSquares.flat()
				: chessBoard.whiteSquares.flat()

		const isEnemySquare = enemySquares.find(
			(square) => square === landingSquare
		)

		if (
			Math.abs(this.row - landingSquare.row) <= 1 &&
			Math.abs(this.col - landingSquare.col) <= 1 &&
			landingSquare.color !== this.color &&
			!isEnemySquare
		) {
			return true
		}
		return false
	}

	markEnemySquares(board) {
		// Mark target squares
		let row = this.row > 0 ? this.row - 1 : null
		let col = this.col > 0 ? this.col - 1 : null
		for (; row <= this.row + 1; row++) {
			for (; col <= this.col + 1; col++) {
				if (row && col) {
					this.targets.push(board[row][col])
				}
			}
		}
	}
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
const placePiecesOnBoard = ({ board }) => {
	whitePieces.forEach((piece) => {
		piece.assignPieceToSquare(board)
	})

	blackPieces.forEach((piece) => {
		piece.assignPieceToSquare(board)
	})
}

export { placePiecesOnBoard, whitePieces, blackPieces }
