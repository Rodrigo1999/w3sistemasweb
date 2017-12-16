var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const PORT = process.env.PORT || 5000;
const path = require('path');
var pg = require('pg');
var sharedsession = require("express-socket.io-session");
var fs = require('fs');
var compression = require('compression');
var htmlentities = require('htmlentities');

function pb(data){
	return htmlentities.encode(data);
}
function dc(data){
	data = JSON.stringify(data);
	data = htmlentities.decode(data);
	return JSON.parse(data);
}
var directory = __dirname+'/views/readdingDbList.txt';
if(fs.existsSync(directory)){
	var file = fs.readFileSync(directory);
}else{
	var file = false;
};
var session = require('express-session')({
	secret: "my-secret",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 3000000 }
});

app.use(session);
io.use(sharedsession(session, { autoSave:true })); 

app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());
var d = new Date();
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
	
	
	res.render('home', {date: d.getFullYear()});
	var socket_id = [];
}).get('/admin/db', (req, res, next) => {

	var session = req.session;
	if(session.login){
		pg.connect(process.env.DATABASE_URL, (err, client, done) => {
		    client.query('SELECT id, nome, email, mensagem, date FROM budget_message order by id desc', (err, result) => {
			    done();
			    if (err) { 
			      	console.error(err); 
			       	res.send("Error " + err); 
			    }else { 
			       	res.render('db', {results: dc(result.rows), count: result.rows.length} ); 
			    }
		    });
		  });
   	} else {
     	
      	res.render('admin');
   	}
}).get('*', (req, res) => {
  res.render('404', {date: d.getFullYear()});
});
io.on('connection', (socket) => {

	socket.on('insertMsg', (data, callback) => {
		var date = d.getDate()+"/"+parseInt(d.getMonth()+1)+"/"+d.getFullYear()+" - "+d.getHours()+":"+d.getMinutes();
		 pg.connect(process.env.DATABASE_URL, (err, client, done)=>{
		 	var datas = "'"+pb(data.nome.substr(0, 150))+"', '"+pb(data.email.substr(0, 150))+"', '"+pb(data.telefone.substr(0, 15))+"', '"+pb(data.celular.substr(0, 15))+"', '"+pb(data.mensagem)+"', '"+date+"'";
		    client.query("insert into budget_message (nome, email, telefone, celular, mensagem, date) values ("+datas+")", function(err, result) {
		      done();
		      if (err)
		       { console.error(err);}
		      else
		       { 
		       		
		       		client.query('SELECT id, nome, email, mensagem, date FROM budget_message order by id desc', function(err, result){
		       			done();
		       			callback(true);
		       			io.emit('real-time-data', {r: result.rows, html: file.toString()});
		       		})
		       }
		    });
		  });
	}).on('searchLike', (data, callback) => {
		
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			if (data.length > 0) {
				var query = "where (nome ilike '%"+data+"%' or email ilike '%"+data+"%' or mensagem ilike '%"+data+"%' or telefone ilike '%"+data+"%' or celular ilike '%"+data+"%' or date ilike '%"+data+"%')";
			}else{
				var query = "";
			}
			
		    client.query("SELECT id, nome, email, mensagem, date FROM budget_message "+query+" order by id desc", function(err, result) {
		      done();

		      if(!err){
		      	callback({r: result.rows, html: file.toString()});
		      }
		    });
		});
	}).on('del-item', (data) => {
		if(Array.isArray(data) && data.length > 0){
			pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			    client.query('delete from budget_message where id in ('+data.join()+')', function(err, result) {
			      done();

			      if(!err){

			      	io.emit('real-time-data', {id: data, removeOne: true});
			      }

			    });
			  });
		}
	}).on('logindb', (data, callback) => {
		var session = socket.handshake.session;

		var l = 'rodrigo';
		var s = '123';

		if(data){
			session.login=l==data.l&&s==data.s?true:false;
			session.save();
		}
		callback(session.login);
	})
});


http.listen(PORT, function(){
console.log('listening on *:'+PORT);
});