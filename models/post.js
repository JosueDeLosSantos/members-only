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

PostSchema.virtual('date_yyyy_mm_dd').get(function () {
	return DateTime.fromJSDate(this.date).toISODate(); // format YYYY-MM-DD
});

module.exports = mongoose.model('Post', PostSchema);
