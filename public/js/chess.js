import { Board, chessBoard } from './board.js'
import { placePiecesOnBoard } from './pieces.js'
import { whitePlayer, blackPlayer } from './players.js'

/////////////////////// CHESS ///////////////////////

// Get name and room from URL
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
})

const startGameButton = document.querySelector('#start-game')
const leaveGameButton = document.querySelector('#leave-game')
const squares = document.querySelector('.board')
const check = document.querySelector('.check-text')
let startGame = false
let currentPlayer
let opponent
let selectedCell
let landingCell
let selectedPiece
let landingSquare
let validMove

const socket = io()

socket.emit('joinGame', { username, room })

// Get your player number
socket.on('players-turn', (turn) => {
	currentPlayer = turn === 'white' ? whitePlayer : blackPlayer
	opponent = turn === 'white' ? blackPlayer : whitePlayer
	console.log('from chess', username, currentPlayer)
})

//______________________________________________________________
// Listen for Start-Game event

startGameButton.addEventListener('click', () => {
	chessBoard.clearBoard()
	placePiecesOnBoard(chessBoard)
	chessBoard.displayPieces()

	startGame = true
})

//______________________________________________________________
// Listen for piece moves

socket.on('move-piece', ({ room, turn, selectedCell, landingCell }) => {
	currentPlayer.turn = turn
	const selectedSquare = chessBoard.selectSquare(selectedCell)
	const landingSquare = chessBoard.selectSquare(landingCell)
	const selectedPiece = selectedSquare.piece

	// Mark enemy squares
	chessBoard.markEnemySquares(whitePlayer, blackPlayer)

	// Move piece
	selectedPiece.movePiece(landingSquare, opponent)
	chessBoard.displayPieces()

	// Mark enemy squares
	chessBoard.markEnemySquares(whitePlayer, blackPlayer)

	currentPlayer.isKingInCheck(chessBoard)
	opponent.isKingInCheck(chessBoard)

	if (currentPlayer.inCheck || opponent.inCheck) {
		check.innerHTML = 'CHECK!'
	} else check.innerHTML = ''

	if (currentPlayer.checkMate || opponent.checkMate) {
		check.innerHTML = 'CHECKMATE!'
	}
})

squares.addEventListener('click', (e) => {
	const { turn } = currentPlayer

	currentPlayer.chessBoard = chessBoard

	if (startGame && currentPlayer.color === turn) {
		if (!selectedPiece) {
			const { cellRow, cellCol } = chessBoard.identifyCell(e.target)
			selectedCell = { cellRow, cellCol }
			const selectedSquare = chessBoard.selectSquare(selectedCell)

			// Check if a piece was selected and it's their turn
			if (selectedSquare.color === turn) {
				selectedPiece = selectedSquare.piece
			}

			// If piece is selected
		} else if (!validMove) {
			const { cellRow, cellCol } = chessBoard.identifyCell(e.target)
			landingCell = { cellRow, cellCol }
			landingSquare = chessBoard.selectSquare(landingCell)

			// Check the timing on this code
			validMove = selectedPiece.checkForValidMove(
				currentPlayer,
				chessBoard,
				landingSquare
			)
			if (validMove) {
				landingCell = e.target

				const { cellRow, cellCol } = chessBoard.identifyCell(e.target)
				landingCell = { cellRow, cellCol }

				// Send move to server
				socket.emit('move-piece', { room, turn, selectedCell, landingCell })

				// Get available moves
				// player.getAvailableMoves(chessBoard)
				// console.log('player', player.checkMate, 'opponent', opponent.checkMate)

				// Reset turn variables
				selectedPiece = false
				validMove = false
			} else selectedPiece = null
		}
	}
})

leaveGameButton.addEventListener('click', () => {
	socket.emit('player-disconnected')
	window.location.href = 'index.html'
})

// NOTES
// maybe a while loop to wait for player to get out of check
// still need to write code for "pawn en passant" and "pawn promotion"
