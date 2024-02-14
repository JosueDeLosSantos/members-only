const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const Post = require('../models/post');

router.get(
	'/',
	asyncHandler(async (req, res, next) => {
		const allPosts = await Post.find()
			.sort({ date: 1 })
			.exec();
		res.render('index', { posts: allPosts });
	})
);

module.exports = router;
