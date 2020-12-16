const createGameBtn = document.querySelector('#create-game-btn')

// Get name from URL
const { username } = Qs.parse(location.search, { ignoreQueryPrefix: true })

// don't forget about the if statement for if 1player in room
const generateTable = (table, data) => {
	data.forEach((elem) => {
		const row = table.insertRow()
		const nameCell = row.insertCell()
		const name = document.createTextNode(elem.username)
		nameCell.appendChild(name)
		const roomCell = row.insertCell()
		const enterRoomBtn = document.createElement('button')
		// enterRoomBtn.setAttribute('class', 'play-me-btn')
		enterRoomBtn.innerText = 'Play Me'
		enterRoomBtn.value = elem.id
		enterRoomBtn.onclick = function (e) {
			const room = e.target.value
			window.location.href = `/chess.html?username=${username}&room=${room}`
		}
		roomCell.appendChild(enterRoomBtn)
	})
}

// Add rooms to DOM
const lobbyTable = document.querySelector('.lobby-rooms')

const socket = io()

// Get list of players in lobby
socket.on('playersInLobby', (players) => {
	// console.log('lobby', players)
	generateTable(lobbyTable, players)
})

createGameBtn.addEventListener('click', () => {
	// Join lobby
	socket.emit('joinRoom', { username })

	// Get currentPlayer
	socket.on('joinRoom', ({ username, room }) => {
		console.log('bloop', room)
		// Send player to game room
		window.location.href = `/chess.html?username=${username}&room=${room}`
	})
})
