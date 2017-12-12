var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const PORT = process.env.PORT || 5000
const path = require('path')
var pg = require('pg');
var sharedsession = require("express-socket.io-session");




var session = require('express-session')({
	secret: "my-secret",
    resave: true,
    saveUninitialized: true
});

app.use(session);
io.use(sharedsession(session, { autoSave:true })); 

app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs');
app.get('/', function(req, res){
	res.render('home');
	io.on('connection', function(socket){
		socket.on('getDataPrimary', function(data){
			
			 pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			 	var datas = "'"+data.nome+"', '"+data.email+"', '"+data.telefone+"', '"+data.celular+"', '"+data.mensagem+"'";
			    client.query("insert into budget_message (nome, email, telefone, celular, mensagem) values ("+datas+")", function(err, result) {
			      done();
			      if (err)
			       { console.error(err); res.send("Error " + err); }
			      else
			       { socket.emit('getDataPrimary-Response', true); }
			    });
			  });
		})
	})

})
app.get('/admin/db', function (req, res, next) {

	var session = req.session;
	if(session.login){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		    client.query('SELECT * FROM budget_message', function(err, result) {
		      done();
		      if (err)
		       { console.error(err); res.send("Error " + err); }
		      else
		       { res.render('db', {results: result.rows} ); }
		    });
		  });
   	} else {
     	
      	res.render('admin')
   	}
	io.on('connection', function(socket){
		
		console.log(socket.id)
		socket.on('del-item', function(data){
			if(Array.isArray(data)){
				pg.connect(process.env.DATABASE_URL, function(err, client, done) {
				    client.query('delete from budget_message where id in ('+data.join()+')', function(err, result) {
				      done();
				      if (err)
				       { socket.emit('del-item-Response', false); }
				      else
				       { 
				       		socket.emit('del-item-Response', true);
				       }
				    });
				  });
			}
		})
		socket.on('getNewResult', function(func){
			pg.connect(process.env.DATABASE_URL, function(err, client, done) {
				client.query('SELECT * FROM budget_message', function(err, result) {
				    done();
				    if (err){ 
				     	func(false); 
				    }else{ 
				   		func(result.rows);
				    }
				});
			});
		})
		socket.on('logindb', function(data){
			if(data){
				pg.connect(process.env.DATABASE_URL, function(err, client, done){
					client.query("select count(*) from admin where login='"+data.l+"' and senha='"+data.s+"'", function(err, result){
						done();
						if (err) {
							{ console.error(err); }
						}else{
							
							if(result.rows[0].count == 1){
								socket.handshake.session.login = true;
								next();
								
							}else{
								socket.handshake.session.login = false;
								socket.emit('login', socket.handshake.session.login);
							}
							socket.handshake.session.save();	
						}
					});
				})	
			}	
		})
	})
});
app.get('/admin/db', function(req, res, next){
	var session = req.session;
	session.login = true;
	console.log(session)
	io.emit('login', session.login);
	
})
http.listen(PORT, function(){
console.log('listening on *:'+PORT);
});
