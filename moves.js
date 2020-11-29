const selectSquare = (board, cell) => {
	const cellRow = !!cell[0].src
		? cell[1].classList[0].match(/\d+/)
		: cell[0].classList[0].match(/\d+/)
	const cellCol = !!cell[0].src
		? cell[1].classList[1].match(/\d+/)
		: cell[0].classList[1].match(/\d+/)

	return board[cellRow][cellCol]
}

const movePiece = (board, piece, landingSquare) => {
	piece.removePieceFromSquare()
	piece.changePosition(landingSquare.row, landingSquare.col)
	piece.assignPieceToSquare()

	board.clearBoard()
	board.updateBoard()
	board.displayPieces()
}

export { selectSquare, movePiece }
