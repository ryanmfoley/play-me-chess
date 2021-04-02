const form = document.querySelector('form')
const usernameInput = document.getElementById('username')
const loginBtn = document.querySelector('button')
const socket = io()

// Handle form submit //
form.addEventListener('submit', (e) => {
	e.preventDefault()

	const username = e.target.username.value.trim()

	socket.emit('login', username)
	// Check if username already exist //
	socket.on('loginStatus', ({ isNameAvailable, player }) => {
		if (isNameAvailable) {
			// Send player to lobby //
			window.location.href = '/lobby'
		} else {
			setError(usernameInput)
		}
	})
})

function setError(input) {
	const form = input.parentElement
	form.className = 'login-form error'
}
