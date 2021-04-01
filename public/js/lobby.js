const username = window.document.cookie.split('=')[1]
const createGameBtn = document.querySelector('#create-game')
const logOutBtn = document.querySelector('#logout')
const logOutForm = document.querySelector('#logout-form')
const lobbyTable = document.querySelector('.lobby-rooms')
const socket = io()

function clearTable() {
	lobbyTable.innerHTML = ''
	for (var i = lobbyTable.rows.length - 1; i > 0; i--) {
		lobbyTable.deleteRow(i)
	}
}

function generateTable(playersWaiting) {
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
	playersWaiting.forEach(({ username, id }) => {
		const row = lobbyTable.insertRow()
		const name = document.createTextNode(username)
		const nameCell = row.insertCell()
		const roomCell = row.insertCell()
		const joinGameBtn = document.createElement('button')

		joinGameBtn.innerText = 'Play Me'
		joinGameBtn.onclick = () => {
			socket.emit('updatePlayersWaiting', id)
			socket.emit('joinGame', { id, color: 'black' })

			window.location.href = `/chess`
		}

		nameCell.appendChild(name)
		roomCell.appendChild(joinGameBtn)
	})
}

socket.emit('login', username)

// Get list of opened games and generate a table //
socket.on('playersWaiting', (playersWaiting) => {
	clearTable()
	generateTable(playersWaiting)
})

createGameBtn.addEventListener('click', () => {
	socket.emit('joinGame', { color: 'white' })

	// Send player to game room //
	window.location.href = '/chess'
})

logOutBtn.addEventListener('click', () => {
	socket.emit('logout')
	socket.on('logout', ({ id }) => {
		socket.emit('updatePlayersWaiting', id)
	})
	logOutForm.submit()
})
