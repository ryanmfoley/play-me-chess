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

	displayPieces() {
		this.board.forEach((row) =>
			row.forEach((square) => {
				let img
				switch (square.piece) {
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

	assignPieceToSquare(piece, column) {
		this.board[0][column].color = 'black'
		this.board[0][column].piece = piece
		this.board[7][column].color = 'white'
		this.board[7][column].piece = piece
	}

	setPieces() {
		// Assign pawns to squares
		for (const column of this.board[1]) {
			column.color = 'black'
			column.piece = 'pawn'
		}

		for (const column of this.board[6]) {
			column.color = 'white'
			column.piece = 'pawn'
		}

		// Assign pieces to squares
		this.assignPieceToSquare('knight', 1)
		this.assignPieceToSquare('knight', 6)
		this.assignPieceToSquare('bishop', 2)
		this.assignPieceToSquare('bishop', 5)
		this.assignPieceToSquare('rook', 0)
		this.assignPieceToSquare('rook', 7)
		this.assignPieceToSquare('queen', 3)
		this.assignPieceToSquare('king', 4)
	}

	printBoard() {
		console.log(this.board)
	}
}

const board = new Board()

export { Board, board }
