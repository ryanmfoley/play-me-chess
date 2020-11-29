import { board } from './board.js'
import { placePiecesOnBoard } from './pieces.js'
// import { whitePlayer, blackPlayer } from './players.js'
import { selectSquare, movePiece } from './moves.js'

// console.log('whitePlayer', whitePlayer, 'blackPlayer', blackPlayer)

/////////////////////// Game started ///////////////////////

let startGame = false

let squareSelected = false

// Start Button
const startGameButton = document.querySelector('#start-game')

// Grab squares
const squares = document.querySelector('.board')

// Listen for Start-Game event
startGameButton.addEventListener('click', () => {
	board.updateBoard()
	board.clearBoard()
	placePiecesOnBoard()
	board.displayPieces()

	startGame = true
})

let turn = 'white'
let piece
let selectedPiece
let landingSquare
let validMove

// Listen for cell clicks
squares.addEventListener('click', (event) => {
	if (startGame) {
		if (!selectedPiece) {
			const selectedSquare = board.selectSquare(event.path)

			// Check if a piece was selected and it's their turn
			if (selectedSquare.color === turn) {
				selectedPiece = selectedSquare.piece
			}
		} else if (!validMove) {
			landingSquare = selectSquare(board.board, event.path)
			validMove = selectedPiece.checkIfMoveIsValid(landingSquare)
			if (validMove) {
				movePiece(board, selectedPiece, landingSquare)

				selectedPiece = false
				turn = turn === 'white' ? 'black' : 'white'

				// Reset validMove switch
				validMove = false
			}
		}
	}
})
