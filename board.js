function Cell(row, col) {
	this.row = row
	this.col = col
	this.color = ''
	this.piece = ''
	this.empty = true
	this.whiteSquares = []
	this.blackSquares = []
	this.cellBox = document.querySelectorAll(`.row-${row}`)[col]
}

class Board {
	constructor() {
		const board = new Array(8)
		for (let i = 0; i < 8; i++) {
			board[i] = new Array(8)
		}
		for (let row = 0; row < 8; row++) {
			for (let col = 0; col < 8; col++) {
				board[row][col] = new Cell(row, col)
			}
		}

		Board.board = board
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

	updateBoard() {
		this.board = Board.board
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

	markEnemySquares(chessBoard, whitePlayer, blackPlayer) {
		// Clear enemy squares
		whitePlayer.pieces.forEach((piece) => piece.clearTargetSquares())
		blackPlayer.pieces.forEach((piece) => piece.clearTargetSquares())

		// Mark enemy squares
		whitePlayer.pieces.forEach((piece) =>
			piece.markEnemySquares(chessBoard, whitePlayer, blackPlayer)
		)
		blackPlayer.pieces.forEach((piece) =>
			piece.markEnemySquares(chessBoard, whitePlayer, blackPlayer)
		)

		// Assign marked squares to board
		const whiteSquares = whitePlayer.pieces.map((piece) => piece.targets)
		const blackSquares = blackPlayer.pieces.map((piece) => piece.targets)
	}

	printBoard() {
		console.log(this.board)
	}
}

const chessBoard = new Board()

export { Board, chessBoard }
