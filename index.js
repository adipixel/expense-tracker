const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
var jwt = require('jsonwebtoken');


const app = express();


// middleware express-session
app.use(session({ secret: 'Yahama Fazer', resave: true, saveUninitialized: true, cookie: { maxAge: 600000000 }}));


const api_route = require('./routes/api_route.js');

// connect to mongodb
mongoose.connect('mongodb://localhost:27017/expense_tracker_users');
mongoose.connection.on('connected', ()=>{
	console.log('connected to database MongoDB');
});
mongoose.connection.on('error', (err)=>{
	if(err){
		console.log('Error in database connection: '+ err);
	}
});


// Middleware - cors
app.use(cors());

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set static path
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/api', api_route)

// testing server
app.get('/hello', function(req, res){
	res.send('<h1> Hello there, I am working! </h1>');
});




app.listen(3000, function(){
	console.log('Server running on port 3000...');
})