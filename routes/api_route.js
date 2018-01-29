const express = require('express');
const router = express.Router();

const User = require('../models/users')

// get users
router.get('/users', (req, res, next) => {
	User.find((err, contacts)=>{
		res.json(contacts);
	});
});

// add user
router.post('/user', (req, res, next) => {
	let newUser = new User({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email
	});
	newUser.save((err, contact)=>{
		if (err){
			res.json({msg: 'Failed to add user'});
		}
		else
		{
			res.json({msg: 'User added'});
		}
	});
});

// delete user
router.delete('/user/:id', (req, res, next) => {
	User.remove({_id: req.params.id}, (err, result)=>{
		if (err){
			res.json({msg: 'Failed to delete user: '+ err});
		}
		else
		{
			res.json(result);
		}
	});
});

module.exports = router;