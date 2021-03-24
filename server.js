/////////////////// remove uneeded imports like qs ///////////////////

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

const express = require('express')
const session = require('express-session')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, { cors: true })
const methodOverride = require('method-override')
const {
	Player,
	addPlayerToRoom,
	getPlayerByName,
	removePlayer,
	removeFromWaitList,
} = require('./utils/players')
let { players, playersWaiting } = require('./utils/players')

// Middleware //
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
	})
)
app.use(express.static('public'))
// Controllers //
const userController = require('./controllers/users')
app.use('/users', userController)
const lobbyController = require('./controllers/lobby')
app.use('/lobby', lobbyController)

// Routes
app.get('/', (req, res) => {
	// res.redirect('/lobby')
	res.render('lobby.ejs', { username: 'Ryan' })
})

//______________________________________________________________
// START SOCKET CONNECTION HERE

// Run when client connects //
io.on('connection', (socket) => {
	// Listen for signIn event and check if username already exists //
	socket.on('signIn', (username) => {
		const nameExists = players.find((player) => player.username === username)

		if (!players.length || !nameExists) {
			// Create player and add to players array //
			const player = new Player(socket.id, username)
			const isNameAvailable = true

			players.push(player)
			socket.emit('signInStatus', { isNameAvailable, player })
		} else socket.emit('signInStatus', { isNameAvailable: false })
	})

	// Listen for name and room sent by client through the 'join' event //
	socket.on('enterLobby', () => {
		socket.emit('playersWaiting', playersWaiting)
	})

	socket.on('createGame', (username) => {
		const player = getPlayerByName(username)
		playersWaiting.push(player)

		socket.emit('joinGame', player)
		// io.emit('playersWaiting', playersWaiting)
	})

	socket.on('joinGame', ({ username, room }) => {
		// dont allow more than two players to enter room

		// Join socket to a given room //
		socket.join(room)

		addPlayerToRoom(socket.id, username, room)
	})

	socket.on('updatePlayersWaiting', (id) => {
		// Remove player from wait list //
		playersWaiting = removeFromWaitList(id)

		// Send list of players waiting to client //
		socket.broadcast.emit('playersWaiting', playersWaiting)
	})

	socket.on('disconnect', () => {
		// const player = removePlayer(socket.id)
		// if (player) {
		// Send players and room info to client //
		// 	io.to(player.room).emit('playerDisconnected', players)
		// }
		// )}
	})

	socket.on('signOut', () => {
		console.log('logging out')
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
	// socket.on('playerDisconnected', () => {
})

//______________________________________________________________

const { PORT } = process.env

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
