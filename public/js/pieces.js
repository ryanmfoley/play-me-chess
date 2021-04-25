class Piece {
	constructor(color, name, row, col) {
		this.color = color
		this.name = name
		this.row = row
		this.col = col
		this.enPassant = false
		this.targets = []
	}

	changePosition({ row, col }) {
		this.row = row
		this.col = col
	}

	checkMove(player, opponent, chessBoard, landingSquare) {
		let { validMove, castle } = this.checkForValidMove(
			player,
			opponent,
			chessBoard,
			landingSquare
		)

		// Copy board, players, pieces, and targets //
		let chessBoardCopy = Object.assign(
			Object.create(Object.getPrototypeOf(chessBoard)),
			chessBoard
		)
		chessBoardCopy.copyBoard(chessBoard)

		const playerCopy = player.copyPlayer()
		const opponentCopy = opponent.copyPlayer()
		const selectedPiece = playerCopy.pieces.find(
			(pieceCopy) => pieceCopy.row === this.row && pieceCopy.col === this.col
		)

		// Check if player is in check after move //
		if (validMove)
			chessBoardCopy.movePiece(
				playerCopy,
				opponentCopy,
				selectedPiece,
				landingSquare
			)
		chessBoardCopy.markEnemySquares(playerCopy, opponentCopy)
		playerCopy.isKingInCheck(chessBoardCopy)

		if (
			playerCopy.inCheck ||
			(landingSquare.piece && landingSquare.piece.name === 'king')
		)
			validMove = false

		return { validMove, castle }
	}

	clearTargetSquares() {
		this.targets = []
	}
}

class Pawn extends Piece {
	constructor(color, piece, row, col) {
		super(color, piece, row, col)
	}

	checkForValidMove(player, opponent, chessBoard, landingSquare) {
		const castle = { validCastle: false }

		const startingSquare = this.color === 'white' ? 6 : 1
		const oneSquareUp = this.color === 'white' ? this.row - 1 : this.row + 1
		const twoSquaresUp = this.color === 'white' ? this.row - 2 : this.row + 2
		let validMove

		if (
			///////////////// Pawn advances one square forward /////////////////
			this.col === landingSquare.col &&
			!landingSquare.piece &&
			landingSquare.row === oneSquareUp
		) {
			validMove = true
		} else if (
			///////////////// Pawn advances two squares forward /////////////////
			this.col === landingSquare.col &&
			this.row === startingSquare &&
			landingSquare.row === twoSquaresUp &&
			!landingSquare.piece
		) {
			validMove = true
		} else if (
			///////////////// Pawn captures opponents piece /////////////////
			Math.abs(this.row - landingSquare.row) === 1 &&
			Math.abs(this.col - landingSquare.col) === 1 &&
			landingSquare.piece &&
			this.color !== landingSquare.piece.color
		) {
			validMove = true
		} else if (this.enPassant) {
			///////////////// Pawn makes an en passant capture /////////////////
			const enPassantPawn = opponent.pieces.find((piece) => piece.enPassant)
			const oneSquareDown =
				this.color === 'white' ? enPassantPawn.row - 1 : enPassantPawn.row + 1

			if (
				landingSquare.row === oneSquareDown &&
				landingSquare.col === enPassantPawn.col
			) {
				validMove = true
			}
		} else {
			validMove = false
		}

		return { validMove, castle }
	}

	markEnemySquares(board) {
		// Get targeted squares //
		let row
		if (this.color === 'white') {
			row = this.row > 0 ? this.row - 1 : null
		} else {
			row = this.row < 7 ? this.row + 1 : null
		}

		const leftCol = this.col > 0 ? this.col - 1 : null
		const rightCol = this.col < 7 ? this.col + 1 : null

		// Add squares to targets array //
		if (row !== null) {
			if (leftCol !== null) this.targets.push({ row, col: leftCol })
			if (rightCol !== null) this.targets.push({ row, col: rightCol })
		}
	}
}

class Knight extends Piece {
	constructor(color, piece, row, col) {
		super(color, piece, row, col)
	}

