const path = require('path')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
// const io = require('socket.io')(server)
const io = require('socket.io')(server, { cors: true })

const {
	Player,
	addPlayer,
	getCurrentPlayer,
	getPlayers,
	getPlayersInRoom,
	removePlayer,
} = require('./utils/players')

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

const connections = [null, null]

//______________________________________________________________
// START SOCKET CONNECTION HERE

// Run when client connects
io.on('connection', (socket) => {
	// Listen for name and room sent by client through the 'join' event
	socket.on('playersInLobby', () => {
		// Get list of players in lobby
		const players = getPlayers()

		// Send list of players to client
		socket.emit('playersInLobby', players)
		// console.log('server', players)
	})

	socket.on('updatePlayersInLobby', (roomID) => {
		// Get list of players in lobby
		const players2 = getPlayers()

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

		const players = getPlayers()

		// Send currentPlayer to client
		socket.emit('joinRoom', player)

		// Send list of players to client
		io.emit('playersInLobby', players)
	})

	socket.on('joinGame', ({ username, room }) => {
		// Join socket to a given room
		socket.join(room)

		io.to(room).emit('test', `this is a test in room ${room}`)
	})

	let turn = -1
	for (const i in connections) {
		if (connections[i] === null) {
			turn = i
			break
		}
	}

	// Tell the client what player number they are
	socket.emit('players-turn', turn)

	// console.log('from server', `Player ${turn} has connected`)

	// Ignore player 3
	if (turn === -1) return

	connections[turn] = false

	// Tell everyone what player number just connected
	socket.broadcast.emit('player-connection', turn)

	// Runs when client disconnects
	socket.on('player-disconnected', () => {
		const player = removePlayer(socket.id)
		// console.log('from server', `${player} has left`)

		// if (player) {
		// 	const players = getPlayersInRoom(player.room)

		// 	// Send players and room info to client
		// 	io.to(player.room).emit('player-disconnected', players)
		// }
	})
})

//______________________________________________________________

const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

////////////////////////// NOTES //////////////////////////
