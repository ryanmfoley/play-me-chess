// import { Board, chessBoard } from './board.js'
import { Board } from './board.js'
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
const infoDisplay = document.querySelector('#info')
let startGame = false

let currentPlayer
let opponent
let playerNum = 0
let ready = false
let enemyReady = false
let piecesPlaced = false

let squareSelected = false
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

socket.on('startGame', () => {
	const chessBoard = new Board()

	chessBoard.clearBoard()
	placePiecesOnBoard(chessBoard)
	chessBoard.displayPieces()
	console.log(currentPlayer)
	// Send game state to server
	const { board } = chessBoard

	const turn = 'black'
	socket.emit('updateBoard', { board, room, turn })

	startGame = true
})

//______________________________________________________________
// Listen for piece moves
socket.on('updateBoard', ({ board, turn }) => {
	currentPlayer.turn = turn
})

squares.addEventListener('click', (e) => {
	const { turn } = currentPlayer

	currentPlayer.chessBoard = chessBoard
	console.log(chessBoard.board)

	if (startGame && currentPlayer.color === turn) {
		if (!selectedPiece) {
			const selectedSquare = chessBoard.selectSquare(e.path)
			console.log('selected', selectedSquare)

			// Check if a piece was selected and it's their turn
			if (selectedSquare.color === turn) {
				selectedPiece = selectedSquare.piece
				console.log(selectedPiece)
			}
		} else if (!validMove) {
			landingSquare = chessBoard.selectSquare(e.path)

			console.log('isValid', validMove)

			// Check the timing on this code
			validMove = selectedPiece.checkForValidMove(
				currentPlayer,
				chessBoard,
				landingSquare
			)
			if (validMove) {
				// Check if king is in check

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

				// Send game state to server
				// socket.emit('updateBoard', {
				// 	chessBoard,
				// 	whitePlayer,
				// 	blackPlayer,
				// 	turn,
				// 	room,
				// })

				///////////////////////////////////////////////////////////////////////////////
				// Get available moves
				// player.getAvailableMoves(chessBoard)
				// console.log('player', player.checkMate, 'opponent', opponent.checkMate)

				// Reset turn variables
				selectedPiece = false
				validMove = false
				turn = turn === 'white' ? 'black' : 'white'
			} else selectedPiece = null
		}
	}
})

leaveGameButton.addEventListener('click', () => {
	socket.emit('player-disconnected')
	window.location.href = 'index.html'
})

// maybe use a recursion for checking check logic
// maybe a player method that cycles through the available moves

// checkForValidMove() markEnemySquares() checkForCheck() movePiece() markEnemySquares()
// startGameButton.addEventListener('click', () => {
// 	chessBoard.clearBoard()
// 	placePiecesOnBoard(chessBoard)
// 	chessBoard.displayPieces()

// 	startGame = true

// 	// Get position of kings on board
// 	// whitePlayer.getKingsPosition()
// 	// blackPlayer.getKingsPosition()
// })

// NOTES
// maybe a while loop to wait for player to get out of check
// still need to write code for "pawn en passant" and "pawn promotion"
// Do a code review
// I learned that null >= 0 returns true

// The king can check in the opponents list of pieces of the square is targeted
// Keep in mind discovered checks
// All pieces will have to mark target squares after every move
// board has to call setTargets
// I may not need piece.currentSquare

// Board.board = [...board].map((row) => [...row].map((cell) => ({ ...cell })))

// chessBoard.copyBoard({ board })

// Board.board = [...board].map((piece) =>
// 	Object.assign(Object.create(Object.getPrototypeOf(piece)), piece)
// )

// const player = turn === 'white' ? whitePlayer : blackPlayer
// const opponent = turn === 'white' ? blackPlayer : whitePlayer
// Board.player = turn === 'white' ? whitePlayer : blackPlayer
// Board.opponent = turn === 'white' ? blackPlayer : whitePlayer
// console.log('current chess', chessBoard)

// const blah = chboard.board.map((x) =>
// 	[...x].map((y) => {
// 		return { ...y }
// 	})
// )

// const board = JSON.stringify(chessBoard.board)

// const chessBoardCopy = Object.assign(
// 	Object.create(
// 		// Set the prototype of the new object to the prototype of the instance.
// 		// Used to allow new object behave like class instance.
// 		Object.getPrototypeOf(chessBoard)
// 	),
// 	// Prevent shallow copies of nested structures like arrays, etc
// 	JSON.parse(JSON.stringify(chessBoard))
// )

// board.forEach((row) => row.forEach((cell) => console.log(cell)))
// const boardCopy = [...board].map((row) =>
// 	[...row].map((cell) => ({ ...cell }))
// )
