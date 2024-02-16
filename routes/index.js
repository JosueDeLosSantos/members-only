const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const Post = require('../models/post');

router.get(
	'/',
	asyncHandler(async (req, res, next) => {
		const allPosts = await Post.find({})
			.sort({ date: 1 })
			.populate('user')
			.exec();
		res.render('index', {
			posts: allPosts,
		});
	})
);

router.post(
	'/',
	asyncHandler(async (req, res, next) => {
		// Delete specified posts
		await Post.findByIdAndDelete(req.body.delete);
		res.redirect('/');
	})
);

router.get('/favicon.ico', (req, res) => res.status(204));

module.exports = router;
