import { chessBoard } from './board.js'
import { placePiecesOnBoard } from './pieces.js'
import { whitePlayer, blackPlayer } from './players.js'

const audio = document.querySelector('audio')
const board = document.querySelector('#board')
const squares = document.querySelectorAll('.square')
const leaveGameButton = document.querySelector('#leave-game-btn')
const logOutForm = document.getElementById('logout-form')
const logOutButton = document.getElementById('logout-btn')
const gameInfoModal = document.querySelector('#game-info-modal')
const gameInfo = document.querySelector('.game-info')
const gameResult = document.querySelector('.game-result')
const socket = io()

// Game variables //
let legalMove = true
let selectedCell
let selectedPiece
let landingCell
let landingSquare
let player
let opponent

socket.emit('enterGameRoom')

socket.on('enterGameRoom', ({ id, color }) => {
	player = color === 'white' ? whitePlayer : blackPlayer
	opponent = color === 'white' ? blackPlayer : whitePlayer
	player.id = id

	// Flip board for black //
	if (color === 'white') {
		gameInfoModal.style.visibility = 'visible'
		gameInfo.style.display = 'block'
		gameInfo.innerHTML = 'Waiting for opponent...'
	} else {
		board.classList.add('black-piece')
		gameInfo.classList.add('black-piece')
		gameResult.classList.add('black-piece')
	}
})

socket.on('startGame', () => {
	gameInfoModal.style.visibility = 'hidden'
	gameInfo.style.display = 'none'

	chessBoard.clearBoard()
	placePiecesOnBoard(chessBoard)
	chessBoard.displayPieces()
	chessBoard.markEnemySquares(player, opponent)
})

function handleDragStart(e) {
	const { turn } = chessBoard

	if (player.color === turn) {
		selectedCell = chessBoard.identifyCell(e.target)
		const selectedSquare = chessBoard.selectSquare(selectedCell)

		if (selectedSquare.color === turn) {
			selectedPiece = selectedSquare.piece
			setTimeout(() => (e.target.style.display = 'none'), 0)
		}
	}
}

function handleDrop(e) {
	e.preventDefault()

	this.classList.remove('hover-border')

	const { turn } = chessBoard
	const piece = e.target

	landingCell = chessBoard.identifyCell(piece)
	landingSquare = chessBoard.selectSquare(landingCell)

	const { validMove, castle } = selectedPiece.checkMove(
		player,
		opponent,
		chessBoard,
		landingSquare
	)

	legalMove = validMove

	if (legalMove) {
		if (castle.validCastle) {
			// Send king move to server //
			socket.emit('movePiece', { selectedCell, landingCell })

			selectedCell = castle.rooksStartingSquare
			landingCell = castle.rooksLandingSquare

			// Send rook move to server //
			socket.emit('movePiece', { turn, selectedCell, landingCell })
		} else {
			// Send move to server //
			socket.emit('movePiece', { turn, selectedCell, landingCell })
		}

		selectedPiece = false
	} else {
		legalMove = true
		selectedPiece = null
	}
}

function handleDragEnter(e) {
	e.preventDefault()

	this.classList.add('hover-border')
}

function handleDragLeave() {
	this.classList.remove('hover-border')
}

function handleDragEnd(e) {
	setTimeout(() => (e.target.style.display = 'block'), 0)
}

function handleDragOver(e) {
	e.preventDefault()
}

//______________________________________________________________
// Start-Game

for (const square of squares) {
	square.addEventListener('dragstart', handleDragStart, false)
	square.addEventListener('dragenter', handleDragEnter, false)
	square.addEventListener('dragover', handleDragOver, false)
	square.addEventListener('dragleave', handleDragLeave, false)
	square.addEventListener('drop', handleDrop, false)
	square.addEventListener('dragend', handleDragEnd, false)
}

//______________________________________________________________
// Listen for piece moves

