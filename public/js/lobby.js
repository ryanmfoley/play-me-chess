const username = /username=(.*)/.exec(window.document.cookie)[1]
const createGameBtn = document.querySelector('#create-game-btn')
const logOutBtn = document.querySelector('#logout-btn')
const logOutForm = document.querySelector('#logout-form')
const lobbyTable = document.querySelector('#lobby-table tbody')
const socket = io()

// Send username to server //
socket.emit('login', username)

// Get list of opened games and generate a table //
socket.on('playersWaiting', (playersWaiting) => {
	// Clear table //
	lobbyTable.innerHTML = ''

	// Generate first 6 empty rows //
	for (let i = 0; i < 5; i++) {
		const row = lobbyTable.insertRow()
		row.insertCell()
		row.insertCell()
	}

	// Create table body //
	playersWaiting.forEach(({ username, id }, index) => {
		const name = document.createTextNode(username)
		const joinGameBtn = document.createElement('button')

		joinGameBtn.innerText = 'Play Me'
		joinGameBtn.className = 'join-game-btn w-75 btn btn-dark'
		joinGameBtn.onclick = () => {
			const isUserRyan = username === 'Ryan_Foley' ? true : false

			socket.emit('updatePlayersWaiting', id)
			socket.emit('joinGame', { id, color: 'black', isUserRyan })

			setTimeout(() => {
				window.location.href = '/chess'
			}, 100)
		}

		if (index < 5) {
			const rows = document.querySelectorAll('tbody > tr')
			const [nameCell, inviteCell] = rows[index].cells

			nameCell.innerHTML = '<td></td>'
			nameCell.appendChild(name)

			inviteCell.innerHTML = '<td></td>'
			inviteCell.appendChild(joinGameBtn)
			inviteCell.classList.add('text-center')
		} else {
			const row = lobbyTable.insertRow()
			const nameCell = row.insertCell()
			const inviteCell = row.insertCell()

			nameCell.innerHTML = '<td></td>'
			nameCell.appendChild(name)

			inviteCell.innerHTML = '<td></td>'
			inviteCell.appendChild(joinGameBtn)
			inviteCell.classList.add('text-center')
		}
	})
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
