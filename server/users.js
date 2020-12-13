let users = []

// Create User
function User(id, name, room) {
	this.id = id
	this.name = name
	this.room = room
}

const addUser = (newUser) => {
	if (!users.length) {
		users.push(newUser)
	} else if (
		!users.some(
			(user) => user.name === newUser.name && user.room === newUser.room
		)
	) {
		users.push(newUser)
	}
}

// Get current user
const getCurrentUser = (id) => users.find((user) => user.id === id)

// Get users in chatroom
const getUsersInRoom = (room) => users.filter((user) => user.room === room)

const removeUser = (id) => {
	// Find user to remove
	const user = users.find((user) => user.id === id)

	// Remove user from chatroom
	users = users.filter((user) => user.id !== id)
	return user
}

module.exports = {
	User,
	addUser,
	getCurrentUser,
	removeUser,
	getUsersInRoom,
}
