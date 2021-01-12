const createGameBtn = document.querySelector('#create-game-btn')

// Get name from URL
const { username } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const clearTable = (table) => {
	table.innerHTML = ''
	for (var i = table.rows.length - 1; i > 0; i--) {
		table.deleteRow(i)
	}
}

const generateTable = (table, data) => {
	// Create table head
	const thead = table.createTHead()
	const theadRow = thead.insertRow()
	const th1 = document.createElement('th')
	const th2 = document.createElement('th')
	const playerText = document.createTextNode('Player')
	const inviteText = document.createTextNode('Invite')
	th1.appendChild(playerText)
	theadRow.appendChild(th1)
	th2.appendChild(inviteText)
	theadRow.appendChild(th2)

	// Create table body
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
			window.location.href = `/chess.html?username=${username}&room=${roomID}&color=black`
		}
		roomCell.appendChild(enterRoomBtn)
	})
}

// Add rooms to DOM
const lobbyTable = document.querySelector('.lobby-rooms')

const socket = io()

// Get list of players in lobby
socket.on('playersInLobby', (players) => {
	// Clear table
	clearTable(lobbyTable)

	// Generate a table or rooms
	generateTable(lobbyTable, players)
})

createGameBtn.addEventListener('click', () => {
	// Join lobby
	socket.emit('joinRoom', { username })

	socket.on('joinRoom', ({ username, room }) => {
		// Send player to game room
		window.location.href = `/chess.html?username=${username}&room=${room}&color=white`
	})
})
