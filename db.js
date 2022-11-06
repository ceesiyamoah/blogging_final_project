const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_DB_URL = process.env.MONGO_DB_URL;

const connectToMongoDb = () => {
	mongoose.connect(MONGO_DB_URL);
	mongoose.connection.on('connected', () => {
		console.log('Connected to MongoDB successfully');
	});
	mongoose.connection.on('error', (err) => {
		console.log('Error connecting to MongoDB', err);
	});
};

module.exports = { connectToMongoDb };
