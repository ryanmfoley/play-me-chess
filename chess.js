import { chessBoard } from './board.js'
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

const players = [whitePlayer, blackPlayer]
let turn = 'white'
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
	const player = turn === 'white' ? whitePlayer : blackPlayer
	const opponent = turn === 'white' ? blackPlayer : whitePlayer

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
				players,
				chessBoard,
				landingSquare
			)

			if (validMove) {
				// Check if king is in check

				// Move piece
				selectedPiece.movePiece(landingSquare, opponent)

				// Mark enemy squares
				chessBoard.markEnemySquares(chessBoard, whitePlayer, blackPlayer)

				player.isKingInCheck(chessBoard)
				opponent.isKingInCheck(chessBoard)

				if (player.inCheck || opponent.inCheck) {
					check.innerHTML = 'CHECK!'
				} else {
					check.innerHTML = ''
				}

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
