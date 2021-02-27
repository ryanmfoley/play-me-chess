import { chessBoard } from './board.js'
import { placePiecesOnBoard } from './pieces.js'
import { whitePlayer, blackPlayer } from './players.js'

// Get name and room from URL //
const { username, room, color } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
})
const leaveGameButton = document.querySelector('#leave-game')
const audio = document.querySelector('audio')
const board = document.querySelector('.board')
const squares = document.querySelectorAll('.square')
const gameResult = document.querySelector('.game-result')
const gameResultModal = document.querySelector('#game-result-modal')
const socket = io()
let selectedCell
let selectedPiece
let landingCell
let landingSquare
let legalMove

socket.emit('joinGame', { username, room })

const player = color === 'white' ? whitePlayer : blackPlayer
player.room = room

const opponent = color === 'white' ? blackPlayer : whitePlayer
opponent.room = room

// Flip board for black //
if (color === 'black') board.setAttribute('id', 'black-board')
if (color === 'black') gameResult.setAttribute('id', 'black-board')

//______________________________________________________________
// Start-Game

chessBoard.clearBoard()
placePiecesOnBoard(chessBoard)
chessBoard.displayPieces()
chessBoard.markEnemySquares(player, opponent)

for (const square of squares) {
	square.addEventListener('dragstart', function (e) {
		const { turn } = chessBoard

		if (player.color === turn) {
			selectedCell = chessBoard.identifyCell(e.target)
			const selectedSquare = chessBoard.selectSquare(selectedCell)

			if (selectedSquare.color === turn) {
				selectedPiece = selectedSquare.piece
				setTimeout(() => (e.target.style.display = 'none'), 0)
			}
		}
	})

	square.addEventListener('dragenter', (e) => {
		e.preventDefault()

		square.style.border = '6px dashed #ed2f09'
	})
	square.addEventListener('dragleave', () => {
		square.style.border = 'initial'
	})
	square.addEventListener('dragover', (e) => e.preventDefault())
	square.addEventListener('drop', movePiece)
	square.addEventListener('dragend', (e) =>
		setTimeout(() => (e.target.style.display = 'block'), 0)
	)
}

function movePiece(e) {
	this.style.border = 'initial'

	const { turn } = chessBoard

	if (!selectedPiece) {
		selectedCell = chessBoard.identifyCell(e.target)
		const selectedSquare = chessBoard.selectSquare(selectedCell)

		// Check if a piece was selected and it's their turn //
		if (selectedSquare.color === turn) {
			selectedPiece = selectedSquare.piece
		}

		// If piece is selected //
	} else if (!legalMove) {
		landingCell = chessBoard.identifyCell(e.target)
		landingSquare = chessBoard.selectSquare(landingCell)

		const { validMove, castle } = selectedPiece.checkMove(
			player,
			opponent,
			chessBoard,
			landingSquare
		)
		legalMove = validMove

		if (validMove) {
			if (castle.validCastle) {
				landingCell = chessBoard.identifyCell(e.target)

				// Send king move to server //
				socket.emit('movePiece', { room, selectedCell, landingCell })

				selectedCell = castle.rooksStartingSquare
				landingCell = castle.rooksLandingSquare

				// Send rook move to server //
				socket.emit('movePiece', { room, turn, selectedCell, landingCell })
			} else {
				landingCell = chessBoard.identifyCell(e.target)

				// Send move to server //
				socket.emit('movePiece', { room, turn, selectedCell, landingCell })
			}

			// Reset turn variables //
			selectedPiece = false
			legalMove = false
		} else selectedPiece = null
	}
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
			socket.emit('promotePawn', room, newPiece)
		} else {
			newPiece = await opponent.getPromotedPiece(socket)
		}

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
			gameResultModal.style.visibility = 'visible'
		}, 300)
	} else if (chessBoard.draw) {
		gameResult.innerHTML = 'Draw'
		setTimeout(function () {
			gameResultModal.style.visibility = 'visible'
		}, 300)
	} else if (chessBoard.staleMate) {
		gameResult.innerHTML = 'Stalemate'
		setTimeout(function () {
			gameResultModal.style.visibility = 'visible'
		}, 300)
	}
})

leaveGameButton.addEventListener('click', () => {
	socket.emit('playerDisconnected')
	window.location.href = 'lobby.html'
})

/////////////////////////////////// NOTES ///////////////////////////////////

// 1. rooms don't show up if created before other user joins lobby
// 2. create game sends user chess.js with a "waiting for opponent..." modal
// 3. wait for pieces to appear for both clients before allowing moves
// 4. after checkmate, smoothly send clients to lobby
// 5. send one or both clients back to lobby after a page reload
// 6. username displayed along with captured pieces

// probably don't need the piece class
// combine identifyCell and selectSquare
// maybe remove img pieces from chess.html
// remove socket.emit('info') && socket.on('info')
// may not need king variable in castling logic - pieces.js
// double check if isCastling is needed
// Do I need socket.off()?
