if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

const express = require('express')
const session = require('express-session')({
	secret: process.env.SECRET,
	resave: true,
	saveUninitialized: true,
})
const sharedSession = require('express-socket.io-session')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, { cors: true })
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')

// Twilio communication API for SMS //
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromNumber = process.env.TWILIO_FROM_NUMBER
const toNumber = process.env.TWILIO_TO_NUMBER
const client = require('twilio')(accountSid, authToken)

// Middleware //
app.use(cookieParser())
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(session)
io.use(
	sharedSession(session, {
		autoSave: true,
	})
)

// Controllers //
app.use('/users', require('./controllers/users'))
app.use('/lobby', require('./controllers/lobby'))
app.use('/chess', require('./controllers/chess'))

// Routes //
app.get('/', (req, res) => res.redirect('/lobby'))

let playersWaiting = []

function Player(id, username, room = id) {
	this.id = id
	this.username = username
	this.room = room
}

function sendText(player) {
	client.messages
		.create({
			body: `${player} wants to play a game with you.`,
			from: fromNumber,
			to: toNumber,
		})
		.then((msg) => console.log(msg))
		.catch((err) => console.error({ msg: err.message }))
}

//______________________________________________________________
// START SOCKET CONNECTION HERE

// Run when client connects //
io.on('connection', (socket) => {
	socket.once('login', (username) => {
		const player = new Player(socket.id, username)

		socket.handshake.session.player = player
		socket.handshake.session.save()

		socket.emit('playersWaiting', playersWaiting)
	})

	socket.once('logout', () => {
		const { player } = socket.handshake.session

		if (player) {
			playersWaiting = playersWaiting.filter(
				(playerWaiting) => playerWaiting.id !== player.id
			)
			io.emit('playersWaiting', playersWaiting)
			delete player
			socket.handshake.session.save()
		}
	})

	socket.once('joinGame', ({ id, color, isUserRyan }) => {
		const { player } = socket.handshake.session

		if (id) {
			// Joining already created game //
			player.room = id
		} else {
			// New game created //
			playersWaiting.push(player)
		}

		player.color = color

		socket.handshake.session.save()

		if (isUserRyan) sendText(player.username)

		setTimeout(() => {
			io.emit('playersWaiting', playersWaiting)
		}, 500)
	})

	socket.once('leaveGame', async (id) => {
		if (socket.handshake.session.player) {
			const { room } = await socket.handshake.session.player

			io.to(room).emit('leaveGame', id)
		}
	})

	socket.on('updatePlayersWaiting', (id) => {
		// Remove player from wait list //
		playersWaiting = playersWaiting.filter((player) => player.id !== id)

		// Send list of players waiting to client //
		io.emit('playersWaiting', playersWaiting)
	})

	socket.once('enterGameRoom', () => {
		const {
			player,
			player: { room },
		} = socket.handshake.session

		// Join socket to a given room //
		socket.join(room)

		socket.emit('enterGameRoom', player)

		socket.on('getPlayersNames', () => {
			io.to(room).emit('getPlayersNames', player)
		})

		if (player.color === 'black') io.to(room).emit('startGame')

		socket.on('movePiece', ({ turn, selectedCell, landingCell }) => {
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
		socket.on('promotePawn', (newPiece) =>
			io.to(room).emit('promotePawn', newPiece)
		)
	})
})

//______________________________________________________________

const { PORT } = process.env

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
