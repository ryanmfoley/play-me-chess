function Cell(row, col) {
	this.row = row
	this.col = col
	this.color = ''
	this.piece = ''
	this.cellBox = document.querySelectorAll(`.row-${row}`)[col]
}

class Board {
	constructor() {
		this.board = new Array(8)
		for (let i = 0; i < 8; i++) {
			this.board[i] = new Array(8)
		}
		for (let row = 0; row < 8; row++) {
			for (let col = 0; col < 8; col++) {
				this.board[row][col] = new Cell(row, col)
			}
		}
		this.turn = 'white'
		this.boardPosition = []
		this.draw = false
		this.drawByRepetition = false
		this.staleMate = false
	}

	assignPieceToSquare(piece) {
		this.board[piece.row][piece.col].color = piece.color
		this.board[piece.row][piece.col].piece = piece
	}

	checkDraw() {
		const squares = this.board
			.map((row) => row.filter((square) => square.piece))
			.flat()

		this.draw = true
		let pawnCount = 0
		let whiteKnightCount = 0
		let blackKnightCount = 0
		let whiteBishopCount = 0
		let blackBishopCount = 0
		let rookCount = 0
		let queenCount = 0

		// Count pieces left on board //
		squares.forEach(({ piece }) => {
			switch (piece.name) {
				case 'pawn':
					pawnCount++
					break
				case 'knight':
					piece.color === 'white' ? whiteKnightCount++ : blackKnightCount++
					break
				case 'bishop':
					piece.color === 'white' ? whiteBishopCount++ : blackBishopCount++
					break
				case 'rook':
					rookCount++
					break
				case 'queen':
					queenCount++
					break
			}
		})

		if (
			// Check for insufficient material draw //
			pawnCount ||
			rookCount ||
			queenCount ||
			whiteBishopCount === 2 ||
			blackBishopCount === 2 ||
			(whiteKnightCount && whiteBishopCount) ||
			(blackKnightCount && blackBishopCount)
		) {
			this.draw = false
		}
	}

	checkThreefoldRepitition() {
		const currentPosition =
			JSON.stringify(
				this.board.map((row) =>
					row.map((square) => {
						const {
							piece: { name, color, row, col, enPassant, moved },
						} = square

						return {
							name,
							color,
							row,
							col,
							enPassant,
							moved,
						}
					})
				)
			) + this.turn

		this.boardPosition.push(currentPosition)

		const positionCount = this.boardPosition.reduce(
			(acc, val) => acc + (val === currentPosition),
			0
		)

		if (positionCount === 3) {
			this.drawByRepetition = true
		}
	}

	clearBoard() {
		this.board.forEach((row) =>
			row.forEach((square) => (square.cellBox.innerHTML = ''))
		)
	}

	copyBoard({ board }) {
		this.board = [...board].map((row) => [...row].map((cell) => ({ ...cell })))
	}

	displayPieces() {
		this.board.forEach((row) =>
			row.forEach((square) => {
				let img
				switch (square.piece.name) {
					case 'pawn':
						img = document.createElement('img')
						if (square.color === 'white') {
							img.src = './images/wp.svg'
							img.classList.add('piece')
						} else {
							img.src = './images/bp.svg'
							img.classList.add('piece', 'black-piece')
						}
						square.cellBox.innerHTML = ''
						square.cellBox.append(img)
						break
					case 'knight':
						img = document.createElement('img')
						if (square.color === 'white') {
							img.src = './images/wn.svg'
							img.classList.add('piece')
						} else {
							img.src = './images/bn.svg'
							img.classList.add('piece', 'black-piece')
						}
						square.cellBox.innerHTML = ''
						square.cellBox.append(img)
						break
					case 'bishop':
						img = document.createElement('img')
						if (square.color === 'white') {
							img.src = './images/wb.svg'
							img.classList.add('piece')
						} else {
							img.src = './images/bb.svg'
							img.classList.add('piece', 'black-piece')
						}
						square.cellBox.innerHTML = ''
						square.cellBox.append(img)
						break
					case 'rook':
						img = document.createElement('img')
						if (square.color === 'white') {
							img.src = './images/wr.svg'
							img.classList.add('piece')
						} else {
							img.src = './images/br.svg'
							img.classList.add('piece', 'black-piece')
						}
						square.cellBox.innerHTML = ''
						square.cellBox.append(img)
						break
					case 'queen':
						img = document.createElement('img')
						if (square.color === 'white') {
							img.src = './images/wq.svg'
							img.classList.add('piece')
						} else {
							img.src = './images/bq.svg'
							img.classList.add('piece', 'black-piece')
						}
						square.cellBox.innerHTML = ''
						square.cellBox.append(img)
						break
					case 'king':
						img = document.createElement('img')
						if (square.color === 'white') {
							img.src = './images/wk.svg'
							img.classList.add('piece')
						} else {
							img.src = './images/bk.svg'
							img.classList.add('piece', 'black-piece')
						}
						square.cellBox.innerHTML = ''
						square.cellBox.append(img)
						break
					default:
						square.cellBox.innerHTML = ''
				}
			})
		)

		return this
	}

