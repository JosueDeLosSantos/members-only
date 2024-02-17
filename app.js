const express = require('express');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const logger = require('morgan');
require('dotenv').config();
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

const port = process.env.PORT || 3000;

const app = express();

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

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(passport.initialize());
app.use(
	session({
		secret: 'cats',
		resave: false,
		saveUninitialized: true,
	})
);
app.use(passport.session());

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
	res.locals.currentPath = `${req.protocol}://${req.rawHeaders[1]}${req.originalUrl}`;
	res.locals.mainPath = `${req.protocol}://${req.rawHeaders[1]}/`;
	next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

/* // catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error =
		req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app; */
