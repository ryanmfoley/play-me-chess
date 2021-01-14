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
let validMove

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

				// Reset turn variables
				selectedPiece = false
				validMove = false
			} else selectedPiece = null
		}
	}
})

//______________________________________________________________
// Listen for piece moves

socket.on('move-piece', ({ turn, selectedCell, landingCell, checkStatus }) => {
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

	currentPlayer.isKingInCheck(chessBoard)
	opponent.isKingInCheck(chessBoard)

	// Get available moves
	if (currentPlayer.color === turn) {
		currentPlayer.getAvailableMoves(chessBoard, opponent)
	}

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

// NOTES
// getAvailableMoves Pawn targets need adjusting
// maybe a while loop to wait for player to get out of check
// still need to write code for "pawn en passant" and "pawn promotion"
// possibly remove board.empty
// 	this.board = Board.board
// 		Board.board = [...this.board].map((piece) =>
// 			Object.assign(Object.create(Object.getPrototypeOf(piece)), piece)
// 		)
