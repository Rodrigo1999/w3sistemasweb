var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const PORT = process.env.PORT || 5000
const path = require('path')
var pg = require('pg');
var session = require('express-session');

app.use(session({
	secret: '2C44-4D44-WppQ38S',
	resave: true,
	saveUnitialized: true,
	save: true
}));

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

app.get('/admin/db', function (request, response, next) {
	var session = request.session;
	response.render('admin', {passou: 'false'})
	
	io.on('connection', function(socket){
		socket.on('logindb', function(data){
			request.user = {user: data, active: true};
			pg.connect(process.env.DATABASE_URL, function(err, client, done){
				client.query("select count(*) from admin where login='"+data.login+"' and senha='"+data.senha+"'", function(err, result){
					done();
					if (err) {
						{ console.error(err); }
					}else{
						
						if(result.rows[0].count == 1){
							session.login = true;
							response.send("Error ");
							// next();
						}else{
							socket.broadcast.emit('count', 'cai fora');
						}
					}
				});
			})	
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
	console.log('outra', session.login);
	
	io.emit('count', session.login);
	
})
http.listen(PORT, function(){
console.log('listening on *:'+PORT);
});
