const express = require('express');
const router = express.Router();
const password_hash = require('password-hash');
const session = require('express-session');
var jwt = require('jsonwebtoken');

const User = require('../models/users')
const app = express();

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
				verification = password_hash.verify(curPass, pass_hash);
				if(verification){
					//req.session.user_id = users._id;
					// token
					const payload = {
				      role: users.role,
				      user_id: users._id
				    };

				    var token = jwt.sign({
				    	exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
						data: payload
					}, 'adipixel-secret');

				    					//res.redirect(''+ users._id);
					console.log("User logged in");
					res.json({success: true, msg: "Login Successful", token: token});
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


// jwt middleware to verify token
router.use((req, res, next)=>{
	var token = req.body.token || req.headers['token'];
	if(token){
		jwt.verify(token, 'adipixel-secret', (err, decoded)=>{
			if(err){

				return res.json({success: false, msg: 'Token not valid or expired', data: []});
			}
			else{
				req.decoded = decoded;
				next();
			}
		});
	}
	else{
		return res.status(403).json({success: false, msg: 'No token provided', data: []});
	}
})



// check authentication
function checkAuth(req, res, next) {
	if (!req.session.user_id) {
		res.json({success: false, msg: 'You are not authenticated to view this page', data: []});
	}
	else {
		next();
	}
}



// get users
router.get('/users', (req, res, next) => {
	// athorizing user
	if(req.decoded.data.role == "admin"){
		User.find((error, userList)=>{
			if(!error)
			{
				res.json({success: true, msg: "success", data: userList});
			}
			else{
				res.json({success: false, msg: "Permission denied. You need to be a admin", data: []});
			}
		}).select('-password_hash');
	}

});

// get user
router.get('/user', (req, res) => {
	User.find({_id: req.decoded.data.user_id}, (err, user)=>{
		if(!err){
			res.json({success: true, msg: "", data: user});
		}
		else{
			res.json({success: false, msg: "Invalid user", data: []});
		}
	}).select('-password_hash');
});

// get user for admin
router.get('/user/:id', (req, res) => {
	if(req.decoded.data.role == "admin"){
		User.find({_id: req.params.id}, (err, user)=>{
			if(!err){
				res.json({success: true, msg: "", data: user});
			}
			else{
				res.json({success: false, msg: "Invalid user", data: []});
			}
		}).select('-password_hash');
	}
	else{
		res.json({success: false, msg: "Permission denied. You need to be a admin", data: []});
	}
});




// update user - need to update for jwt
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


// delete user - needs to update for jwt
router.delete('/user/delete/:id', checkAuth, (req, res) => {

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
router.post('/expense/add', (req, res) => {

	User.update({_id: req.decoded.data.user_id},
		{
			$push: {
						"expenses" :{
							$each: [{"createdAt": Date.now(), "amount": req.body.amount, "description": req.body.description}]
						}
					}
		},
		(err, result)=>{
		if (err){
			res.json({success: false, msg: 'Failed to add expense: '+ err});
		}
		else
		{
			console.log("expense added");
			res.json({success: true, msg:"Expense added", data: result});
		}
	});

});

// update expense
router.put('/expense/update/', (req, res) => {

	User.update({'expenses._id': req.body._id},
		{
			$set: {
				'expenses.$.createdAt': Date.now(), 'expenses.$.amount': req.body.amount, 'expenses.$.description': req.body.description
			}
		},
		(err, result)=>{
		if (err){
			res.json({success: true, msg: 'Failed to update expense: '+ err, data: result});
		}
		else
		{
			res.json(result);
		}
	});

});


// delete expense
router.delete('/expense/delete/:expense_id', (req, res) => {

	// authorize for only own data access
	User.update({_id: req.decoded.data.user_id},
		{
			$pull: {
				expenses: {_id: req.params.expense_id}
			}
		},
		(err, result)=>{
		if (err){
			res.json({success: false, msg: 'Failed to delete expense: '+ err, data: []});
		}
		else
		{
			res.json({success: true, msg:"Expense Deleted", data: result});
		}
	});


});

module.exports = router;