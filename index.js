var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const PORT = process.env.PORT || 5000
const path = require('path')
var pg = require('pg');

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
			       { console.error(err); response.send("Error " + err); }
			      else
			       { socket.emit('getDataPrimary-Response', true); }
			    });
			  });
		})
	})

})




var session = require('express-session')({
	secret: "my-secret",
    resave: true,
    saveUninitialized: true
});
var sharedsession = require("express-socket.io-session");
app.use(session);
io.use(sharedsession(session, {
    autoSave:true
})); 

app.get('/admin/db', function (request, response, next) {

	var session = request.session;
	if(session.login){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		    client.query('SELECT * FROM budget_message', function(err, result) {
		      done();
		      if (err)
		       { console.error(err); response.send("Error " + err); }
		      else
		       { response.render('db', {results: result.rows} ); }
		    });
		  });
     	//response.render('admin', {passou: "tem"})
   	} else {
     	//session.login = true;
      	response.render('admin', {passou: "não tem"})
   	}
	io.sockets.on('connection', function(socket){
		
		socket.on('logindb', function(data){
			if(data){
				pg.connect(process.env.DATABASE_URL, function(err, client, done){
					client.query("select count(*) from admin where login='"+data.login+"' and senha='"+data.senha+"'", function(err, result){
						done();
						if (err) {
							{ console.error(err); }
						}else{
							
							if(data.login == 'rodrigo'){
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
	
	
  /*pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM budget_message', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('db', {results: result.rows} ); }
    });
  });*/
	
  	
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
