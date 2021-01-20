const path = require('path')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, { cors: true })

const {
	Player,
	addPlayer,
	addPlayerToRoom,
	getCurrentPlayer,
	getPlayers,
	getPlayersInRoom,
	removePlayer,
} = require('./utils/players')

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

//______________________________________________________________
// START SOCKET CONNECTION HERE

let turn = 'white'

// Run when client connects
io.on('connection', (socket) => {
	// Listen for name and room sent by client through the 'join' event
	socket.on('playersInLobby', () => {
		// Get list of players in lobby
		const players = getPlayers()

		// Send list of players to client
		socket.emit('playersInLobby', players)
	})

	socket.on('updatePlayersInLobby', (roomID) => {
		// Remove player from lobby
		removePlayer(roomID)

		// Get list of players in lobby
		const players = getPlayers()

		// Send list of players to client
		io.emit('playersInLobby', players)
	})

	socket.on('joinRoom', async ({ username, room }) => {
		// Create player
		const player = await new Player(socket.id, username, room)

		// Add player to list of players
		addPlayer(player)

		// Send currentPlayer to client
		socket.emit('joinRoom', player)

		// Get list of players
		const players = getPlayers()

		// Send list of players to client
		io.emit('playersInLobby', players)
	})

	socket.on('joinGame', ({ username, room, color }) => {
		// Join socket to a given room
		socket.join(room)

		// const plyrs = getPlayersInRoom(room)

		addPlayerToRoom(socket.id, username, room)

		if (color === 'black') io.to(room).emit('info')
	})

	//Server
	// socket.on('exampleEvent', (data) => {
	// 	console.log('blah bloop')
	// 	io.emit('exampleEvent', 'hello from server')
	// })

	socket.on('movePiece', ({ room, turn, selectedCell, landingCell }) => {
		// Change turn
		turn = turn === 'white' ? 'black' : 'white'

		// Send game state to client
		io.to(room).emit('movePiece', {
			turn,
			selectedCell,
			landingCell,
		})
	})

	socket.on('promotePawn', (newPiece) => {
		console.log(newPiece)
	})

	socket.on('winStatus', () => {
		// Join socket to a given room
		socket.broadcast.emit('winStatus')
	})

	// Tell everyone what player number just connected
	// socket.broadcast.emit('playerConnection', turn)

	// Runs when client disconnects
	socket.on('playerDisconnected', () => {
		const player = removePlayer(socket.id)

		// if (player) {
		// 	const players = getPlayersInRoom(player.room)

		// 	// Send players and room info to client
		// 	io.to(player.room).emit('playerDisconnected', players)
		// }
	})
})

//______________________________________________________________

const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

////////////////////////// NOTES //////////////////////////
