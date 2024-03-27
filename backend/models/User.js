// User.js

// Load bcrypt module, used to hash the passwords
const bcrypt = require('bcrypt')
// Load the Mongoose module and Schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a new 'UserSchema'
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    firstName:{
        type: String,
        required: true,
        trim: true
    },
    lastName:{
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        validate: [
			(password) => password && password.length > 0,
			"Password should contain at least 1 character"
		]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, "Please fill a valid email address"]
    },
    userType: {
        type: String,
        required: true,
        enum: ['patient', 'nurse'],
        default: 'patient'
    }
});

// Set the 'fullname' virtual property
UserSchema.virtual('fullName').get(function() {
	return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
	const splitName = fullName.split(' ');
	this.firstName = splitName[0] || '';
	this.lastName = splitName[1] || '';
});

// hash the passwords before saving
UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
})

// Create the 'User' model out of the 'UserSchema'
module.exports = mongoose.model('User', UserSchema);