const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		match: [
			/^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			'Enter a valid email address',
		],
		lowercase: true,
	},
	password: {
		type: String,
		required: true,
		minlength: [6, 'Password is too short'],
		select: false,
	},
	first_name: {
		type: String,
		required: true,
		minlength: [2, 'First name is too short'],
	},
	last_name: {
		type: String,
		required: true,
		minlength: [2, 'Last name is too short'],
	},
});

UserSchema.pre('save', async function (next) {
	const hash = await bcrypt.hash(this.password, 10);
	this.password = hash;
	next();
});

UserSchema.methods.isValidPassword = async function (password) {
	try {
		const user = this;
		const compare = await bcrypt.compare(password, user.password);
		return compare;
	} catch (error) {
		console.log(error);
	}
};

UserSchema.set('toJSON', {
	transform: function (doc, ret, opt) {
		delete ret['password'];
		return ret;
	},
});

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;
