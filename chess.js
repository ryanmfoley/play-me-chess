import {
	build2DArray,
	setupGrid,
	assignPiecesToSquares,
	displayPieces,
	clearBoard,
} from './createBoard.js'

import { selectSquare, movePiece } from './moves.js'

/////////////////////// Game started ///////////////////////
let startGame = false

let squareSelected = false

// Start Button
const startGameButton = document.querySelector('#start-game')

// Grab squares
const squares = document.querySelector('.board')

// Build Grid
let board = setupGrid()

// Listen for Start-Game event
startGameButton.addEventListener('click', () => {
	// Clear Board
	clearBoard(board)

	// Assign pieces to squares
	assignPiecesToSquares(board)

	// Place pieces on board
	displayPieces(board)
	startGame = true
})

let color
let piece
let selectedSquare
let destination

// Listen for cell clicks
squares.addEventListener('click', (event) => {
	if (startGame) {
		if (!squareSelected) {
			selectedSquare = selectSquare(board, event.path)
			color = selectedSquare.color ? selectedSquare.color : ''
			piece = selectedSquare.piece

			if (piece) {
				squareSelected = true
			}
		} else {
			destination = selectSquare(board, event.path)
			movePiece[piece](board, selectedSquare, destination)
			// clearBoard(board)
			displayPieces(board)
			squareSelected = false
		}
	}
})
