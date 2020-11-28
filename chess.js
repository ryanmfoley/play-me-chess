import { board } from './board.js'
import { whitePieces, blackPieces } from './pieces.js'
import { selectSquare, movePiece } from './moves.js'

/////////////////////// Game started ///////////////////////

console.log('whitePieces', whitePieces)
console.log('blackPieces', blackPieces)

let startGame = false

let squareSelected = false

// Start Button
const startGameButton = document.querySelector('#start-game')

// Grab squares
const squares = document.querySelector('.board')

// Listen for Start-Game event
startGameButton.addEventListener('click', () => {
	board.clearBoard()
	board.setPieces()
	board.displayPieces()

	// board.printBoard()

	startGame = true
})

let turn = 'white'
let piece
let selectedSquare
let destination

// Listen for cell clicks
squares.addEventListener('click', (event) => {
	if (startGame) {
		if (!squareSelected) {
			selectedSquare = selectSquare(board.board, event.path)
			const color = selectedSquare.color ? selectedSquare.color : ''
			piece = selectedSquare.piece

			if (selectedSquare.color === turn && piece) {
				squareSelected = true
			}
		} else {
			destination = selectSquare(board.board, event.path)
			movePiece[piece](board.board, selectedSquare, destination)
			board.displayPieces()
			squareSelected = false
			turn = turn === 'white' ? 'black' : 'white'
		}
	}
})
