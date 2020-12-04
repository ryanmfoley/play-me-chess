import { whitePieces, blackPieces } from './pieces.js'

class Player {
	constructor(color, pieces) {
		this.color = color
		this.pieces = pieces
		this.inCheck = false
		this.checkMate = false
	}

	removePieceFromGame(enemyPiece) {
		this.pieces = this.pieces.filter((piece) => piece !== enemyPiece)
	}

	getKingsPosition() {
		this.kingsPosition = this.pieces.find((piece) => piece.name === 'king')
	}

	isKingInCheck(chessBoard) {
		this.getKingsPosition()

		let enemySquares = []

		enemySquares =
			this.color === 'white'
				? chessBoard.blackSquares.flat()
				: chessBoard.whiteSquares.flat()

		console.log(this.pieces)

		if (
			this.kingsPosition &&
			enemySquares.find(
				(square) =>
					this.kingsPosition.row === square.row &&
					this.kingsPosition.col === square.col
			)
		) {
			this.inCheck = true
		} else {
			this.inCheck = false
		}
	}
}

const whitePlayer = new Player('white', whitePieces)
const blackPlayer = new Player('black', blackPieces)

export { whitePlayer, blackPlayer }
