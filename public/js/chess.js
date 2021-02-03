import { chessBoard } from './board.js'
import { placePiecesOnBoard } from './pieces.js'
import { whitePlayer, blackPlayer } from './players.js'

// Get name and room from URL //
const { username, room, color } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
})

const startGameButton = document.querySelector('#start-game')
const leaveGameButton = document.querySelector('#leave-game')
const audio = document.querySelector('audio')
const info = document.querySelector('#info')
const squares = document.querySelector('.board')
const check = document.querySelector('.check-text')
let startGame = false
let selectedCell
let selectedPiece
let landingCell
let landingSquare
let legalMove

const socket = io()

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
	chessBoard.markEnemySquares(currentPlayer, opponent)

	startGame = true
})

squares.addEventListener('click', (e) => {
	const { turn } = currentPlayer

	if (startGame && currentPlayer.color === turn) {
		if (!selectedPiece) {
			selectedCell = chessBoard.identifyCell(e.target)
			const selectedSquare = chessBoard.selectSquare(selectedCell)

			// Check if a piece was selected and it's their turn //
			if (selectedSquare.color === turn) {
				selectedPiece = selectedSquare.piece
			}

			// If piece is selected //
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

					// Send king move to server //
					socket.emit('movePiece', { room, selectedCell, landingCell })

					selectedCell = castle.rooksStartingSquare
					landingCell = castle.rooksLandingSquare

					// Send rook move to server //
					socket.emit('movePiece', { room, turn, selectedCell, landingCell })
				} else {
					landingCell = chessBoard.identifyCell(e.target)

					// Send move to server //
					socket.emit('movePiece', { room, turn, selectedCell, landingCell })
				}

				// Reset turn variables //
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
	opponent.turn = turn

	const activePlayer =
		currentPlayer.color === currentPlayer.turn ? opponent : currentPlayer
	const inActivePlayer =
		currentPlayer.color === currentPlayer.turn ? currentPlayer : opponent
	const selectedSquare = chessBoard.selectSquare(selectedCell)
	const landingSquare = chessBoard.selectSquare(landingCell)
	let selectedPiece = selectedSquare.piece
	const backRank = turn === 'white' ? 7 : 0
	const promotePawn =
		selectedPiece.name === 'pawn' && backRank == landingCell.row ? true : false

	chessBoard.movePiece(
		activePlayer,
		inActivePlayer,
		selectedPiece,
		landingSquare
	)
	chessBoard.displayPieces()

	if (selectedPiece.name === 'king' || selectedPiece.name === 'rook') {
		selectedPiece.moved = true
	}

	//////////////////// Check for en passant ////////////////////
	if (
		selectedPiece.name === 'pawn' &&
		Math.abs(selectedCell.row - landingCell.row) == 2
	) {
		chessBoard.markEnPassantPawns(selectedPiece)
	}

	//////////////////// Check for pawn promotion ////////////////////
	if (promotePawn) {
		let newPiece

		if (currentPlayer.color !== turn) {
			// do I need await??????????????????????????
			newPiece = await currentPlayer.selectPieceModal()
			socket.emit('promotePawn', room, newPiece)
		} else {
			newPiece = await opponent.getPromotedPiece(socket)
		}

		selectedPiece = activePlayer.promotePawn(selectedPiece, newPiece)

		chessBoard.movePiece(
			activePlayer,
			inActivePlayer,
			selectedPiece,
			landingSquare
		)
		chessBoard.displayPieces()
	}

	// Mark enemy squares //
	chessBoard.markEnemySquares(currentPlayer, opponent)

	// Evaluate check //
	inActivePlayer.isKingInCheck(chessBoard)

	// Get available moves //
	inActivePlayer.getAvailableMoves(chessBoard, activePlayer)

	// If king is in check set square to red //
	if (inActivePlayer.inCheck) {
		const { row, col } = inActivePlayer.kingSquare
		chessBoard.board[row][col].cellBox.id = 'checkSquare'
		audio.play()
	} else {
		// Reset check square and display //
		chessBoard.board.forEach((row) =>
			row.forEach((square) => square.cellBox.removeAttribute('id'))
		)
	}

	if (inActivePlayer.checkMate) {
		check.style.display = 'block'
		check.innerHTML = 'CHECKMATE!'
	}

	if (inActivePlayer.staleMate) {
		check.style.display = 'block'
		check.innerHTML = 'STALEMATE'
	}
})

leaveGameButton.addEventListener('click', () => {
	socket.emit('playerDisconnected')
	window.location.href = 'lobby.html'
})

/////////////////////////////////// NOTES ///////////////////////////////////

//////////// use a for loop in getAvailableMoves ////////////
// error when I try castling on move one
// maybe use reduce in getAvailableMoves - use break
// check queen.markEnemySquares ???
// make sure availableMoves doesn't set piece.moved
// look for areas where I can add break

// 1. rooms don't show up if created before other user joins lobby
// 2. create game sends user chess.js with a "waiting for opponent..." modal
// 3. wait for pieces to appear for both clients before allowing moves
// 4. after checkmate, smoothly send clients to lobby
// 5. send one or both clients back to lobby after a page reload
// 6. username displayed along with captured pieces
// 7. draws and stalemates

// code will say if enPassant, then resets switch
// if no en passant, turn option off from pieces
// availableMoves may not accept en passant

// insufficient material
// remove socket.emit('info') && socket.on('info')
// may not need king variable in castling logic - pieces.js
// double check if isCastling is needed
// Do I need socket.off()?
// Double check all async/await to see if they're needed
