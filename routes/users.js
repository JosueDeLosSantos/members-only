const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/userController');

// GET request for creating a user
router.get('/sign-up', user_controller.user_create_get);

module.exports = router;
