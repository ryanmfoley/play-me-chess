let players = []

function Player(id, username, room = id) {
	this.id = id
	this.username = username
	this.room = room
}

const addPlayer = (newPlayer) => {
	if (!players.length) {
		players.push(newPlayer)
	} else if (!players.some((player) => player.username === newPlayer.username))
		players.push(newPlayer)
}

// Get current player
const getCurrentPlayer = (id) => players.find((player) => player.id === id)

// Get players
const getPlayers = () => players

const getPlayersInRoom = (room) =>
	playersInRoom.filter((player) => player.room === room)

const removePlayer = (id) => {
	// Find player to remove
	const player = players.find((player) => player.id === id)

	// Remove player from room
	players = players.filter((player) => player.id !== id)
	return player
}

module.exports = {
	Player,
	addPlayer,
	getCurrentPlayer,
	getPlayers,
	getPlayersInRoom,
	removePlayer,
}
