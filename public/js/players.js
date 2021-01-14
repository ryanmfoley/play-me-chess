import { whitePieces, blackPieces } from './pieces.js'

class Player {
	constructor(color, pieces) {
		this.color = color
		this.pieces = pieces
		this.turn = 'white'
		this.inCheck = false
		this.checkMate = false
	}

	copyPlayer(player) {
		const playerCopy = Object.assign(
			Object.create(Object.getPrototypeOf(player)),
			player
		)
		// may not need
		playerCopy.pieces = [...player.pieces].map((piece) =>
			Object.assign(Object.create(Object.getPrototypeOf(piece)), piece)
		)

		return playerCopy
	}

	// Do I need?
	copyTargets({ whiteSquares, blackSquares }) {
		const whiteSquaresCopy = [...whiteSquares].map((cell) => ({ ...cell }))
		const blackSquaresCopy = [...blackSquares].map((cell) => ({ ...cell }))

		return { whiteSquaresCopy, blackSquaresCopy }
	}

	getAvailableMoves(chessBoard, opponent) {
		this.checkMate = true

		this.pieces.forEach((piece) =>
			piece.targets.forEach((target) => {
				// Copy board, players, pieces, and targets
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

				const validMove = piece.checkForValidMove(
					opponentCopy,
					chessBoardCopy,
					targetCopy
				)

				if (validMove) {
					// console.log(
					// 	'before move',
					// 	chessBoardCopy,
					// 	playerCopy,
					// 	opponentCopy,
					// 	selectedPiece,
					// 	targetCopy
					// )

					// pieceCopy may be a problem
					chessBoardCopy.movePiece(selectedPiece, targetCopy, playerCopy)

					// console.log(
					// 	'after move',
					// 	chessBoardCopy,
					// 	playerCopy,
					// 	opponentCopy,
					// 	selectedPiece,
					// 	targetCopy
					// )

					// it's marking board and not boardCopy
					chessBoardCopy.markEnemySquares(playerCopy, opponentCopy)

					// Check if player can escape check
					if (!playerCopy.isKingInCheck(chessBoardCopy)) {
						// console.log('can escape', selectedPiece, targetCopy)
						this.checkMate = false
						// console.log('from player', playerCopy.isKingInCheck(chessBoardCopy))
						// if (opponentCopy.inCheck) console.log('target', target)
					} else {
						// console.log("can't escape", selectedPiece, targetCopy)
					}
				}
			})
		)
	}

	removePieceFromGame(enemyPiece) {
		// this.lastPieceRemoved = enemyPiece
		this.pieces = this.pieces.filter((piece) => piece !== enemyPiece)
	}

	isKingInCheck({ whiteSquares, blackSquares }) {
		const enemySquares =
			this.color === 'white' ? blackSquares.flat() : whiteSquares.flat()

		// Get King's position
		const { row, col } = this.pieces.find((piece) => piece.name === 'king')

		if (
			// this.kingsPosition &&
			enemySquares.find((square) => row === square.row && col === square.col)
		) {
			this.inCheck = true
			return true
		} else {
			this.inCheck = false
			return false
		}
	}
}

const whitePlayer = new Player('white', whitePieces)
const blackPlayer = new Player('black', blackPieces)

export { whitePlayer, blackPlayer }
