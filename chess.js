import { Board, chessBoard } from './board.js'
import { placePiecesOnBoard } from './pieces.js'
import { whitePlayer, blackPlayer } from './players.js'

/////////////////////// Game started ///////////////////////

let startGame = false

let squareSelected = false

// Start Button
const startGameButton = document.querySelector('#start-game')

// Grab squares
const squares = document.querySelector('.board')

// Grab check display
const check = document.querySelector('.check-text')

let turn = 'white'
let selectedPiece
let landingSquare
let validMove

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

// Listen for cell clicks
squares.addEventListener('click', (event) => {
	const player = turn === 'white' ? whitePlayer : blackPlayer
	const opponent = turn === 'white' ? blackPlayer : whitePlayer
	Board.player = turn === 'white' ? whitePlayer : blackPlayer
	Board.opponent = turn === 'white' ? blackPlayer : whitePlayer
	player.chessBoard = chessBoard

	if (startGame) {
		if (!selectedPiece) {
			const selectedSquare = chessBoard.selectSquare(event.path)

			// Check if a piece was selected and it's their turn
			if (selectedSquare.color === turn) {
				selectedPiece = selectedSquare.piece
			}
		} else if (!validMove) {
			landingSquare = chessBoard.selectSquare(event.path)

			// Check the timing on this code
			validMove = selectedPiece.checkForValidMove(
				player,
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

				player.isKingInCheck(chessBoard)
				opponent.isKingInCheck(chessBoard)

				if (player.inCheck || opponent.inCheck) {
					check.innerHTML = 'CHECK!'
				} else check.innerHTML = ''

				if (player.checkMate || opponent.checkMate) {
					check.innerHTML = 'CHECKMATE!'
				}

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

// maybe use a recursion for checking check logic
// maybe a player method that cycles through the available moves

// checkForValidMove() markEnemySquares() checkForCheck() movePiece() markEnemySquares()

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
