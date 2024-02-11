const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/userController');

// GET request for creating a user
router.get('/sign-up', user_controller.user_create_get);
// POST request for creating a user
router.post('/sign-up', user_controller.user_create_post);

module.exports = router;
