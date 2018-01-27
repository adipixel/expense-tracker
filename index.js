var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

// Body parser middleware

app.get('/', function(req, res){
	res.send('<h1> Hello </h1>');
});

app.listen(3000, function(){
	console.log('Server running on port 3000...');
})