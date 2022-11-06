const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema(
	{
		title: {
			type: String,
			unique: [true, 'Title already exists'],
			required: true,
		},
		description: {
			type: String,
		},
		author: { type: Schema.Types.ObjectId, ref: 'users' },
		state: {
			type: String,
			enum: ['draft', 'published'],
			default: 'draft',
		},
		read_count: {
			type: Number,
			default: 0,
		},
		reading_time: {
			type: Number,
			default: 1,
		},
		tags: {
			type: [
				{
					type: String,
					lowercase: true,
				},
			],
			default: [],
		},
		body: {
			type: String,
			required: true,
		},
	},
	{ timestamps: { createdAt: 'timestamp', updatedAt: false } }
);

BlogSchema.pre('save', function (next) {
	const numOfWords = `${this.description} ${this.body}`.split(' ').length;
	this.reading_time = Math.round(numOfWords / 200) || 1;

	next();
});

const BlogModel = mongoose.model('blog', BlogSchema);
module.exports = BlogModel;
