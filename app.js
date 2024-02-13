const express = require('express');
// const createError = require('http-errors');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const mongoDb = process.env.MONGODB_URI;

mongoose.connect(mongoDb);

const db = mongoose.connection;

db.on(
	'error',
	console.error.bind(console, 'mongo conection error')
);
db.on(
	'connected',
	console.log.bind(console, 'connected to database')
);

const app = express();

app.use(passport.initialize());
app.use(
	session({
		secret: 'cats',
		resave: false,
		saveUninitialized: true,
	})
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

const User = require('./models/user');
passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await User.findOne({
				username: username,
			});
			if (!user) {
				return done(null, false, {
					message: 'Incorrect username',
				});
			}

			const match = await bcrypt.compare(
				password,
				user.password
			);
			if (!match) {
				// passwords do not match!
				return done(null, false, {
					message: 'Incorrect password',
				});
			}
			return done(null, user);
		} catch (err) {
			return done(err);
		}
	})
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (err) {
		done(err);
	}
});

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

// view engine set up
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(3000, () =>
	console.log('App listening on port 3000')
);
