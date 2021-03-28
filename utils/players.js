let players = []
let playersWaiting = []
let playersInRoom = []

function Player(id, username, room = id) {
	this.id = id
	this.username = username
	this.room = room
}

// const addPlayer = (newPlayer) => {
// 	if (!players.length) {
// 		players.push(newPlayer)
// 	} else if (!players.some((player) => player.username === newPlayer.username))
// 		players.push(newPlayer)
// }

const addPlayerToRoom = (id, { username, room }) => {
	const player = new Player(id, username, room)

	// If user doesn't already exist //
	if (!playersInRoom.find((player) => player.username === username))
		playersInRoom.push(player)
}

const addToWaitList = (player) => {
	const nameExists = playersWaiting.find(
		({ username }) => player.username === username
	)

	// if (!playersWaiting.length || !nameExists) {
	// Create player and add to playersWaiting array //
	playersWaiting.push(player)
	// }
}

const getPlayerByName = (name) =>
	players.find((player) => player.username === name)

const removePlayer = (id) =>
	(players = players.filter((player) => player.id !== id))

const removeFromWaitList = (id) =>
	(playersWaiting = playersWaiting.filter((player) => player.id !== id))

module.exports = {
	Player,
	addPlayerToRoom,
	addToWaitList,
	getPlayerByName,
	players,
	playersWaiting,
	removePlayer,
	removeFromWaitList,
}
