function Cell(row, col) {
	this.row = row
	this.col = col
	this.color = ''
	this.piece = ''
	this.empty = true
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
	}

	copyBoard({ board }) {
		this.board = [...board].map((row) => [...row].map((cell) => ({ ...cell })))
	}

	identifyCell(cell) {
		const square =
			cell.parentElement.classList.value === 'board'
				? cell.classList
				: cell.parentElement.classList
		const [cellRow] = square[0].match(/\d+/)
		const [cellCol] = square[1].match(/\d+/)

		return { cellRow, cellCol }
	}

	selectSquare({ cellRow, cellCol }) {
		return this.board[cellRow][cellCol]
	}

	removePieceFromSquare(piece) {
		this.board[piece.row][piece.col].color = ''
		this.board[piece.row][piece.col].piece = ''
		this.board[piece.row][piece.col].empty = true
	}

	assignPieceToSquare(piece) {
		this.board[piece.row][piece.col].color = piece.color
		this.board[piece.row][piece.col].piece = piece
		this.board[piece.row][piece.col].empty = false
	}

	movePiece(piece, landingSquare, opponent) {
		// Remove piece from square
		this.removePieceFromSquare(piece)

		// If capture, remove piece from game
		if (landingSquare.piece) opponent.removePieceFromGame(landingSquare.piece)

		// piece.changePosition(landingSquare.row, landingSquare.col)
		piece.changePosition(landingSquare)
		this.assignPieceToSquare(piece)
	}

	displayPieces() {
		this.board.forEach((row) =>
			row.forEach((square) => {
				let img
				switch (square.piece.name) {
					case 'pawn':
						img = document.createElement('img')
						// img.src =
						// 	square.color === 'white' ? './pieces/wp.svg' : './pieces/bp.svg'
						if (square.color === 'white') {
							img.src = './pieces/wp.svg'
						} else {
							img.src = './pieces/bp.svg'
							img.classList.add('black-pieces')
						}
						square.cellBox.innerHTML = ''
						square.cellBox.append(img)
						square.empty = false
						break
					case 'knight':
						img = document.createElement('img')
						// img.src =
						// 	square.color === 'white' ? './pieces/wn.svg' : './pieces/bn.svg'
						if (square.color === 'white') {
							img.src = './pieces/wn.svg'
						} else {
							img.src = './pieces/bn.svg'
							img.classList.add('black-pieces')
						}
						square.cellBox.innerHTML = ''
						square.cellBox.append(img)
						square.empty = false
						break
					case 'bishop':
						img = document.createElement('img')
						// img.src =
						// 	square.color === 'white' ? './pieces/wb.svg' : './pieces/bb.svg'
						if (square.color === 'white') {
							img.src = './pieces/wb.svg'
						} else {
							img.src = './pieces/bb.svg'
							img.classList.add('black-pieces')
						}
						square.cellBox.innerHTML = ''
						square.cellBox.append(img)
						square.empty = false
						break
					case 'rook':
						img = document.createElement('img')
						// img.src =
						// 	square.color === 'white' ? './pieces/wr.svg' : './pieces/br.svg'
						if (square.color === 'white') {
							img.src = './pieces/wr.svg'
						} else {
							img.src = './pieces/br.svg'
							img.classList.add('black-pieces')
						}
						square.cellBox.innerHTML = ''
						square.cellBox.append(img)
						square.empty = false
						break
					case 'queen':
						img = document.createElement('img')
						// img.src =
						// 	square.color === 'white' ? './pieces/wq.svg' : './pieces/bq.svg'
						if (square.color === 'white') {
							img.src = './pieces/wq.svg'
						} else {
							img.src = './pieces/bq.svg'
							img.classList.add('black-pieces')
						}
						square.cellBox.innerHTML = ''
						square.cellBox.append(img)
						square.empty = false
						break
					case 'king':
						img = document.createElement('img')
						// img.src =
						// 	square.color === 'white' ? './pieces/wk.svg' : './pieces/bk.svg'
						if (square.color === 'white') {
							img.src = './pieces/wk.svg'
						} else {
							img.src = './pieces/bk.svg'
							img.classList.add('black-pieces')
						}
						img.src =
							square.color === 'white' ? './pieces/wk.svg' : './pieces/bk.svg'
						square.cellBox.innerHTML = ''
						square.cellBox.append(img)
						square.empty = false
						break
					default:
						square.cellBox.innerHTML = ''
						square.empty = true
				}
			})
		)
	}

	clearBoard() {
		this.board.forEach((row) =>
			row.forEach((square) => (square.cellBox.innerHTML = ''))
		)
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
}

const chessBoard = new Board()

export { Board, chessBoard }
