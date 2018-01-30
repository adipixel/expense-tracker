const express = require('express');
const router = express.Router();
const password_hash = require('password-hash');
const session = require('express-session');

const User = require('../models/users')


// verify user
router.post('/user/verify', (req, res) => {
	let curPass = req.body.password;
	var pass_hash = "";
	User.findOne({email: req.body.email},
		(err, users)=>{
			if(err){
				res.json({"verification:" : false, "error": "Invalid"});
			}
			if(users){
				pass_hash = users.password_hash;
				//res.json({"pass":pass_hash, "curPass": curPass});
				verification = password_hash.verify(curPass, pass_hash);
				if(verification){
					req.session.user_id = users._id;
					res.redirect(''+ users._id);
				}
				else{
					res.json({"verification:" : false, "error": "Invalid password"});
				}
			}
			else{
					res.json({"verification:" : false, "error": "Invalid email id"});
				}
	});

});

// check authentication
function checkAuth(req, res, next) {
	if (!req.session.user_id) {
		res.send('You are not authenticated to view this page');
	}
	else {
		next();
	}
}

// get logged user
function getLoggedUser(id, callback) {
	User.find({_id: id}).lean().exec(function (err, docs) {
		if(err)
		{
			return false;
		}
		callback(null, JSON.parse(JSON.stringify(docs[0])));
	});
}

// logout user
router.get('/user/logout', function (req, res) {
	delete req.session.user_id;
	res.json({"msg:" :"Logged out"});
});



// get users
router.get('/users', checkAuth, (req, res) => {
	// athorizing user
	getLoggedUser(req.session.user_id, function(err, logged_user){
		if(err){
			res.json({msg: "Please login again"});
		}
		// check if admin
		if(logged_user.role == 'admin'){
			User.find((error, userList)=>{
				if(!err)
				{
					res.json(userList);
				}
				else{
					res.json({msg: "Permission denied. You need to be a admin"});
				}
			});
		}
	});

});

// get user
router.get('/user/:id', checkAuth, (req, res) => {
	// authorize for only own data access
	if(req.params.id == req.session.user_id){
		User.find({_id: req.params.id}, (err, user)=>{
			if(!err){
				res.json(user);
			}
		})
	}
	// authorization for admin to read data
	getLoggedUser(req.session.user_id, function(err, logged_user){
		if(err){
			res.json({msg: "Please login again"});
		}
		// check if admin
		if(logged_user.role == 'admin'){
			User.find({_id: req.params.id}, (error, user)=>{
				if(!err)
				{
					res.json(user);
				}
				else{
					res.json({msg: "Permission denied. You need to be a admin"});
				}
			});
		}
	});
});

// add user
router.post('/user/add', (req, res) => {
	let pwd = password_hash.generate(req.body.password_hash);
	let newUser = new User({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		password_hash: pwd,
		expenses: req.body.expenses,
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
router.put('/user/update/:id', checkAuth, (req, res) => {
	// authorize for only own data access
	if(req.params.id == req.session.user_id){
		User.update(
			{_id: req.params.id},
			{
				$set: {
					first_name: req.body.first_name || first_name,
					last_name: req.body.last_name || last_name,
					email: req.body.email || email,
					password_hash: password_hash,
					expenses: expenses,
					total_expense: req.body.total_expense || total_expense,
					role: req.body.role || role
				}
			},
			(err, result)=>{
				if (err){
					res.json({msg: 'Failed to update user: '+ err});
				}
				else
				{
					res.json(result);
				}
		});
	}
	else{
		res.json({msg: 'Authorization failed'});
	}


});


// delete user
router.delete('/user/delete/:id', checkAuth, (req, res) => {
	// authorize for only own data access
	if(req.params.id == req.session.user_id){
		User.remove({_id: req.params.id}, (err, result)=>{
			if (err){
				res.json({msg: 'Failed to delete user: '+ err});
			}
			else
			{
				res.json(result);
			}
		});
	}
	else{
		res.json({msg: 'Authorization failed'});
	}
});


// add expense
router.post('/expense/add/:id', checkAuth, (req, res) => {

	// authorize for only own data access
	if(req.params.id == req.session.user_id){
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
	}
	else{
		res.json({msg: 'Authorization failed'});
	}

});

// update expense
router.put('/expense/update/:id/:expense_id', checkAuth, (req, res) => {

	// authorize for only own data access
	if(req.params.id == req.session.user_id){
		User.update({'expenses._id': req.params.expense_id},
			{
				$set: {
					'expenses.$.createdAt': Date.now(), 'expenses.$.amount': req.body.expense.amount, 'expenses.$.description': req.body.expense.description
				}
			},
			(err, result)=>{
			if (err){
				res.json({msg: 'Failed to update expense: '+ err});
			}
			else
			{
				res.json(result);
			}
		});
	}
	else{
		res.json({msg: 'Authorization failed'});
	}


});


// delete expense
router.delete('/expense/delete/:id/:expense_id', checkAuth, (req, res) => {

	// authorize for only own data access
	if(req.params.id == req.session.user_id){
		User.update({_id: req.params.id},
			{
				$pull: {
					expenses: {_id: req.params.expense_id}
				}
			},
			(err, result)=>{
			if (err){
				res.json({msg: 'Failed to delete expense: '+ err});
			}
			else
			{
				res.json(result);
			}
		});
	}
	else{
		res.json({msg: 'Authorization failed'});
	}


});

module.exports = router;