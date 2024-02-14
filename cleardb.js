#! /usr/bin/env node

require('dotenv').config();

console.log('This script clears all users');

const User = require('./models/user');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));

async function main() {
	console.log('Debug: About to connect');
	await mongoose.connect(mongoDB);
	console.log('Debug: Should be connected?');
	await clearUsers();
	console.log('Debug: Closing mongoose');
	mongoose.connection.close();
}

async function clearUsers() {
	await User.deleteMany({});
	console.log('deleted all users');
}
