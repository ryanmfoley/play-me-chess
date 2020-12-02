import { whitePieces, blackPieces } from './pieces.js'

class Player {
	constructor(color, pieces) {
		this.color = color
		this.pieces = pieces
		this.inCheck = false
		this.checkMate = false
	}

	getKingsPosition() {
		this.kingPosition = this.pieces.find((piece) => piece.name === 'king')
	}

	isKingInCheck(enemySquares) {}
}

const whitePlayer = new Player('white', whitePieces)
const blackPlayer = new Player('black', blackPieces)

export { whitePlayer, blackPlayer }
