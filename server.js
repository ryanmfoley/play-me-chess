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

const connections = [null, null]

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

		// Send currentPlayer to client
		socket.emit('joinRoom', player)

		// Get list of players
		const players = getPlayers()

		// Send list of players to client
		io.emit('playersInLobby', players)
	})

	socket.on('joinGame', ({ username, room }) => {
		// Join socket to a given room
		socket.join(room)

		addPlayerToRoom(socket.id, username, room)

		const plyrs = getPlayersInRoom(room)

		const turn = plyrs.length === 1 ? 'white' : 'black'

		// Tell the client what player number they are
		socket.emit('players-turn', turn)

		if (turn === 'black') io.to(room).emit('info')
	})

	socket.on('move-piece', ({ room, turn, selectedCell, landingCell }) => {
		// Change turn
		turn = turn === 'white' ? 'black' : 'white'

		// Send game state to client
		io.to(room).emit('move-piece', {
			room,
			turn,
			selectedCell,
			landingCell,
		})
	})

	// Tell everyone what player number just connected
	// socket.broadcast.emit('player-connection', turn)

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
