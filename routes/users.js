const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/userController');

// GET request for creating a user
router.get('/sign-up', user_controller.user_create_get);
// POST request for creating a user
router.post('/sign-up', user_controller.user_create_post);
// GET request for login form
router.get('/log-in', user_controller.login_form_get);
// POST request for login form
router.post('/log-in', user_controller.login_form_post);
// GET request for failure login form
router.get(
	'/log-in-failure',
	user_controller.login_form_failure_get
);
// POST request for login form
router.post(
	'/log-in-failure',
	user_controller.login_form_failure_post
);

// GET request for logout
router.get('/log-out', user_controller.logout);
// GET request for a member form
router.get('/become-member', user_controller.become_member_get);
// POST request for a member form
router.post(
	'/become-member',
	user_controller.become_member_post
);

module.exports = router;
