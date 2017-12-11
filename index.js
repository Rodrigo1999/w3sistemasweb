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

app.get('/admin/db', function (request, response, next) {
	request.user = {user: null, active: false};
	response.render('admin', {passou: 'false'})
	
	io.on('connection', function(socket){
		socket.on('logindb', function(data){
			//request.user = {user: data, active: true};
			pg.connect(process.env.DATABASE_URL, function(err, client, done){
				client.query("select * from admin where login='"+data.login+"' and senha='"+data.senha+"'", function(err, result){
					done();
					if (err) {
						{ console.error(err); }
					}else{
						socket.emit('count', result.rows[0].login);
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
	console.log(req.user)
	io.on('connection', function(socket){
		socket.on('logindb', function(data){
			console.log(data);
		})
	})
})
http.listen(PORT, function(){
console.log('listening on *:'+PORT);
});