	checkForValidMove(player, opponent, chessBoard, landingSquare) {
		const castle = { validCastle: false }
		let validMove

		if (
			(Math.abs(this.row - landingSquare.row) === 1 &&
				Math.abs(this.col - landingSquare.col) === 2 &&
				this.color !== landingSquare.piece.color) ||
			(Math.abs(this.row - landingSquare.row) === 2 &&
				Math.abs(this.col - landingSquare.col) === 1 &&
				this.color !== landingSquare.piece.color)
		) {
			validMove = true
		} else validMove = false

		return { validMove, castle }
	}

	markEnemySquares(board) {
		// Mark target squares //
		for (let row = this.row - 2; row <= this.row + 2; row++) {
			for (let col = this.col - 2; col <= this.col + 2; col++) {
				if (
					(Math.abs(this.row - row) === 2 && Math.abs(this.col - col) === 1) ||
					(Math.abs(this.row - row) === 1 && Math.abs(this.col - col) === 2)
				) {
					if (row >= 0 && row <= 7 && col >= 0 && col <= 7) {
						this.targets.push({ row, col })
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

	checkForValidMove(player, opponent, chessBoard, landingSquare) {
		const castle = { validCastle: false }
		let validMove

		// Check if movement is diagonal
		if (
			Math.abs(this.row - landingSquare.row) ===
			Math.abs(this.col - landingSquare.col)
		) {
			// Check for piece in the way
			let isPieceInWay = false

			if (landingSquare.row < this.row && landingSquare.col < this.col) {
				let row = this.row - 1
				let col = this.col - 1
				for (
					;
					row > landingSquare.row && col > landingSquare.col;
					row--, col--
				) {
					if (chessBoard.board[row][col].piece) {
						isPieceInWay = true
					}
				}
			} else if (landingSquare.row < this.row && landingSquare.col > this.col) {
				let row = this.row - 1
				let col = this.col + 1
				for (
					;
					row > landingSquare.row && col < landingSquare.col;
					row--, col++
				) {
					if (chessBoard.board[row][col].piece) {
						isPieceInWay = true
					}
				}
			} else if (landingSquare.row > this.row && landingSquare.col < this.col) {
				let row = this.row + 1
				let col = this.col - 1
				for (
					;
					row < landingSquare.row && col > landingSquare.col;
					row++, col--
				) {
					if (chessBoard.board[row][col].piece) {
						isPieceInWay = true
					}
				}
			} else if (landingSquare.row > this.row && landingSquare.col > this.col) {
				let row = this.row + 1
				let col = this.col + 1
				for (
					;
					row < landingSquare.row && col < landingSquare.col;
					row++, col++
				) {
					if (chessBoard.board[row][col].piece) {
						isPieceInWay = true
					}
				}
			}

			if (!isPieceInWay && landingSquare.piece.color !== this.color) {
				validMove = true
			} else validMove = false
		}

		return { validMove, castle }
	}

	markEnemySquares(board) {
		// Mark target squares //

		// Check upLeft direction //
		let row = this.row - 1
		let col = this.col - 1
		for (; row >= 0 && col >= 0; row--, col--) {
			this.targets.push({ row, col })
			if (board[row][col].piece) {
				break
			}
		}

		// Check upRight direction //
		row = this.row - 1
		col = this.col + 1
		for (; row >= 0 && col <= 7; row--, col++) {
			this.targets.push({ row, col })
			if (board[row][col].piece) {
				break
			}
		}

		// Check downLeft direction //
		row = this.row + 1
		col = this.col - 1
		for (; row <= 7 && col >= 0; row++, col--) {
			this.targets.push({ row, col })
			if (board[row][col].piece) {
				break
			}
		}

		// Check upLeft direction //
		row = this.row + 1
		col = this.col + 1
		for (; row <= 7 && col <= 7; row++, col++) {
			this.targets.push({ row, col })
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

	checkForValidMove(player, opponent, chessBoard, landingSquare) {
		const castle = { validCastle: false }
		let validMove
		let isPieceInWay

		if (landingSquare.col < this.col && landingSquare.row === this.row) {
			for (let i = this.col - 1; i > landingSquare.col; i--) {
				if (chessBoard.board[this.row][i].piece) {
					isPieceInWay = true
				}
			}
			validMove = true
		} else if (landingSquare.col > this.col && landingSquare.row === this.row) {
			for (let i = this.col + 1; i < landingSquare.col; i++) {
				if (
					chessBoard.board[this.row][i] &&
					chessBoard.board[this.row][i].piece
				) {
					isPieceInWay = true
				}
			}
			validMove = true
		} else if (landingSquare.row < this.row && landingSquare.col === this.col) {
			for (let i = this.row - 1; i > landingSquare.row; i--) {
				if (chessBoard.board[i][this.col].piece) {
					isPieceInWay = true
				}
			}
			validMove = true
		} else if (landingSquare.row > this.row && landingSquare.col === this.col) {
			for (let i = this.row + 1; i < landingSquare.row; i++) {
				if (chessBoard.board[i][this.col].piece) {
					isPieceInWay = true
				}
			}
			validMove = true
		}
		if (
			validMove &&
			!isPieceInWay &&
			landingSquare.piece.color !== this.color
		) {
			validMove = true
		} else validMove = false

		return { validMove, castle }
	}

	markEnemySquares(board) {
		// Mark target squares //

		// Check left direction //
		for (let col = this.col - 1; col >= 0; col--) {
			this.targets.push({ row: this.row, col })
			if (board[this.row][col].piece) {
				break
			}
		}

		// Check right direction //
		for (let col = this.col + 1; col <= 7; col++) {
			this.targets.push({ row: this.row, col })
			if (board[this.row][col].piece) {
				break
			}
		}

		// Check up direction //
		for (let row = this.row - 1; row >= 0; row--) {
			this.targets.push({ row, col: this.col })
			if (board[row][this.col].piece) {
				break
			}
		}

		// Check down direction //
		for (let row = this.row + 1; row <= 7; row++) {
			this.targets.push({ row, col: this.col })
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

	checkForValidMove(player, opponent, chessBoard, landingSquare) {
		const castle = { validCastle: false }

		const checkBishopMove = () => {
			// Check if movement is diagonal //
			if (
				Math.abs(this.row - landingSquare.row) ===
				Math.abs(this.col - landingSquare.col)
			) {
				// Check for piece in the way //
				let isPieceInWay = false

				if (landingSquare.row < this.row && landingSquare.col < this.col) {
					let row = this.row - 1
					let col = this.col - 1
					for (
						;
						row > landingSquare.row && col > landingSquare.col;
						row--, col--
					) {
						if (chessBoard.board[row][col].piece) {
							isPieceInWay = true
						}
					}
				} else if (
					landingSquare.row < this.row &&
					landingSquare.col > this.col
				) {
					let row = this.row - 1
					let col = this.col + 1
					for (
						;
						row > landingSquare.row && col < landingSquare.col;
						row--, col++
					) {
						if (chessBoard.board[row][col].piece) {
							isPieceInWay = true
						}
					}
				} else if (
					landingSquare.row > this.row &&
					landingSquare.col < this.col
				) {
					let row = this.row + 1
					let col = this.col - 1
					for (
						;
						row < landingSquare.row && col > landingSquare.col;
						row++, col--
					) {
						if (chessBoard.board[row][col].piece) {
							isPieceInWay = true
						}
					}
				} else if (
					landingSquare.row > this.row &&
					landingSquare.col > this.col
				) {
					let row = this.row + 1
					let col = this.col + 1
					for (
						;
						row < landingSquare.row && col < landingSquare.col;
						row++, col++
					) {
						if (chessBoard.board[row][col].piece) {
							isPieceInWay = true
						}
					}
				}

				if (!isPieceInWay && landingSquare.piece.color !== this.color)
					return true
			}
			return false
		}

		const checkRookMove = () => {
			let validMove
			let isPieceInWay

			if (landingSquare.col < this.col && landingSquare.row === this.row) {
				for (let i = this.col - 1; i > landingSquare.col; i--) {
					if (chessBoard.board[this.row][i].piece) {
						isPieceInWay = true
					}
				}
				validMove = true
			} else if (
				landingSquare.col > this.col &&
				landingSquare.row === this.row
			) {
				for (let i = this.col + 1; i < landingSquare.col; i++) {
					if (
						chessBoard.board[this.row][i] &&
						chessBoard.board[this.row][i].piece
					) {
						isPieceInWay = true
					}
				}
				validMove = true
			} else if (
				landingSquare.row < this.row &&
				landingSquare.col === this.col
			) {
				for (let i = this.row - 1; i > landingSquare.row; i--) {
					if (chessBoard.board[i][this.col].piece) {
						isPieceInWay = true
					}
				}
				validMove = true
			} else if (
				landingSquare.row > this.row &&
				landingSquare.col === this.col
			) {
				for (let i = this.row + 1; i < landingSquare.row; i++) {
					if (chessBoard.board[i][this.col].piece) {
						isPieceInWay = true
					}
				}
				validMove = true
			}
			if (
				validMove &&
				!isPieceInWay &&
				landingSquare.piece.color !== this.color
			)
				return true
			return false
		}
		const validMove = checkBishopMove() || checkRookMove()

		return { validMove, castle }
	}

	markEnemySquares(board) {
		// Mark target squares //
		const markBishopSquares = () => {
			// Check upLeft direction //
			let row = this.row - 1
			let col = this.col - 1
			for (; row >= 0 && col >= 0; row--, col--) {
				this.targets.push({ row, col })
				if (board[row][col].piece) {
					break
				}
			}

			// Check upRight direction //
			row = this.row - 1
			col = this.col + 1
			for (; row >= 0 && col <= 7; row--, col++) {
				this.targets.push({ row, col })
				if (board[row][col].piece) {
					break
				}
			}

			// Check downLeft direction //
			row = this.row + 1
			col = this.col - 1
			for (; row <= 7 && col >= 0; row++, col--) {
				this.targets.push({ row, col })
				if (board[row][col].piece) {
					break
				}
			}

			// Check upLeft direction //
			row = this.row + 1
			col = this.col + 1
			for (; row <= 7 && col <= 7; row++, col++) {
				this.targets.push({ row, col })
				if (board[row][col].piece) {
					break
				}
			}
		}

		const markRookSquares = () => {
			// Mark target squares //

			// Check left direction //
			for (let col = this.col - 1; col >= 0; col--) {
				this.targets.push({ row: this.row, col })
				if (board[this.row][col].piece) {
					break
				}
			}

			// Check right direction //
			for (let col = this.col + 1; col <= 7; col++) {
				this.targets.push({ row: this.row, col })
				if (board[this.row][col].piece) {
					break
				}
			}

			// Check up direction //
			for (let row = this.row - 1; row >= 0; row--) {
				this.targets.push({ row, col: this.col })
				if (board[row][this.col].piece) {
					break
				}
			}

			// Check down direction //
			for (let row = this.row + 1; row <= 7; row++) {
				this.targets.push({ row, col: this.col })
				if (board[row][this.col].piece) {
					break
				}
			}
		}

		markBishopSquares()
		markRookSquares()
	}
}

class King extends Piece {
	constructor(color, piece, row, col) {
		super(color, piece, row, col)
	}

	checkForValidMove(player, opponent, chessBoard, landingSquare) {
		const enemySquares =
			this.color === 'white' ? chessBoard.blackSquares : chessBoard.whiteSquares

		const isEnemySquare = enemySquares.find(
			(square) => square === landingSquare
		)
		let direction
		if (this.color === 'white' && this.row === landingSquare.row) {
			direction = this.col < landingSquare.col ? 'right' : 'left'
		} else if (this.color === 'black' && this.row === landingSquare.row) {
			direction = this.col < landingSquare.col ? 'left' : 'right'
		}

		let castle = { validCastle: false }
		let isCastling
		let isPieceInWay
		let castlingThruCheck
		let validMove
		let rookMoved

		/////////////// Castling short ///////////////
		if (
			(this.color === 'white' &&
				direction === 'right' &&
				Math.abs(this.col - landingSquare.col) === 2) ||
			(this.color === 'black' &&
				direction === 'left' &&
				Math.abs(this.col - landingSquare.col) === 2)
		) {
			isCastling = true

			const shortCastlingSquares = chessBoard.board[this.row].slice(
				this.col + 1,
				landingSquare.col + 1
			)

			const rook = chessBoard.board[this.row][7].piece
			castle.rooksStartingSquare = { row: rook.row, col: 7 }
			castle.rooksLandingSquare = { row: rook.row, col: this.col + 1 }
			castle.rook = rook
			rookMoved = rook.moved

			// Check if king is castling through check //
			shortCastlingSquares.forEach((square) => {
				enemySquares.forEach((enemySquare) => {
					if (
						square.row === enemySquare.row &&
						square.col === enemySquare.col
					) {
						castlingThruCheck = true
					}
				})
			})

			// Check if shortCastlingSquares are free of pieces //
			shortCastlingSquares.forEach((square) => {
				if (square.piece) isPieceInWay = true
			})

			/////////////// Castling long ///////////////
		} else if (
			(this.color === 'white' &&
				direction === 'left' &&
				Math.abs(this.col - landingSquare.col) === 2) ||
			(this.color === 'black' &&
				direction === 'right' &&
				Math.abs(this.col - landingSquare.col) === 2)
		) {
			isCastling = true

			const longCastlingSquares = chessBoard.board[this.row].slice(
				landingSquare.col - 1,
				this.col
			)

			const rook = chessBoard.board[this.row][0].piece
			castle.rooksStartingSquare = { row: rook.row, col: 0 }
			castle.rooksLandingSquare = { row: rook.row, col: this.col - 1 }
			castle.rook = rook
			rookMoved = rook.moved

			// Check if king is castling through check //
			longCastlingSquares.forEach((square) => {
				enemySquares.forEach((enemySquare) => {
					if (
						square.row === enemySquare.row &&
						square.col === enemySquare.col
					) {
						castlingThruCheck = true
					}
				})
			})

			// Check if longCastlingSquares are free of pieces //
			longCastlingSquares.forEach((square) => {
				if (square.piece) isPieceInWay = true
			})
		}

		// Check for valid castle //
		if (
			!player.inCheck &&
			!this.moved &&
			!rookMoved &&
			castle.rook &&
			castle.rook.row === castle.rooksStartingSquare.row &&
			castle.rook.col === castle.rooksStartingSquare.col &&
			isCastling &&
			!isPieceInWay &&
			!castlingThruCheck
		) {
			castle.validCastle = true
			validMove = true
		}

		//////////////////////////////////////
		// Check for valid move //
		if (
			Math.abs(this.row - landingSquare.row) <= 1 &&
			Math.abs(this.col - landingSquare.col) <= 1 &&
			landingSquare.color !== this.color &&
			!isEnemySquare
		) {
			validMove = true
		}

		return { validMove, castle }
	}

	markEnemySquares(board) {
		// Mark target squares //
		let minRow = this.row - 1 >= 0 ? this.row - 1 : 0
		let maxRow = this.row + 1 <= 7 ? this.row + 1 : 7
		let minCol = this.col - 1 >= 0 ? this.col - 1 : 0
		let maxCol = this.col + 1 <= 7 ? this.col + 1 : 7

		for (let x = minRow; x <= maxRow; x++) {
			for (let y = minCol; y <= maxCol; y++) {
				if (this.row === x && this.col === y) {
				} else {
					this.targets.push({ row: x, col: y })
				}
			}
		}
	}
}

//______________________________________________________________
// Create Pieces

const whitePieces = []
const blackPieces = []

// Add pieces to whitePieces and blackPieces array //
for (let color of ['white', 'black']) {
	for (let i = 0; i < 8; i++) {
		color === 'white'
			? whitePieces.push(new Pawn('white', 'pawn', 6, i))
			: blackPieces.push(new Pawn('black', 'pawn', 1, i))
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

// Assign pieces to squares on board //
const placePiecesOnBoard = (chessBoard) => {
	whitePieces.forEach((piece) => {
		chessBoard.assignPieceToSquare(piece)
	})

	blackPieces.forEach((piece) => {
		chessBoard.assignPieceToSquare(piece)
	})
}

export { placePiecesOnBoard, whitePieces, blackPieces }
