const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const passport = require('passport');
const bcrypt = require('bcryptjs');

// Display User create form on GET
exports.user_create_get = (req, res, next) => {
	res.render('user_create_form', {
		title: 'Sign up',
		user: undefined,
		passwordConfirmation: undefined,
		admin: undefined,
		errors: false,
	});
};

// User create form on POST
exports.user_create_post = [
	// Validate and sanitize fields.
	body('first_name')
		.trim()
		.isLength({ min: 2 })
		.escape()
		.withMessage('First name must be specified.')
		.isAlpha()
		.withMessage('First name has non-alpha characters.'),
	body('last_name')
		.trim()
		.isLength({ min: 2 })
		.escape()
		.withMessage('Last name must be specified.'),
	body('username')
		.trim()
		.isLength({ min: 2 })
		.escape()
		.withMessage('username must be specified.')
		.isAlphanumeric()
		.withMessage(
			'username has non-alphanumeric characters.'
		),
	body('password')
		.trim()
		.isLength({ min: 6 })
		.escape()
		.withMessage('password must be specified.')
		.isAlphanumeric()
		.withMessage(
			'Password has non-alphanumeric characters.'
		),
	body('passwordConfirmation')
		.custom((value, { req }) => {
			return value === req.body.password;
		})
		.withMessage('Passwords do not match'),
	// Process request after validation and sanitization.
	asyncHandler(async (req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create User object with escaped and trimmed data
		const user = new User({
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			username: req.body.username,
			password: req.body.password,
			admin: req.body.admin ? true : false,
		});

		bcrypt.hash(
			req.body.password,
			10,
			async (err, hashedPassword) => {
				if (!errors.isEmpty() || err) {
					// There are errors. Render form again with sanitized values/errors messages.
					res.render('user_create_form', {
						title: 'Sign up',
						user: user,
						passwordConfirmation:
							req.body.passwordConfirmation,
						admin: req.body.admin,
						errors: errors.array(),
					});
					return;
				} else {
					// Data from form is valid.
					// store hashedPassword in DB
					user.password = hashedPassword;
					// Save user
					await user.save();
					res.redirect('/users/log-in');
				}
			}
		);
	}),
];

// Display login form on GET
exports.login_form_get = (req, res, next) => {
	res.render('login_form');
};

// login form on POST
exports.login_form_post = passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/users/log-in-failure',
});
// Display failure login form on GET
exports.login_form_failure_get = (req, res, next) => {
	res.render('login_form_failure');
};

// Failure login form on POST
exports.login_form_failure_post = passport.authenticate(
	'local',
	{
		successRedirect: '/',
		failureRedirect: '/users/log-in-failure',
	}
);

exports.logout = (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}

		res.redirect('/');
	});
};
