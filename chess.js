import { chessBoard } from './board.js'
import { placePiecesOnBoard } from './pieces.js'
import { whitePlayer, blackPlayer } from './players.js'

// console.log('whitePlayer', whitePlayer, 'blackPlayer', blackPlayer)

/////////////////////// Game started ///////////////////////

let startGame = false

let squareSelected = false

// Start Button
const startGameButton = document.querySelector('#start-game')

// Grab squares
const squares = document.querySelector('.board')

let turn = 'white'
let player = turn === 'white' ? whitePlayer : blackPlayer
const players = [whitePlayer, blackPlayer]
// let whiteKingPosition
// let blackKingPosition
let selectedPiece
let landingSquare
let validMove

// Listen for Start-Game event
startGameButton.addEventListener('click', () => {
	chessBoard.updateBoard()
	chessBoard.clearBoard()
	placePiecesOnBoard()
	chessBoard.displayPieces()

	startGame = true

	// Get position of kings on board
	whitePlayer.getKingsPosition()
	blackPlayer.getKingsPosition()
})

// Listen for cell clicks
squares.addEventListener('click', (event) => {
	if (startGame) {
		if (!selectedPiece) {
			const selectedSquare = chessBoard.selectSquare(event.path)

			// Check if a piece was selected and it's their turn
			if (selectedSquare.color === turn) {
				selectedPiece = selectedSquare.piece
				// console.log(selectedPiece)
			}
		} else if (!validMove) {
			landingSquare = chessBoard.selectSquare(event.path)

			// Build board when selects a valid move

			// Check the timing on this code
			validMove =
				selectedPiece.checkForValidMove(players, chessBoard, landingSquare) &&
				!player.inCheck

			if (validMove) {
				// Check if king is in check

				// Move piece
				selectedPiece.movePiece(landingSquare)

				// Mark enemy squares
				chessBoard.markEnemySquares(chessBoard, whitePlayer, blackPlayer)

				const kingInCheck =
					turn === 'white' ? whitePlayer.inCheck : blackPlayer.inCheck

				console.log(kingInCheck)

				// Reset turn variables
				selectedPiece = false
				validMove = false
				turn = turn === 'white' ? 'black' : 'white'
			} else selectedPiece = null
		}
	}
})

// checkForValidMove() markEnemySquares() checkForCheck() movePiece() markEnemySquares()

// NOTES
// maybe a while loop to wait for player to get out of check
// still need to write code for "pawn en passant" and "pawn promotion"
// Do a code review

// The king can check in the opponents list of pieces of the square is targeted
// Keep in mind discovered checks
// All pieces will have to mark target squares after every move
// board has to call setTargets
