const express = require('express')
const router = express.Router()

const isAuthenticated = (req, res, next) => {
	if (req.session.currentUser) {
		return next()
	} else {
		res.redirect('/users/signIn')
	}
}

router.use(isAuthenticated)

router.get('/', isAuthenticated, (req, res) => {
	const { username } = req.session.currentUser
	// res.sendFile('/public/lobby.html', { root: process.cwd() })
	res.render('lobby.ejs', { username })
})

module.exports = router
