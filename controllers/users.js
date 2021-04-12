const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()
const User = require('../models/users')

router.get('/register', (req, res) => {
	res.render('register.ejs', {
		userCheck: '',
		usernameInputBorder: '',
	})
})

router.post('/register', (req, res, next) => {
	User.findOne({ username: req.body.username }).then((user) => {
		if (user) {
			res.render('register.ejs', {
				userCheck: 'error',
				usernameInputBorder: 'is-invalid',
			})
		} else {
			req.body.password = bcrypt.hashSync(
				req.body.password,
				bcrypt.genSaltSync(10)
			)

			User.create(req.body)
				.then(() => res.redirect('/'))
				.catch(next)
		}
	})
})

router.get('/login', (req, res) => {
	res.render('login.ejs', {
		userCheck: '',
		passwordCheck: '',
		usernameInputBorder: '',
		passwordInputBorder: '',
	})
})

router.post('/login', (req, res) => {
	User.findOne({ username: req.body.username }).then((user) => {
		if (user) {
			if (bcrypt.compareSync(req.body.password, user.password)) {
				req.session.currentUser = user

				res.redirect('/')
			} else {
				res.render('login.ejs', {
					userCheck: '',
					passwordCheck: 'error',
					usernameInputBorder: '',
					passwordInputBorder: 'is-invalid',
				})
			}
		} else {
			res.render('login.ejs', {
				userCheck: 'error',
				passwordCheck: '',
				usernameInputBorder: 'is-invalid',
				passwordInputBorder: '',
			})
		}
	})
})

router.delete('/', (req, res) => req.session.destroy(() => res.redirect('/')))

module.exports = router
