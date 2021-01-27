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
	}

	assignPieceToSquare(piece) {
		this.board[piece.row][piece.col].color = piece.color
		this.board[piece.row][piece.col].piece = piece
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
						} else {
							img.src = './images/bp.svg'
							img.classList.add('black-pieces')
						}
						square.cellBox.innerHTML = ''
						square.cellBox.append(img)
						break
					case 'knight':
						img = document.createElement('img')
						if (square.color === 'white') {
							img.src = './images/wn.svg'
						} else {
							img.src = './images/bn.svg'
							img.classList.add('black-pieces')
						}
						square.cellBox.innerHTML = ''
						square.cellBox.append(img)
						break
					case 'bishop':
						img = document.createElement('img')
						if (square.color === 'white') {
							img.src = './images/wb.svg'
						} else {
							img.src = './images/bb.svg'
							img.classList.add('black-pieces')
						}
						square.cellBox.innerHTML = ''
						square.cellBox.append(img)
						break
					case 'rook':
						img = document.createElement('img')
						if (square.color === 'white') {
							img.src = './images/wr.svg'
						} else {
							img.src = './images/br.svg'
							img.classList.add('black-pieces')
						}
						square.cellBox.innerHTML = ''
						square.cellBox.append(img)
						break
					case 'queen':
						img = document.createElement('img')
						if (square.color === 'white') {
							img.src = './images/wq.svg'
						} else {
							img.src = './images/bq.svg'
							img.classList.add('black-pieces')
						}
						square.cellBox.innerHTML = ''
						square.cellBox.append(img)
						break
					case 'king':
						img = document.createElement('img')
						if (square.color === 'white') {
							img.src = './images/wk.svg'
						} else {
							img.src = './images/bk.svg'
							img.classList.add('black-pieces')
						}
						img.src =
							square.color === 'white' ? './images/wk.svg' : './images/bk.svg'
						square.cellBox.innerHTML = ''
						square.cellBox.append(img)
						break
					default:
						square.cellBox.innerHTML = ''
				}
			})
		)
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

		selectedPiece.enPassant = true

		if (
			chessBoard.board[selectedPiece.row][leftSquare] &&
			chessBoard.board[selectedPiece.row][leftSquare].piece &&
			chessBoard.board[selectedPiece.row][leftSquare].piece.color !==
				selectedPiece.color
		) {
			chessBoard.board[selectedPiece.row][leftSquare].piece.enPassant = true
		}
		if (
			chessBoard.board[selectedPiece.row][rightSquare] &&
			chessBoard.board[selectedPiece.row][rightSquare].piece &&
			chessBoard.board[selectedPiece.row][rightSquare].piece.color !==
				selectedPiece.color
		) {
			chessBoard.board[selectedPiece.row][rightSquare].piece.enPassant = true
		}
	}

	// movePiece(player, piece, landingSquare) {
	movePiece(currentPlayer, opponent, piece, landingSquare) {
		const activePlayer =
			currentPlayer.color === currentPlayer.turn ? currentPlayer : opponent
		const inActivePlayer =
			currentPlayer.color === currentPlayer.turn ? opponent : currentPlayer

		// Remove piece from square
		this.removePieceFromSquare(piece)

		// If capture, remove piece from game
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

		// Reset enPassant
		activePlayer.pieces.forEach((piece) => (piece.enPassant = false))
		inActivePlayer.pieces.forEach((piece) => (piece.enPassant = false))
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

	selectSquare({ cellRow, cellCol }) {
		return this.board[cellRow][cellCol]
	}
}

const chessBoard = new Board()

export { Board, chessBoard }
