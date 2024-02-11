const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
	first_name: { type: String, required: true, maxLength: 50 },
	last_name: { type: String, required: true, maxLength: 100 },
	username: { type: String, required: true, maxLength: 50 },
	password: { type: String, required: true, minLength: 8 },
	member: { type: Boolean, default: false },
	admin: { type: Boolean, default: false },
});

// Virtual for user's full name
UserSchema.virtual('name').get(function () {
	// To avoid errors in cases where a user does not have either a family name or first name
	// We want to make sure we handle the exception by returning an empty string for that case
	const fullName = '';
	if (this.first_name && this.last_name) {
		fullName = `${this.first_name} ${this.last_name}`;
	}
	return fullName;
});

UserSchema.virtual('url').get(function () {
	return `/home/user/${this._id}`;
});

module.exports = mongoose.model('User', UserSchema);
