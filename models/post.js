const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const { Schema } = mongoose;

const PostSchema = new Schema({
	message: { type: String, required: true, minLength: 100 },
	date: { type: Date, required: true },
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
});

PostSchema.virtual('date_yyyy_mm_dd').get(function () {
	return DateTime.fromJSDate(this.date).toISODate(); // format YYYY-MM-DD
});

module.exports = mongoose.model('Post', PostSchema);
