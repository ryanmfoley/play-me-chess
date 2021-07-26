const express = require('express')
const router = express.Router()

const isAuthenticated = (req, res, next) => {
	if (req.session.currentUser) {
		return next()
	} else res.redirect('/users/login')
}

router.get('/', isAuthenticated, async (req, res) => {
	const { username } = req.session.currentUser

	res.cookie('username', username)
	res.sendFile('/public/lobby.html', { root: process.cwd() })
})

module.exports = router
