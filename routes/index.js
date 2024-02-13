const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res) => {
	res.render('index');
});
router.get('/log-in-failure', (req, res) => {
	res.render('login_form_failure');
});
router.post(
	'/log-in-failure',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/log-in-failure',
	})
);

module.exports = router;
