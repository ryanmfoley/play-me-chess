function Cell(row, col) {
	this.row = row
	this.col = col
	this.piece = ''
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
			column.piece = 'pawn'
		}
		for (const column of board[6]) {
			column.piece = 'pawn'
		}
	}

	// Create function to assign pieces to squares
	const assignPiece = (piece, column) => {
		board[0][column].piece = piece
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

const setupBoard = (board) => {
	// Create function that places pawns on the board
	const placePawns = (color, row) => {
		for (const col of board[row]) {
			const pawn = document.createElement('img')
			pawn.src = color === 'white' ? './pieces/wp.svg' : './pieces/bp.svg'
			col.cellBox.append(pawn)
		}
	}

	// Create function that places the major pieces on the board
	const placePieces = (color) => {
		board.forEach((row) =>
			row.forEach((square) => {
				let img
				switch (square.piece) {
					case 'pawn':
						img = document.createElement('img')
						img.src = square.row > 5 ? './pieces/wp.svg' : './pieces/bp.svg'
						square.cellBox.append(img)
						break
					case 'knight':
						img = document.createElement('img')
						img.src = square.row > 5 ? './pieces/wk.svg' : './pieces/bk.svg'
						square.cellBox.append(img)
						break
					case 'bishop':
						img = document.createElement('img')
						img.src = square.row > 5 ? './pieces/wb.svg' : './pieces/bb.svg'
						square.cellBox.append(img)
						break
					case 'rook':
						img = document.createElement('img')
						img.src = square.row > 5 ? './pieces/wr.svg' : './pieces/br.svg'
						square.cellBox.append(img)
						break
					case 'queen':
						img = document.createElement('img')
						img.src = square.row > 5 ? './pieces/wq.svg' : './pieces/bq.svg'
						square.cellBox.append(img)
						break
					case 'king':
						img = document.createElement('img')
						img.src = square.row > 5 ? './pieces/wk.svg' : './pieces/bk.svg'
						square.cellBox.append(img)
						break
				}
			})
		)
	}

	// Place pieces on board
	placePieces()
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
	setupBoard,
	clearBoard,
}
