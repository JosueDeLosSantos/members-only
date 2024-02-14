const express = require('express');
const router = express.Router();

const post_controller = require('../controllers/postController');

// GET request for creating a post
router.get('/create', post_controller.post_create_get);
// POST request for creating a post
router.post('/create', post_controller.post_create_post);

module.exports = router;
