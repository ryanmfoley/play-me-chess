const express = require('express')
const router = express.Router()

const isAuthenticated = (req, res, next) => {
	if (req.session.currentUser) {
		return next()
	} else res.redirect('/users/login')
}

router.use(isAuthenticated)

router.get('/', isAuthenticated, (req, res) => {
	const { username } = req.session.currentUser
	res.cookie('username', username)

	res.sendFile('/public/chess.html', { root: process.cwd() })
})

router.get('/', (req, res) =>
	res.sendFile('/public/chess.html', { root: process.cwd() })
)

module.exports = router
