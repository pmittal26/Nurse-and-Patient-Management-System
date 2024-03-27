// Load the module dependencies
const config = require('./config');
const mongoose = require('mongoose');


// module.exports = function () {
// 	// Use Mongoose to connect to MongoDB
// 	const db = mongoose.connect("mongodb+srv://mittal123:Mittupatel2605#@cluster0.tlyguvq.mongodb.net/")
// 	.then(() => console.log('MongoDB Connected Successfully!'))
// 		.catch(err => {
// 			console.log('Error');
// 		});

// Define the Mongoose configuration method
module.exports = function () {
	// Use Mongoose to connect to MongoDB
	const db = mongoose.connect("mongodb+srv://mittal123:Mittupatel2605#@cluster0.tlyguvq.mongodb.net/"
		/*config.db/*, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useCreateIndex: true
	}*/).then(() => console.log('MongoDB Connected Successfully!'))
		.catch(err => {
			console.log('Error');
		});

	// Load the models
	require('../models/User');
	require('../models/motivationalVideo.server.model');
	require('../models/alert.server.model');
	// Return the Mongoose connection instance
	return db;
};