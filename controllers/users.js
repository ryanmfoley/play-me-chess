const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator')

// GET Login Page //
router.get('/login', (req, res) => {
	res.render('login.ejs', {
		userCheck: '',
		passwordCheck: '',
		usernameInputBorder: '',
		passwordInputBorder: '',
	})
})

// GET Register Page //
router.get('/register', (req, res) => {
	res.render('register.ejs', {
		userCheck: '',
		usernameInputBorder: '',
	})
})

// POST Login Auth //
router.post(
	'/login',
	// Check username //
	body('username', 'username is required').isLength({ min: 1 }).trim().escape(),
	// Check password //
	body('password', 'password is required').isLength({ min: 1 }).trim().escape(),
	(req, res) => {
		// Check for errors //
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			// Form validation failed //
			res.status(400).json({ errors: errors.array() })
			return
		}

		User.findOne({ username: req.body.username })
			.then((user) => {
				if (user) {
					// Username valid //
					if (bcrypt.compareSync(req.body.password, user.password)) {
						// Username and Password valid //
						req.session.currentUser = user

						res.redirect('/')
					} else {
						// Password invalid //
						res.render('login.ejs', {
							userCheck: '',
							passwordCheck: 'error',
							usernameInputBorder: '',
							passwordInputBorder: 'is-invalid',
						})
					}
				} else {
					// Username invalid //
					res.render('login.ejs', {
						userCheck: 'error',
						passwordCheck: '',
						usernameInputBorder: 'is-invalid',
						passwordInputBorder: '',
					})
				}
			})
			.catch((err) => res.status(500).send({ msg: err.message }))
	}
)

// POST Register Auth //
router.post(
	'/register',
	// Check username //
	body('username', 'username is required').isLength({ min: 1 }).trim().escape(),
	// Check password //
	body('password', 'password is required').isLength({ min: 1 }).trim().escape(),
	(req, res) => {
		// Check for errors //
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			// Form validation failed //
			res.status(400).json({ errors: errors.array() })
			return
		}

		User.findOne({ username: req.body.username })
			.then((user) => {
				if (user) {
					console.log('register')
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
						.catch((err) => status(500).send({ msg: err.message }))
				}
			})
			.catch((err) => res.status(500).send({ msg: err.message }))
	}
)

// Logout //
router.delete('/', (req, res) => req.session.destroy(() => res.redirect('/')))

module.exports = router
