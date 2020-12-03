import { whitePieces, blackPieces } from './pieces.js'

class Player {
	constructor(color, pieces) {
		this.color = color
		this.pieces = pieces
		this.inCheck = false
		this.checkMate = false
	}

	removePieceFromGame(enemyPiece) {
		this.pieces = this.pieces.filter(
			(piece) => piece.row !== enemyPiece.row && piece.col !== enemyPiece.col
		)
	}

	getKingsPosition() {
		this.kingsPosition = this.pieces.find((piece) => piece.name === 'king')
	}

	isKingInCheck(chessBoard) {
		this.getKingsPosition()

		let enemySquares = []

		let myArr = chessBoard.whiteSquares.flat()
		// console.log(myArr)
		// myArr.forEach((arr) => console.log(arr))

		enemySquares =
			this.color === 'white'
				? chessBoard.blackSquares.flat()
				: chessBoard.whiteSquares.flat()

		// enemySquares.forEach((square) => {
		// 	if (
		// 		this.kingsPosition.row === square.row &&
		// 		this.kingsPosition.col === square.col
		// 	) {
		// 		console.log('found king', square.row, square.col)
		// 	}
		// })
		// console.log(this.color, enemySquares)
		// console.log(chessBoard.whiteSquares.flat())

		if (
			enemySquares.find(
				(square) =>
					this.kingsPosition.row === square.row &&
					this.kingsPosition.col === square.col
			)
		) {
			// console.log('found king')
			this.inCheck = true
		} else {
			this.inCheck = false
		}
	}
}

const whitePlayer = new Player('white', whitePieces)
const blackPlayer = new Player('black', blackPieces)

export { whitePlayer, blackPlayer }
