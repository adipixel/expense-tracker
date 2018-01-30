const express = require('express');
const router = express.Router();
const password_hash = require('password-hash');

const User = require('../models/users')

// get users
router.get('/users', (req, res, next) => {
	User.find((err, users)=>{

		res.json(users);
	}).select('-password_hash');
});

// add user
router.post('/user', (req, res, next) => {
	let pwd = password_hash.generate(req.body.password_hash);
	let newUser = new User({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		password_hash: pwd,
		total_expense: req.body.total_expense,
		role: req.body.role
	});

	newUser.save((err, user)=>{
		if (err){
			res.json({msg: 'Failed to add user'+ err});
		}
		else
		{
			res.json({msg: 'User added'});
		}
	});
});

// delete user
router.delete('/user/delete/:id', (req, res, next) => {
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

// add expense
router.put('/expense/add/:id', (req, res, next) => {
	User.update({_id: req.params.id},
		{
			$push: {
						"expenses" :{
							$each: [{"createdAt": Date.now(), "amount": req.body.expense.amount, "description": req.body.expense.description}]
						}
					}
		},
		(err, result)=>{
		if (err){
			res.json({msg: 'Failed to add expense: '+ err});
		}
		else
		{
			res.json(result);
		}
	});
});



module.exports = router;