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
const promoteModal = document.querySelector('#promoteModal')
let startGame = false
let selectedCell
let landingCell
let selectedPiece
let landingSquare
let legalMove
let newPiece

const socket = io()

// function asyncEmit(eventName, data) {
// 	return new Promise(function (resolve, reject) {
// 		socket.emit(eventName, data)
// 		socket.on(eventName, (result) => {
// 			socket.off(eventName)
// 			resolve(result)
// 		})
// 		setTimeout(reject, 1000)
// 	})
// }

// //Client
// const exampleFunction = async (clientData) => {
// 	try {
// 		const result = await asyncEmit('exampleEvent', clientData)
// 		console.log(result)
// 	} catch (err) {
// 		console.log(err)
// 	}
// }

// exampleFunction('blah blah blah')

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
			selectedCell = chessBoard.identifyCell(e.target)
			const selectedSquare = chessBoard.selectSquare(selectedCell)

			// Check if a piece was selected and it's their turn
			if (selectedSquare.color === turn) {
				selectedPiece = selectedSquare.piece
			}

			// If piece is selected
		} else if (!legalMove) {
			landingCell = chessBoard.identifyCell(e.target)
			landingSquare = chessBoard.selectSquare(landingCell)

			const { validMove, castle } = selectedPiece.checkMove(
				currentPlayer,
				opponent,
				chessBoard,
				landingSquare
			)
			legalMove = validMove

			if (validMove) {
				if (castle.validCastle) {
					landingCell = chessBoard.identifyCell(e.target)

					// Send king move to server
					socket.emit('movePiece', { room, selectedCell, landingCell })

					selectedCell = castle.rooksStartingSquare
					landingCell = castle.rooksLandingSquare

					// Send rook move to server
					socket.emit('movePiece', { room, turn, selectedCell, landingCell })
				} else {
					landingCell = chessBoard.identifyCell(e.target)

					// const backRank = turn === 'white' ? 0 : 7
					// const promotePawn =
					// 	selectedPiece.name === 'pawn' && backRank == landingCell.cellRow
					// 		? true
					// 		: false
					// console.log('logging', backRank)

					// Send move to server
					socket.emit('movePiece', { room, turn, selectedCell, landingCell })
				}

				// Reset turn variables
				selectedPiece = false
				legalMove = false
			} else selectedPiece = null
		}
	}
})

//______________________________________________________________
// Listen for piece moves

socket.on('movePiece', async ({ turn, selectedCell, landingCell }) => {
	currentPlayer.turn = turn
	const selectedSquare = chessBoard.selectSquare(selectedCell)
	const landingSquare = chessBoard.selectSquare(landingCell)
	let selectedPiece = selectedSquare.piece
	const backRank = turn === 'white' ? 7 : 0
	// const promotePawn =
	// 	selectedPiece.name === 'pawn' && backRank == landingCell.cellRow
	// 		? true
	// 		: false
	const promotePawn = true
	// let newPiece

	// Move piece
	currentPlayer.color === turn
		? chessBoard.movePiece(selectedPiece, landingSquare, currentPlayer)
		: chessBoard.movePiece(selectedPiece, landingSquare, opponent)

	// currentPlayer.promotePawn()
	if (promotePawn) {
		if (currentPlayer.color !== turn) {
			const newPiece = await currentPlayer.selectPieceModal()
			console.log('newPiece', newPiece)
		}
		// while (!newPiece) {
		// newPiece = await currentPlayer.selectPieceModal()
		// console.log('before newPiece', newPiece)
		// }
		console.log('after newPiece', newPiece)
		// selectedPiece =
		// 	currentPlayer.color === turn
		// 		? opponent.promotePawn(selectedPiece, 'queen')
		// 		: currentPlayer.promotePawn(selectedPiece, 'queen')
	}
	// read pick then promotPawn
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

// promoteModal.addEventListener('click', async (e) => {
// 	console.log(currentPlayer.color)
// 	newPiece = await {
// 		piece: e.target.dataset.piece,
// 		color: currentPlayer.color,
// 	}
// 	promoteModal.style.visibility = 'hidden'
// })

socket.on('winStatus', () => {
	check.innerHTML = 'CHECKMATE!'
})

leaveGameButton.addEventListener('click', () => {
	socket.emit('playerDisconnected')
	window.location.href = 'lobby.html'
})

/////////////////////////////////// NOTES ///////////////////////////////////

// 1. "pawn promotion"
// 2. red square around king if in check. maybe run it from chessBoard
// or add chessBoard to function
// 2. rooms don't show up if created before other user joins lobby
// 3. "pawn en passant"
// 4. wait for pieces to appear for both clients before allowing moves
// 5. after checkmate, smoothly send clients to lobby
// 6. send one or both clients back to lobby after a page reload

// pawns aren't putting king in check
// error when I try castling on move one
// remove socket.emit('info') && socket.on('info')
// may not need king variable in castling logic pieces.js
// double check if isCastling is needed
// need to allow castling in getAvailableMoves
// need to add squares to kings targetSquares
// getAvailableMoves needs to cycle through every piece when a pawn gets promoted
// Do I need socket.off()?
