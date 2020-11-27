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
	// pawn: function (board, color, currentSquare, destination) {
	pawn: function (board, currentSquare, destination) {
		// console.log(currentSquare.cellBox)
		const moveUpOne = () => {
			destination.color = currentSquare.color
			destination.piece = currentSquare.piece
			currentSquare.color = ''
			currentSquare.piece = ''
		}
		moveUpOne()
	},
	knight: function (board, color, currentSquare, destination) {
		console.log(color, currentSquare)
	},
	bishop: function (board, color, currentSquare, destination) {
		console.log(color, currentSquare)
	},
	rook: function (board, color, currentSquare, destination) {
		console.log(color, currentSquare)
	},
	queen: function (board, color, currentSquare, destination) {
		console.log(color, currentSquare)
	},
	king: function (board, color, currentSquare, destination) {
		console.log(color, currentSquare)
	},
}

export { selectSquare, movePiece }
