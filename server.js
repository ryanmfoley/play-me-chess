const path = require('path')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, { cors: true })
const {
	Player,
	addPlayerToRoom,
	getPlayerByName,
	removePlayer,
	removeFromWaitList,
} = require('./utils/players')
let { players, playersWaiting } = require('./utils/players')

// Set static folder //
app.use(express.static(path.join(__dirname, 'public')))

//______________________________________________________________
// START SOCKET CONNECTION HERE

// Run when client connects //
io.on('connection', (socket) => {
	// Listen for signIn event and check if username already exists //
	socket.on('signIn', (username) => {
		const nameExists = players.find((player) => player.username === username)
		let isNameAvailable

		if (!players.length || !nameExists) {
			// Create player and add to players array //
			const player = new Player(socket.id, username)
			players.push(player)

			isNameAvailable = true
		} else isNameAvailable = false

		socket.emit('signInStatus', isNameAvailable)
	})

	// Listen for name and room sent by client through the 'join' event //
	socket.on('enterLobby', () => {
		socket.emit('playersWaiting', playersWaiting)
	})

	socket.on('createGame', (username) => {
		const player = getPlayerByName(username)
		playersWaiting.push(player)

		socket.emit('joinGame', player)
		io.emit('playersWaiting', playersWaiting)
	})

	socket.on('joinGame', ({ username, room }) => {
		// dont allow more than two players to enter room

		// Join socket to a given room //
		socket.join(room)

		addPlayerToRoom(socket.id, username, room)
	})

	// socket.on('joinRoom', async ({ username, room }) => {
	socket.on('joinRoom', ({ username, room }) => {
		// Create player //
		const player = new Player(socket.id, username, room)

		// Send currentPlayer to client //
		socket.emit('joinRoom', player)

		// Send list of players to client //
		io.emit('playersLoggedIn', players)
	})

	socket.on('updatePlayersWaiting', (id) => {
		// Remove player from wait list //
		playersWaiting = removeFromWaitList(id)

		// Send list of players waiting to client //
		socket.broadcast.emit('playersWaiting', playersWaiting)
	})

	socket.on('movePiece', ({ room, turn, selectedCell, landingCell }) => {
		// Change turn //
		turn = turn === 'white' ? 'black' : 'white'

		// Send game state to client //
		io.to(room).emit('movePiece', {
			turn,
			selectedCell,
			landingCell,
		})
	})

	// Send promoted piece //
	socket.on('promotePawn', (room, newPiece) => {
		io.to(room).emit('promotePawn', newPiece)
	})

	// Runs when client disconnects //
	socket.on('playerDisconnected', () => {
		const player = removePlayer(socket.id)

		// if (player) {

		// Send players and room info to client //
		// 	io.to(player.room).emit('playerDisconnected', players)
		// }
	})
})

//______________________________________________________________

const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