socket.on('movePiece', async ({ turn, selectedCell, landingCell }) => {
	chessBoard.turn = turn

	const activePlayer = player.color === chessBoard.turn ? opponent : player
	const inActivePlayer = player.color === chessBoard.turn ? player : opponent
	const selectedSquare = chessBoard.selectSquare(selectedCell)
	const landingSquare = chessBoard.selectSquare(landingCell)
	let selectedPiece = selectedSquare.piece
	const backRank = turn === 'white' ? 7 : 0
	const promotePawn =
		selectedPiece.name === 'pawn' && backRank == landingCell.row ? true : false

	chessBoard.movePiece(player, opponent, selectedPiece, landingSquare, socket)
	chessBoard.displayPieces()

	//////////////////// Check for pawn promotion ////////////////////
	if (promotePawn) {
		let newPiece

		if (player.color !== turn) {
			newPiece = await player.selectPieceModal()

			socket.emit('promotePawn', newPiece)
		} else newPiece = await opponent.getPromotedPiece(socket)

		const promotedPiece = activePlayer.promotePawn(selectedPiece, newPiece)

		chessBoard.movePiece(
			activePlayer,
			inActivePlayer,
			promotedPiece,
			landingSquare
		)
		chessBoard.displayPieces()
	}

	// Mark enemy squares //
	chessBoard.markEnemySquares(player, opponent)

	// Check for draw //
	chessBoard.checkDraw()

	// Evaluate check //
	inActivePlayer.isKingInCheck(chessBoard)

	// Check escape moves //
	inActivePlayer.checkEscapeMoves(chessBoard, activePlayer)

	// If king is in check set square to red //
	if (inActivePlayer.inCheck) {
		const { row, col } = inActivePlayer.kingSquare

		chessBoard.board[row][col].cellBox.id = 'check-square'

		audio.play()
	} else {
		chessBoard.board.forEach((row) =>
			row.forEach((square) => square.cellBox.removeAttribute('id'))
		)
	}

	if (inActivePlayer.checkMate) {
		gameResult.innerHTML = 'Checkmate'

		setTimeout(function () {
			gameInfoModal.style.visibility = 'visible'
			gameResult.style.display = 'block'
		}, 500)

		setTimeout(function () {
			window.location.href = '/lobby'
		}, 2000)
	} else if (chessBoard.draw) {
		gameResult.innerHTML = 'Draw'

		setTimeout(function () {
			gameInfoModal.style.visibility = 'visible'
			gameResult.style.display = 'block'
		}, 500)

		setTimeout(function () {
			window.location.href = '/lobby'
		}, 2000)
	} else if (chessBoard.staleMate) {
		gameResult.innerHTML = 'Stalemate'

		setTimeout(function () {
			gameInfoModal.style.visibility = 'visible'
			gameResult.style.display = 'block'
		}, 2000)

		setTimeout(function () {
			window.location.href = '/lobby'
		}, 2000)
	}
})

socket.on('leaveGame', (id) => {
	if (id && player.id !== id) {
		gameInfoModal.style.visibility = 'visible'
		gameInfo.style.display = 'block'
		gameInfo.innerHTML = 'Opponent left game'

		socket.emit('updatePlayersWaiting', player.id)

		setTimeout(() => {
			window.location.href = '/lobby'
		}, 1000)
	}
})

leaveGameButton.addEventListener('click', () => {
	socket.emit('leaveGame', player.id)
	socket.emit('updatePlayersWaiting', player.id)

	window.location.href = '/lobby'
})

logOutButton.addEventListener('click', () => {
	socket.emit('leaveGame', player.id)
	socket.emit('logout')

	socket.on('logout', ({ id }) => {
		socket.emit('updatePlayersWaiting', id)
	})
	logOutForm.submit()
})

window.addEventListener('beforeunload', () => {
	socket.emit('leaveGame', player.id)
	socket.emit('logout')
})
