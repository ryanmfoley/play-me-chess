const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, { cors: true })

const {
	User,
	addUser,
	getCurrentUser,
	removeUser,
	getUsersInRoom,
} = require('./users')

//______________________________________________________________
// START SOCKET CONNECTION HERE

// Run when client connects
io.on('connection', (socket) => {
	// Listen for name and room sent by client through the 'join' event
	socket.on('joinRoom', async ({ name, room }) => {
		// Create User
		let user = await new User(socket.id, name, room)

		// Add user to list or users
		addUser(user)
		// Join socket to a given room
		socket.join(user.room)

		// Welcome current user
		socket.emit('chat-message', {
			user: 'admin',
			text: 'Welcome to ProjectChat!',
		})

		// // Notify other clients a new user has joined
		socket.broadcast.to(user.room).emit('chat-message', {
			user: 'admin',
			text: `${user.name} has joined!`,
		})

		const users = await getUsersInRoom(user.room)

		// Send room info to the channel that the client is in
		io.to(user.room).emit('usersInRoom', { users })
		// }
	})

	// Listen for messages from client
	socket.on('send-chat-message', async (message, clearMessage) => {
		const user = await getCurrentUser(socket.id)

		if (user) {
			// Send messages to current users room
			io.to(user.room).emit('chat-message', {
				user: user.name,
				text: message,
			})
		}

		clearMessage()
	})

	// Runs when client disconnects
	socket.on('user-disconnected', () => {
		const user = removeUser(socket.id)

		if (user) {
			socket.broadcast.to(user.room).emit('chat-message', {
				user: 'admin',
				text: `${user.name} has left the chess game`,
			})

			const users = getUsersInRoom(user.room)

			// Send users and room info to client
			io.to(user.room).emit('user-disconnected', users)
		}
	})
})

//______________________________________________________________

const PORT = process.env.PORT || 8000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