	identifyCell(cell) {
		const square =
			cell.parentElement.classList.value === 'board'
				? cell.classList
				: cell.parentElement.classList
		const [row] = square[0].match(/\d+/)
		const [col] = square[1].match(/\d+/)

		return { row, col }
	}

	markEnemySquares(player, opponent) {
		// Clear enemy squares
		player.pieces.forEach((piece) => piece.clearTargetSquares())
		opponent.pieces.forEach((piece) => piece.clearTargetSquares())

		// Mark enemy squares
		player.pieces.forEach((piece) => piece.markEnemySquares(this.board))
		opponent.pieces.forEach((piece) => piece.markEnemySquares(this.board))

		// Assign marked squares to board
		this.whiteSquares =
			player.color === 'white'
				? player.pieces.map((piece) => piece.targets)
				: opponent.pieces.map((piece) => piece.targets)
		this.blackSquares =
			player.color === 'white'
				? opponent.pieces.map((piece) => piece.targets)
				: player.pieces.map((piece) => piece.targets)
	}

	markEnPassantPawns(selectedPiece) {
		const leftSquare =
			selectedPiece.color === 'white'
				? selectedPiece.col - 1
				: selectedPiece.col + 1
		const rightSquare =
			selectedPiece.color === 'white'
				? selectedPiece.col + 1
				: selectedPiece.col - 1

		if (
			this.board[selectedPiece.row][leftSquare] &&
			this.board[selectedPiece.row][leftSquare].piece &&
			this.board[selectedPiece.row][leftSquare].piece.color !==
				selectedPiece.color
		) {
			selectedPiece.enPassant = true
			this.board[selectedPiece.row][leftSquare].piece.enPassant = true
		}
		if (
			this.board[selectedPiece.row][rightSquare] &&
			this.board[selectedPiece.row][rightSquare].piece &&
			this.board[selectedPiece.row][rightSquare].piece.color !==
				selectedPiece.color
		) {
			selectedPiece.enPassant = true
			this.board[selectedPiece.row][rightSquare].piece.enPassant = true
		}
	}

	async movePiece(currentPlayer, opponent, piece, landingSquare) {
		const activePlayer =
			currentPlayer.color === this.turn ? opponent : currentPlayer
		const inActivePlayer =
			currentPlayer.color === this.turn ? currentPlayer : opponent
		const startingSquare = piece.row
		const backRank = this.turn === 'white' ? 7 : 0
		const promotePawn =
			piece.name === 'pawn' && backRank == landingSquare.row ? true : false

		// Remove piece from square //
		this.removePieceFromSquare(piece)

		////////////// Capture //////////////
		if (landingSquare.piece) {
			this.removePieceFromGame(inActivePlayer, landingSquare.piece)
		} else if (piece.enPassant) {
			const enPassantPiece =
				piece.color === 'white'
					? this.board[landingSquare.row + 1][landingSquare.col].piece
					: this.board[landingSquare.row - 1][landingSquare.col].piece

			if (enPassantPiece) {
				this.removePieceFromSquare(enPassantPiece)
				this.removePieceFromGame(inActivePlayer, enPassantPiece)
			}
		}

		piece.changePosition(landingSquare)
		this.assignPieceToSquare(piece)

		// Mark enemyEnemySquares //
		this.markEnemySquares(activePlayer, inActivePlayer)

		if (piece.name === 'king' || piece.name === 'rook') {
			piece.moved = true
		}

		// Reset enPassant //
		activePlayer.pieces.forEach((piece) => (piece.enPassant = false))
		inActivePlayer.pieces.forEach((piece) => (piece.enPassant = false))

		//////////////////// Check for en passant ////////////////////
		if (
			piece.name === 'pawn' &&
			Math.abs(startingSquare - landingSquare.row) === 2
		) {
			this.markEnPassantPawns(piece)
		}
	}

	removePieceFromGame(player, pieceToRemove) {
		player.pieces = player.pieces.filter(
			(piece) =>
				piece.row !== pieceToRemove.row || piece.col !== pieceToRemove.col
		)
	}

	removePieceFromSquare(piece) {
		this.board[piece.row][piece.col].color = ''
		this.board[piece.row][piece.col].piece = ''
	}

	selectSquare({ row, col }) {
		return this.board[row][col]
	}
}

const chessBoard = new Board()

export { Board, chessBoard }
