const mongoose = require('mongoose');

const ExpenseTrackerSchema = mongoose.Schema({
	first_name:{
		type: String,
		required: true
	},
	last_name:{
		type: String,
		required: true
	},
	email:{
		type: String,
		required: true,
		unique: true
	},
	password_hash:{
		type: String,
		required: true
	},
	expenses:[
		{
			createdAt: {
				type: Date
			},
			amount: {
				type: Number
			},
			description: String
		}
	],
	total_expense: {
		type: Number
	},
	role: {
		type: String
	}

}, { strict: false });

const User = module.exports = mongoose.model('User', ExpenseTrackerSchema);