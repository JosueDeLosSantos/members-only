const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const { Schema } = mongoose;

const PostSchema = new Schema({
	title: { type: String, required: true, maxminLength: 100 },
	message: { type: String, required: true, minLength: 10 },
	date: { type: Date, required: true },
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
});

PostSchema.virtual('virtual_date').get(function () {
	return DateTime.fromJSDate(this.date)
		.setLocale('en')
		.toLocaleString(DateTime.DATETIME_FULL); // format: February 14, 2024 at 6:04 PM AST
});

module.exports = mongoose.model('Post', PostSchema);
