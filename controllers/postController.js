const Post = require('../models/post');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// Display Post create form on GET
exports.post_create_get = (req, res, next) => {
	res.render('post_create_form', {
		title: 'Create Post',
		post: undefined,
		errors: false,
	});
};

// Post create form on POST
exports.post_create_post = [
	// Validate and sanitize fields.
	body('title')
		.trim()
		.isLength({ min: 2 })
		.escape()
		.withMessage('Title must be specified.'),
	body('message')
		.trim()
		.isLength({ min: 10 })
		.escape()
		.withMessage('Message must be specified.'),
	body('date', 'Invalid date').isISO8601().toDate(),
	// Process request after validation and sanitization.
	asyncHandler(async (req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		// Create Post object with escaped and trimmed data
		const post = new Post({
			title: req.body.title,
			message: req.body.message,
			date: req.body.date,
			user: req.user._id,
		});

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.
			res.render('post_create_form', {
				title: 'Create Post',
				post: post,
				errors: errors.array(),
			});
			return;
		} else {
			// Data from form is valid.
			// Save post.
			await post.save();
			res.redirect('/');
		}
	}),
];
