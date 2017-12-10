var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
//var MongoClient = require('mongodb').MongoClient;
var multipart = require('connect-multiparty');
//var session = require('express-session');
const PORT = process.env.PORT || 5000
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs');
app.get('/', function(req, res){
	res.render('home', {});

})
http.listen(PORT, function(){
console.log('listening on *:'+PORT);
});
