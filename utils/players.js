let players = []
let playersInRoom = []

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

const addPlayerToRoom = (id, username, room) => {
	const player = new Player(id, username, room)
	if (!playersInRoom.find((player) => player.username === username))
		playersInRoom.push(player)
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
	addPlayerToRoom,
	getCurrentPlayer,
	getPlayers,
	getPlayersInRoom,
	removePlayer,
}
