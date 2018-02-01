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
				res.json({success: false, msg: "Invalid", data: []});
			}
			if(users){
				pass_hash = users.password_hash;
				//res.json({"pass":pass_hash, "curPass": curPass});
				verification = password_hash.verify(curPass, pass_hash);
				if(verification){
					req.session.user_id = users._id;
					//res.redirect(''+ users._id);
					console.log("User logged in");
					res.json({success: true, msg: "Login Successful", data: users._id});
				}
				else{
					res.json({success: false, msg: "Invalid password", data: []});
				}
			}
			else{
					res.json({success: false, msg: "Invalid email id", data: []});
				}
	});

});

// check authentication
function checkAuth(req, res, next) {
	if (!req.session.user_id) {
		res.json({success: false, msg: 'You are not authenticated to view this page', data: []});
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
	res.json({success: true, msg :"Logged out", data: []});
});

// temp route
router.get('/users/temp', (req, res) => {
	User.find((error, userList)=>{
		if(!error)
		{
			res.json({success: true, msg:"", data: userList});
		}
		else{
			res.json({"success:" : false, "msg": "Permission denied. You need to be a admin"});
		}
	});
});


// get users
router.get('/users', checkAuth, (req, res) => {
	// athorizing user
	getLoggedUser(req.session.user_id, function(err, logged_user){
		if(err){
			res.json({success: false, msg: "Please login again", data: []});
		}
		// check if admin
		if(logged_user.role == 'admin'){
			User.find((error, userList)=>{
				if(!err)
				{
					res.json({success: true, msg: "success", data: userList});
				}
				else{
					res.json({success: false, msg: "Permission denied. You need to be a admin", data: []});
				}
			}).select('-password_hash');
		}
		else{
			res.json({success: false, msg: "Permission denied. You need to be a admin", data: []});
		}
	});

});

// get user
router.get('/user/:id', checkAuth, (req, res) => {
	// authorize for only own data access
	if(req.params.id == req.session.user_id){
		User.find({_id: req.params.id}, (err, user)=>{
			if(!err){
				res.json({success: true, msg: "", data: user});
			}
			else{
				res.json({success: false, msg: "Invalid user", data: []});
			}
		}).select('-password_hash');
	}
	else
	{
		// authorization for admin to read data
		getLoggedUser(req.session.user_id, function(err, logged_user){
			if(err){
				res.json({success: false, msg: "Please login again", data: []});
			}
			// check if admin
			if(logged_user.role == 'admin'){
				User.find({_id: req.params.id}, (error, user)=>{
					if(!err)
					{
						res.json({success: true, msg: "Success", data: user});
					}
					else{
						res.json({success: false, msg: "Permission denied. You need to be a admin", data: []});
					}
				}).select('-password_hash');
			}
		});
	}


});

// add user
router.post('/user/add', (req, res) => {
	let pwd = password_hash.generate(req.body.password);
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
			res.json({success: false, msg: 'Failed to add user', data: []});
		}
		else
		{
			//res.json({msg: 'User added'});
			res.json({success: true, msg:"", data: user});
		}
	});
});

// update user
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
					res.json({success: false, msg: 'Failed to update user', data: []});
				}
				else
				{
					res.json({success: true, msg:"", data: result});
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
				res.json({success: false, msg: 'Failed to delete user: ', data: []});
			}
			else
			{
				res.json({success: true, msg: "", data: result});
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