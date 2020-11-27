function Cell(row, col) {
	this.row = row
	this.col = col
	this.color = ''
	this.piece = ''
	this.empty = true
	this.cellBox = document.querySelectorAll(`.row-${row}`)[col]
}

// Create Board
const build2DArray = () => {
	const arr = new Array(8)
	for (let i = 0; i < 8; i++) {
		arr[i] = new Array(8)
	}
	return arr
}

// Create and add cell objects to the 2D grid array
const setupGrid = () => {
	const board = build2DArray(8, 8)
	for (let row = 0; row < 8; row++) {
		for (let col = 0; col < 8; col++) {
			board[row][col] = new Cell(row, col)
		}
	}
	return board
}

const assignPiecesToSquares = (board) => {
	// Create function to assign pawns to squares
	const assignPawns = () => {
		for (const column of board[1]) {
			column.color = 'black'
			column.piece = 'pawn'
		}
		for (const column of board[6]) {
			column.color = 'white'
			column.piece = 'pawn'
		}
	}

	// Create function to assign pieces to squares
	const assignPiece = (piece, column) => {
		board[0][column].color = 'black'
		board[0][column].piece = piece
		board[7][column].color = 'white'
		board[7][column].piece = piece
	}

	// Assign pawns to squares
	assignPawns()

	// Assign pieces to squares
	assignPiece('knight', 1)
	assignPiece('knight', 6)
	assignPiece('bishop', 2)
	assignPiece('bishop', 5)
	assignPiece('rook', 0)
	assignPiece('rook', 7)
	assignPiece('queen', 3)
	assignPiece('king', 4)

	return board
}

// Create function that places the pieces on the board
const displayPieces = (board) => {
	board.forEach((row) =>
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

// Create a function that clears the board
const clearBoard = (board) => {
	board.forEach((row) =>
		row.forEach((square) => (square.cellBox.innerHTML = ''))
	)
}

export {
	build2DArray,
	setupGrid,
	assignPiecesToSquares,
	displayPieces,
	clearBoard,
}
