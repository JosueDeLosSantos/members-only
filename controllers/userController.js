const User = require('../models/user');
const asyncHandler = require('express-async-handler');

// Display User create form on GET
exports.user_create_get = (req, res, next) => {
	res.render('user_create_form', { title: 'Sign up' });
};
