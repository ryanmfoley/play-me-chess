import { chessBoard } from './board.js'
import { placePiecesOnBoard } from './pieces.js'
import { whitePlayer, blackPlayer } from './players.js'

// Get name and room from URL
const { username, room, color } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
})

const startGameButton = document.querySelector('#start-game')
const leaveGameButton = document.querySelector('#leave-game')
const info = document.querySelector('#info')
const squares = document.querySelector('.board')
const check = document.querySelector('.check-text')
let startGame = false
let selectedCell
let landingCell
let selectedPiece
let landingSquare
let legalMove

const socket = io()

socket.emit('joinGame', { username, room, color })

const currentPlayer = color === 'white' ? whitePlayer : blackPlayer
const opponent = color === 'white' ? blackPlayer : whitePlayer

socket.on('info', () => {
	info.innerHTML = `You are playing ${color}`
})

//______________________________________________________________
// Listen for Start-Game event

startGameButton.addEventListener('click', () => {
	if (color === 'black') squares.setAttribute('id', 'black-board')

	chessBoard.clearBoard()
	placePiecesOnBoard(chessBoard)
	chessBoard.displayPieces()

	startGame = true
})

squares.addEventListener('click', (e) => {
	const { turn } = currentPlayer

	if (startGame && currentPlayer.color === turn) {
		if (!selectedPiece) {
			// const { cellRow, cellCol } = chessBoard.identifyCell(e.target)
			// selectedCell = { cellRow, cellCol }
			selectedCell = chessBoard.identifyCell(e.target)
			const selectedSquare = chessBoard.selectSquare(selectedCell)

			// Check if a piece was selected and it's their turn
			if (selectedSquare.color === turn) {
				selectedPiece = selectedSquare.piece
			}

			// If piece is selected
		} else if (!legalMove) {
			// const { cellRow, cellCol } = chessBoard.identifyCell(e.target)
			// landingCell = { cellRow, cellCol }
			landingCell = chessBoard.identifyCell(e.target)
			landingSquare = chessBoard.selectSquare(landingCell)

			const { validMove, castle } = selectedPiece.checkMove(
				currentPlayer,
				opponent,
				chessBoard,
				landingSquare
			)
			legalMove = validMove

			if (validMove) {
				// maybe remove player from checkForValidMove

				if (castle.validCastle) {
					landingCell = chessBoard.identifyCell(e.target)

					// Send king move to server
					socket.emit('move-piece', { room, selectedCell, landingCell })

					selectedCell = castle.rooksStartingSquare
					landingCell = castle.rooksLandingSquare

					// Send rook move to server
					socket.emit('move-piece', { room, turn, selectedCell, landingCell })
				} else {
					landingCell = chessBoard.identifyCell(e.target)

					// Send move to server
					socket.emit('move-piece', { room, turn, selectedCell, landingCell })
				}

				// Reset turn variables
				selectedPiece = false
				legalMove = false
			} else selectedPiece = null
		}
	}
})

//______________________________________________________________
// Listen for piece moves

socket.on('move-piece', ({ turn, selectedCell, landingCell }) => {
	// problem is here

	currentPlayer.turn = turn
	const selectedSquare = chessBoard.selectSquare(selectedCell)
	const landingSquare = chessBoard.selectSquare(landingCell)
	const selectedPiece = selectedSquare.piece

	// Mark enemy squares
	chessBoard.markEnemySquares(currentPlayer, opponent)

	// Move piece
	currentPlayer.color === turn
		? chessBoard.movePiece(selectedPiece, landingSquare, currentPlayer)
		: chessBoard.movePiece(selectedPiece, landingSquare, opponent)

	chessBoard.displayPieces()

	// Mark enemy squares
	chessBoard.markEnemySquares(currentPlayer, opponent)

	//////////////////////// Do I need both? ////////////////////////
	currentPlayer.isKingInCheck(chessBoard)
	opponent.isKingInCheck(chessBoard)

	// Get available moves
	if (currentPlayer.color === turn) {
		/////////////////////////// turn back on ///////////////////////////
		// currentPlayer.getAvailableMoves(chessBoard, opponent)
	}

	//////////////////////// Do I need both? ////////////////////////
	if (currentPlayer.inCheck || opponent.inCheck) {
		check.style.display = 'block'
	} else check.style.display = 'none'

	if (currentPlayer.checkMate || opponent.checkMate) {
		check.innerHTML = 'CHECKMATE!'
		socket.emit('winStatus')
	}
})

socket.on('winStatus', () => {
	check.innerHTML = 'CHECKMATE!'
})

leaveGameButton.addEventListener('click', () => {
	socket.emit('player-disconnected')
	window.location.href = 'lobby.html'
})

/////////////////////////////////// NOTES ///////////////////////////////////

// 1. "castle"
// 2. "pawn promotion"
// 3. "pawn en passant"
// 4. rooms don't show up if created before other user joins lobby
// 5. wait for pieces to appear for both clients before allowing moves
// 6. after checkmate, smoothly send clients to lobby
// 7. send one or both clients back to lobby after a page reload

// error when I try castling on move one
// remove socket.emit('info') && socket.on('info')
// may not need king variable in castling logic pieces.js
// double check if isCastling is needed
