import { Board } from './board.js'
import { whitePieces, blackPieces } from './pieces.js'
class Player {
	constructor(color, pieces) {
		this.color = color
		this.pieces = pieces
		this.turn = 'white'
		this.inCheck = false
		this.checkMate = false
	}

	get player() {
		return Board.player
	}

	get opponent() {
		return Board.opponent
	}

	copyPieces() {
		this.pieces = [...this.pieces].map((piece) =>
			Object.assign(Object.create(Object.getPrototypeOf(piece)), piece)
		)
	}

	getAvailableMoves(chessBoard) {
		//////////// Copy chessBoard, players, and pieces ////////////
		let playerCopy = Object.assign(
			Object.create(Object.getPrototypeOf(this.player)),
			this.player
		)

		let opponentCopy = Object.assign(
			Object.create(Object.getPrototypeOf(this.opponent)),
			this.opponent
		)

		playerCopy.copyPieces()
		opponentCopy.copyPieces()

		const whitePlayer = playerCopy.color === 'white' ? playerCopy : opponentCopy
		const blackPlayer = playerCopy.color === 'black' ? playerCopy : opponentCopy

		this.checkMate = true
		opponentCopy.pieces.forEach((piece) => {
			piece.targets.forEach((target) => {
				let chessBoardCopy = Object.assign(
					Object.create(Object.getPrototypeOf(chessBoard)),
					chessBoard
				)
				playerCopy.copyPieces()

				chessBoardCopy.copyBoard(chessBoard)
				// may not need
				chessBoardCopy.copyTargets(chessBoard)
				// console.log(piece.targets, target)

				const validMove = piece.checkForValidMove(
					opponentCopy,
					chessBoardCopy,
					target
				)

				///////////////// change movePiece to include board argument ////////////////////
				if (validMove) {
					piece.movePiece(target, playerCopy, chessBoardCopy.boardCopy)
					// console.log('after move', chessBoardCopy.boardCopy)
					// it's marking board and not boardCopy
					chessBoardCopy.markEnemySquares(
						whitePlayer,
						blackPlayer,
						chessBoardCopy.boardCopy
					)
					////////////////////////////////////////////////////////
					// console.log(chessBoardCopy.whiteSquares)

					////////////////////////////// nf3 triggers checkmate //////////////////////////////
					// Check if player can escape check
					if (!opponentCopy.isKingInCheck(chessBoardCopy)) {
						// console.log('is escape', piece, target)
						this.checkMate = false
						// console.log('found an escape')
						// console.log('from player', playerCopy.isKingInCheck(chessBoardCopy))
						// if (opponentCopy.inCheck) console.log('target', target)
						if (playerCopy.inCheck) {
							// console.log('check', piece.name, target)
						}
					} else console.log('check', piece.name, target)
					// }

					// playerCopy.copyPieces()
					// opponentCopy.copyPieces()
				}
			})
		})
		// console.log(opponentCopy.pieces)
	}

	removePieceFromGame(enemyPiece) {
		this.pieces = this.pieces.filter((piece) => piece !== enemyPiece)
	}

	isKingInCheck({ whiteSquares, blackSquares }) {
		// Get King's position
		const { row, col } = this.pieces.find((piece) => piece.name === 'king')

		const enemySquares = this.color === 'white' ? blackSquares : whiteSquares

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

	// escapeCheckMoves() {
	// 	console.log(chessBoard)
	// }
}

const whitePlayer = new Player('white', whitePieces)
const blackPlayer = new Player('black', blackPieces)

export { whitePlayer, blackPlayer }
