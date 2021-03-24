// const { username } = Qs.parse(location.search, { ignoreQueryPrefix: true })
const createGameBtn = document.querySelector('#create-game-btn')
const lobbyTable = document.querySelector('.lobby-rooms')
const socket = io()

function clearTable() {
	lobbyTable.innerHTML = ''
	for (var i = lobbyTable.rows.length - 1; i > 0; i--) {
		lobbyTable.deleteRow(i)
	}
}

function generateTable(players) {
	// Create table head //
	const inviteText = document.createTextNode('Invite')
	const playerText = document.createTextNode('Player')
	const thead = lobbyTable.createTHead()
	const theadRow = thead.insertRow()
	const th1 = document.createElement('th')
	const th2 = document.createElement('th')

	th1.appendChild(playerText)
	theadRow.appendChild(th1)
	th2.appendChild(inviteText)
	theadRow.appendChild(th2)

	// Create table body //
	players.forEach(({ username, id }) => {
		const row = lobbyTable.insertRow()
		const name = document.createTextNode(username)
		const nameCell = row.insertCell()
		const roomCell = row.insertCell()
		const joinGameBtn = document.createElement('button')

		joinGameBtn.innerText = 'Play Me'
		joinGameBtn.onclick = () => {
			socket.emit('updatePlayersWaiting', id)
			window.location.href = `/chess.html?username=${username}&room=${id}&color=black`
		}

		nameCell.appendChild(name)
		roomCell.appendChild(joinGameBtn)
	})
}

socket.emit('enterLobby')

createGameBtn.addEventListener('click', () => {
	// socket.emit('createGame', username)
	socket.emit('createGame')

	socket.on('joinGame', ({ id }) => {
		// Send player to game room //
		// window.location.href = `/chess.html?username=${username}&room=${id}&color=white`
	})
})

// Get list of opened games and generate a table //
socket.on('playersWaiting', (players) => {
	clearTable()
	generateTable(players)
})
