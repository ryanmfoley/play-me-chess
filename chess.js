import {
	build2DArray,
	setupGrid,
	setupBoard,
	assignPiecesToSquares,
	clearBoard,
} from './createBoard.js'

// Start Button
const startGameButton = document.querySelector('#start-game')

function selectCell(cell) {
	const cellRow = cell.classList[0].match(/\d+/)
	const cellCol = cell.classList[1].match(/\d+/)
	return grid[cellRow][cellCol]
}

// Game started
let startGame = false

// Grab squares
const squares = document.querySelector('.board')

startGameButton.addEventListener('click', () => {
	// Build Grid
	const board = setupGrid()

	// Clear Board
	clearBoard(board)

	// Assign pieces to squares
	assignPiecesToSquares(board)

	// Place pieces on board
	setupBoard(board)
})
