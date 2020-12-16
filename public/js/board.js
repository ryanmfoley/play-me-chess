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
		Board.board = new Array(8)
		for (let i = 0; i < 8; i++) {
			Board.board[i] = new Array(8)
		}
		for (let row = 0; row < 8; row++) {
			for (let col = 0; col < 8; col++) {
				Board.board[row][col] = new Cell(row, col)
			}
		}
		// may not need
		Board.markEnemySquares = this.markEnemySquares
	}

	// copyBoard() {
	// 	this.boardCopy = [...Board.board].map((row) =>
	// 		[...row].map((cell) => ({ ...cell }))
	// 	)
	// }

	copyBoard({ board }) {
		this.boardCopy = [...board].map((row) =>
			[...row].map((cell) => ({ ...cell }))
		)
	}

	// may not need
	copyTargets({ whiteSquares, blackSquares }) {
		this.whiteSquares = [...whiteSquares].map((cell) => ({ ...cell }))
		this.blackSquares = [...blackSquares].map((cell) => ({ ...cell }))
	}

	selectSquare(cell) {
		const cellRow = !!cell[0].src
			? cell[1].classList[0].match(/\d+/)
			: cell[0].classList[0].match(/\d+/)
		const cellCol = !!cell[0].src
			? cell[1].classList[1].match(/\d+/)
			: cell[0].classList[1].match(/\d+/)

		return this.board[cellRow][cellCol]
	}

	get board() {
		return Board.board
	}

	displayPieces() {
		this.board.forEach((row) =>
			row.forEach((square) => {
				let img
				switch (square.piece.name) {
					case 'pawn':
						img = document.createElement('img')
						img.src =
							square.color === 'white' ? './pieces/wp.svg' : './pieces/bp.svg'
						square.cellBox.innerHTML = ''
						square.cellBox.append(img)
						square.empty = false
						break
					case 'knight':
						img = document.createElement('img')
						img.src =
							square.color === 'white' ? './pieces/wn.svg' : './pieces/bn.svg'
						square.cellBox.innerHTML = ''
						square.cellBox.append(img)
						square.empty = false
						break
					case 'bishop':
						img = document.createElement('img')
						img.src =
							square.color === 'white' ? './pieces/wb.svg' : './pieces/bb.svg'
						square.cellBox.innerHTML = ''
						square.cellBox.append(img)
						square.empty = false
						break
					case 'rook':
						img = document.createElement('img')
						img.src =
							square.color === 'white' ? './pieces/wr.svg' : './pieces/br.svg'
						square.cellBox.innerHTML = ''
						square.cellBox.append(img)
						square.empty = false
						break
					case 'queen':
						img = document.createElement('img')
						img.src =
							square.color === 'white' ? './pieces/wq.svg' : './pieces/bq.svg'
						square.cellBox.innerHTML = ''
						square.cellBox.append(img)
						square.empty = false
						break
					case 'king':
						img = document.createElement('img')
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

	markEnemySquares(whitePlayer, blackPlayer, board = this.board) {
		// Clear enemy squares
		whitePlayer.pieces.forEach((piece) => piece.clearTargetSquares())
		blackPlayer.pieces.forEach((piece) => piece.clearTargetSquares())

		// Mark enemy squares
		// whitePlayer.pieces.forEach((piece) => piece.markEnemySquares(this.board))
		// blackPlayer.pieces.forEach((piece) => piece.markEnemySquares(this.board))
		whitePlayer.pieces.forEach((piece) => piece.markEnemySquares(board))
		blackPlayer.pieces.forEach((piece) => piece.markEnemySquares(board))

		// Assign marked squares to board
		this.whiteSquares = whitePlayer.pieces.map((piece) => piece.targets).flat()
		this.blackSquares = blackPlayer.pieces.map((piece) => piece.targets).flat()
		Board.whiteSquares = whitePlayer.pieces.map((piece) => piece.targets).flat()
		Board.blackSquares = blackPlayer.pieces.map((piece) => piece.targets).flat()
	}

	// get whiteSquares() {
	// 	return Board.whiteSquares
	// }

	// get blackSquares() {
	// 	return Board.blackSquares
	// }

	printBoard() {
		console.log(this.board)
	}
}

const chessBoard = new Board()

export { Board, chessBoard }
