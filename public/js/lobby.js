const createGameBtn = document.querySelector('#create-game-btn')

// Get name from URL
const { username } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const generateTable = (table, data) => {
	data.forEach((elem) => {
		const row = table.insertRow()
		const nameCell = row.insertCell()
		const name = document.createTextNode(elem.username)
		nameCell.appendChild(name)
		const roomCell = row.insertCell()
		const enterRoomBtn = document.createElement('button')
		enterRoomBtn.innerText = 'Play Me'
		enterRoomBtn.value = elem.id
		enterRoomBtn.onclick = function (e) {
			const roomID = e.target.value
			socket.emit('updatePlayersInLobby', roomID)
			window.location.href = `/chess.html?username=${username}&room=${roomID}`
		}
		roomCell.appendChild(enterRoomBtn)
	})
}

// Add rooms to DOM
const lobbyTable = document.querySelector('.lobby-rooms')

const socket = io()

// Get list of players in lobby
socket.on('playersInLobby', (players) => {
	lobbyTable.innerHTML = ''
	for (var i = lobbyTable.rows.length - 1; i > 0; i--) {
		lobbyTable.deleteRow(i)
	}
	// Generate a table or rooms
	generateTable(lobbyTable, players)
})

createGameBtn.addEventListener('click', () => {
	// Join lobby
	socket.emit('joinRoom', { username })

	socket.on('joinRoom', ({ username, room }) => {
		// Send player to game room
		window.location.href = `/chess.html?username=${username}&room=${room}`
	})
})
