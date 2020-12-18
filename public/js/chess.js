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

const identifyCell = (square) => {
	const [cellRow] = !!square[0].src
		? square[1].classList[0].match(/\d+/)
		: square[0].classList[0].match(/\d+/)
	const [cellCol] = !!square[0].src
		? square[1].classList[1].match(/\d+/)
		: square[0].classList[1].match(/\d+/)
	// console.log(cellRow[0])

	return { cellRow, cellCol }
}

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

	// Get position of kings on board
	// whitePlayer.getKingsPosition()
	// blackPlayer.getKingsPosition()
})

//______________________________________________________________
// Listen for piece moves

socket.on('move-piece', ({ room, turn, selectedCell, landingCell }) => {
	currentPlayer.turn = turn
	console.log(room, turn, selectedCell, landingCell)
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
	console.log(turn)

	currentPlayer.chessBoard = chessBoard

	if (startGame && currentPlayer.color === turn) {
		if (!selectedPiece) {
			const { cellRow, cellCol } = identifyCell(e.path)
			selectedCell = { cellRow, cellCol }
			const selectedSquare = chessBoard.selectSquare(selectedCell)

			// Check if a piece was selected and it's their turn
			if (selectedSquare.color === turn) {
				selectedPiece = selectedSquare.piece
			}

			// If piece is selected
		} else if (!validMove) {
			const { cellRow, cellCol } = identifyCell(e.path)
			landingCell = { cellRow, cellCol }
			landingSquare = chessBoard.selectSquare(landingCell)

			// Check the timing on this code
			validMove = selectedPiece.checkForValidMove(
				currentPlayer,
				chessBoard,
				landingSquare
			)
			if (validMove) {
				landingCell = e.path

				const { cellRow, cellCol } = identifyCell(e.path)
				landingCell = { cellRow, cellCol }

				// Send move to server
				socket.emit('move-piece', { room, turn, selectedCell, landingCell })
				console.log(room, turn, selectedCell, landingCell)

				// Mark enemy squares
				// chessBoard.markEnemySquares(whitePlayer, blackPlayer)

				// // Move piece
				// selectedPiece.movePiece(landingSquare, opponent)
				// chessBoard.displayPieces()

				// // Mark enemy squares
				// chessBoard.markEnemySquares(whitePlayer, blackPlayer)

				// currentPlayer.isKingInCheck(chessBoard)
				// opponent.isKingInCheck(chessBoard)

				// if (currentPlayer.inCheck || opponent.inCheck) {
				// 	check.innerHTML = 'CHECK!'
				// } else check.innerHTML = ''

				// if (currentPlayer.checkMate || opponent.checkMate) {
				// 	check.innerHTML = 'CHECKMATE!'
				// }

				///////////////////////////////////////////////////////////////////////////////
				// Get available moves
				// player.getAvailableMoves(chessBoard)
				// console.log('player', player.checkMate, 'opponent', opponent.checkMate)

				// Reset turn variables
				selectedPiece = false
				validMove = false
				// turn = turn === 'white' ? 'black' : 'white'
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
