const form = document.querySelector('form')
const usernameInput = document.getElementById('username')
const signInBtn = document.querySelector('button')
const socket = io()

// Handle form submit //
form.addEventListener('submit', (e) => {
	e.preventDefault()

	const username = e.target.username.value.trim()

	socket.emit('signIn', username)
	// Check if username already exist //
	socket.on('signInStatus', (isNameAvailable) => {
		if (isNameAvailable) {
			// Send player to lobby //
			window.location.href = '/lobby.html?username=' + username
		} else {
			setError(usernameInput)
		}
	})
})

function setError(input) {
	const form = input.parentElement
	form.className = 'signin-form error'
}
