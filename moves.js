const selectSquare = (board, cell) => {
	const cellRow = !!cell[0].src
		? cell[1].classList[0].match(/\d+/)
		: cell[0].classList[0].match(/\d+/)
	const cellCol = !!cell[0].src
		? cell[1].classList[1].match(/\d+/)
		: cell[0].classList[1].match(/\d+/)

	return board[cellRow][cellCol]
}

const movePiece = {
	pawn: function (board, selectedSquare, destination) {
		const moveUpOne = () => {
			const row = selectedSquare.row
			const col = selectedSquare.col
			const color = selectedSquare.color
			if (color === 'white') {
				if (selectedSquare.row === destination.row + 1) {
					destination.color = selectedSquare.color
					destination.piece = selectedSquare.piece
					selectedSquare.color = ''
					selectedSquare.piece = ''
				}
			} else {
				if (selectedSquare.row === destination.row - 1) {
					destination.color = selectedSquare.color
					destination.piece = selectedSquare.piece
					selectedSquare.color = ''
					selectedSquare.piece = ''
				}
			}
		}
		moveUpOne()
	},
	knight: function (board, color, currentSquare, destination) {
		// console.log(color, currentSquare)
	},
	bishop: function (board, color, currentSquare, destination) {
		// console.log(color, currentSquare)
	},
	rook: function (board, color, currentSquare, destination) {
		// console.log(color, currentSquare)
	},
	queen: function (board, color, currentSquare, destination) {
		// console.log(color, currentSquare)
	},
	king: function (board, color, currentSquare, destination) {
		// console.log(color, currentSquare)
	},
}

export { selectSquare, movePiece }
