var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const PORT = process.env.PORT || 5000
const path = require('path')
var pg = require('pg');
var sharedsession = require("express-socket.io-session");
var fs = require('fs');



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
		socket.on('getDataPrimary', function(data, callback){
			
			 pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			 	var datas = "'"+data.nome+"', '"+data.email+"', '"+data.telefone+"', '"+data.celular+"', '"+data.mensagem+"'";
			    client.query("insert into budget_message (nome, email, telefone, celular, mensagem) values ("+datas+")", function(err, result) {
			      done();
			      if (err)
			       { console.error(err); res.send("Error " + err); }
			      else
			       { callback(true)}
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
			    if (err) { 
			      	console.error(err); 
			       	res.send("Error " + err); 
			    }else { 
			       	res.render('db', {results: result.rows} ); 
			    }
		    });
		  });
   	} else {
     	
      	res.render('admin')
   	}
	io.on('connection', function(socket){

		socket.on('del-item', function(data, callback){
			if(Array.isArray(data)){
				pg.connect(process.env.DATABASE_URL, function(err, client, done) {
				    client.query('delete from budget_message where id in ('+data.join()+')', function(err, result) {
				      done();

				      err ? callback(false) : callback(true);

				    });
				  });
			}
		})
		socket.on('getNewResult', function(func){
			
			if(!socket.handshake.session.file){

				var directory = __dirname+'/views/readdingDbList.txt';
				if(fs.existsSync(directory)){
					socket.handshake.session.file = fs.readFileSync(directory);
				}else{
					socket.handshake.session.file = false;
				}
				socket.handshake.session.save();
			}
			
			
			pg.connect(process.env.DATABASE_URL, function(err, client, done) {
				client.query('SELECT * FROM budget_message order by id desc', function(err, result) {
				    done();

				    err ? func(false) : func({r: result.rows, html: socket.handshake.session.file.toString()});
				    
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
