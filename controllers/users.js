const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()
const User = require('../models/users')

router.get('/', (req, res) => {
	User.find().then((users) => {
		res.render('users.ejs', { users })
	})
})

router.get('/join', (req, res) => {
	res.render('join.ejs')
})

router.post('/join', (req, res) => {
	req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))

	User.create(req.body, (err, createdUser) => res.redirect('/'))
})

router.get('/login', (req, res) => {
	res.render('login.ejs')
})

router.post('/login', (req, res) => {
	User.findOne({ username: req.body.username }, (err, foundUser) => {
		if (err) {
			console.log(err)
			res.send('oops the db had a problem')
		} else if (!foundUser) {
			res.send('<a href="/">Sorry User not found</a>')
		} else {
			if (bcrypt.compareSync(req.body.password, foundUser.password)) {
				req.session.currentUser = foundUser
				res.redirect('/')
			} else res.send('<a href="/"> Password does not match </a>')
		}
	})
})

router.delete('/', (req, res) => req.session.destroy(() => res.redirect('/')))

module.exports = router
