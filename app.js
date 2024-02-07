const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');

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

// view engine set up
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.listen(3000, () =>
	console.log('App listening on port 3000')
);
