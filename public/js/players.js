import { whitePieces, blackPieces } from './pieces.js'

class Player {
	constructor(color, pieces) {
		this.color = color
		this.pieces = pieces
		this.turn = 'white'
		this.inCheck = false
		this.checkMate = false
		this.copyPieces()
	}

	get kingSquare() {
		return this.pieces.find((piece) => piece.name === 'king')
	}

	copyPieces() {
		this.sparePieces = [...this.pieces].map((piece) =>
			Object.assign(Object.create(Object.getPrototypeOf(piece)), piece)
		)
	}

	copyPlayer(player) {
		const playerCopy = Object.assign(
			Object.create(Object.getPrototypeOf(player)),
			player
		)
		playerCopy.pieces = [...player.pieces].map((piece) =>
			Object.assign(Object.create(Object.getPrototypeOf(piece)), piece)
		)

		return playerCopy
	}

	getAvailableMoves(chessBoard, opponent) {
		this.checkMate = true
		const { pieces } = this.copyPlayer(this)
		const promotionPieces = ['knight', 'bishop', 'rook', 'queen']

		// Evaluate check after every possible move
		pieces.forEach((piece) => {
			// Add all squares for possible pawn moves //
			if (piece.name === 'pawn') piece.targets = chessBoard.board.flat()

			// Add castling squares for king //
			// do I need !piece.moved //
			if (piece.name === 'king' && !piece.moved) {
				piece.targets.push(chessBoard.board[piece.row][piece.col - 2])
				piece.targets.push(chessBoard.board[piece.row][piece.col + 2])
			}

			piece.targets.forEach((target) => {
				// Copy board, players, pieces, and targets //
				let chessBoardCopy = Object.assign(
					Object.create(Object.getPrototypeOf(chessBoard)),
					chessBoard
				)
				chessBoardCopy.copyBoard(chessBoard)
				const playerCopy = this.copyPlayer(this)
				const opponentCopy = this.copyPlayer(opponent)
				const selectedPiece = playerCopy.pieces.find(
					(pieceCopy) =>
						pieceCopy.row === piece.row && pieceCopy.col === piece.col
				)
				const targetCopy = { ...target }
				const backRank = this.color === 'white' ? 7 : 0
				const promotePawn =
					selectedPiece.name === 'pawn' && backRank == targetCopy.row
						? true
						: false

				const { validMove, castle } = piece.checkMove(
					playerCopy,
					opponentCopy,
					chessBoardCopy,
					targetCopy
				)

				/////////////// Move piece if move is valid ///////////////
				if (validMove) {
					if (castle.validCastle) {
						chessBoardCopy.movePiece(
							playerCopy,
							opponentCopy,
							selectedPiece,
							targetCopy
						)
						chessBoardCopy.movePiece(
							playerCopy,
							opponentCopy,
							castle.rook,
							castle.rooksLandingSquare
						)
					} else {
						chessBoardCopy.movePiece(
							playerCopy,
							opponentCopy,
							selectedPiece,
							targetCopy
						)
					}

					//////////////////// Check for pawn promotion ////////////////////
					if (promotePawn) {
						promotionPieces.forEach((promotionPiece) => {
							////////////// something wrong ///////////////
							const newPiece = playerCopy.promotePawn(selectedPiece, {
								color: this.color,
								piece: promotionPiece,
							})

							chessBoard.movePiece(
								playerCopy,
								opponentCopy,
								selectedPiece,
								targetCopy
							)

							// currentPlayer.color === turn
							// 	? chessBoard.movePiece(
							// 			playerCopy,
							// 			opponentCopy,
							// 			selectedPiece,
							// 			landingSquare
							// 	  )
							// 	: chessBoard.movePiece(
							// 			opponentCopy,
							// 			playerCopy,
							// 			selectedPiece,
							// 			landingSquare
							// 	  )

							chessBoardCopy.markEnemySquares(playerCopy, opponentCopy)
							playerCopy.isKingInCheck(chessBoardCopy)

							if (!playerCopy.inCheck) this.checkMate = false
						})
					} else {
						chessBoardCopy.markEnemySquares(playerCopy, opponentCopy)
						playerCopy.isKingInCheck(chessBoardCopy)
					}

					// Check if player can escape check //
					if (!playerCopy.inCheck) this.checkMate = false
				}
			})
		})
	}

	getPromotedPiece(socket) {
		return new Promise((resolve) => {
			socket.on('promotePawn', (result) => {
				socket.off('promotePawn')
				resolve(result)
			})
		})
	}

	isKingInCheck({ whiteSquares, blackSquares }) {
		const enemySquares =
			this.color === 'white' ? blackSquares.flat() : whiteSquares.flat()

		// Get King's position //
		const { row, col } = this.kingSquare

		if (
			enemySquares.find((square) => row === square.row && col === square.col)
		) {
			this.inCheck = true
		} else this.inCheck = false
	}

	promotePawn(pawn, { color, piece }) {
		const sparePiece = this.sparePieces.find(
			(sparePiece) => sparePiece.name === piece
		)
		const newPiece = Object.assign(
			Object.create(Object.getPrototypeOf(sparePiece)),
			sparePiece
		)
		newPiece.row = pawn.row
		newPiece.col = pawn.col

		const index = this.pieces.indexOf(pawn)
		this.pieces[index] = newPiece

		return newPiece
	}

	selectPieceModal() {
		const knight = document.createElement('img')
		if (this.color === 'white') {
			knight.src = './images/wn.svg'
			knight.setAttribute('data-piece', 'knight')
		} else {
			knight.src = './images/bn.svg'
			knight.classList.add('black-pieces')
			knight.setAttribute('data-piece', 'knight')
		}
		promoteModal.innerHTML = ''
		promoteModal.append(knight)

		const bishop = document.createElement('img')
		if (this.color === 'white') {
			bishop.src = './images/wb.svg'
			bishop.setAttribute('data-piece', 'bishop')
		} else {
			bishop.src = './images/bb.svg'
			bishop.classList.add('black-pieces')
			bishop.setAttribute('data-piece', 'bishop')
		}
		promoteModal.append(bishop)

		const rook = document.createElement('img')
		if (this.color === 'white') {
			rook.src = './images/wr.svg'
			rook.setAttribute('data-piece', 'rook')
		} else {
			rook.src = './images/br.svg'
			rook.classList.add('black-pieces')
			rook.setAttribute('data-piece', 'rook')
		}
		promoteModal.append(rook)

		const queen = document.createElement('img')
		if (this.color === 'white') {
			queen.src = './images/wq.svg'
			queen.setAttribute('data-piece', 'queen')
		} else {
			queen.src = './images/bq.svg'
			queen.classList.add('black-pieces')
			queen.setAttribute('data-piece', 'queen')
		}
		promoteModal.append(queen)
		setTimeout(function () {
			promoteModal.style.visibility = 'visible'
		}, 300)

		return new Promise((resolve) => {
			promoteModal.addEventListener('click', (e) => {
				const newPiece = {
					color: this.color,
					piece: e.target.dataset.piece,
				}
				promoteModal.style.visibility = 'hidden'
				resolve(newPiece)
			})
		})
	}
}

const whitePlayer = new Player('white', whitePieces)
const blackPlayer = new Player('black', blackPieces)

export { whitePlayer, blackPlayer }
