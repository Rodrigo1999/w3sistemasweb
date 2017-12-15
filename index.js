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


var rep = {
	E:function(data){
		return data.replace('}', '9b&wt').replace(')', '8b&kt');;
	},
	D: function(data){
		return data.replace('9b&wt', '}').replace('8b&kt', ')');
	}
}

var d = rep.E('data})');
console.log(d);
console.log(rep.D(d))
var directory = __dirname+'/views/readdingDbList.txt';
if(fs.existsSync(directory)){
	var file = fs.readFileSync(directory);
}else{
	var file = false;
};
var session = require('express-session')({
	secret: "my-secret",
    resave: true,
    saveUninitialized: true
});

app.use(session);
io.use(sharedsession(session, { autoSave:true })); 

app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());
var d = new Date();
app.set('view engine', 'ejs');
app.get('/', function(req, res){
	
	
	res.render('home', {date: d.getFullYear()});
	var socket_id = [];
   /*const io = req.app.get('socketio');*/
   /* io.on('connection', socket => {io.on('cu', function(){console.log('just got');})});	*/
})
app.get('/admin/db', function (req, res, next) {

	var session = req.session;
	if(session.login){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		    client.query('SELECT id, nome, email, mensagem, date FROM budget_message order by id desc', function(err, result) {
			    done();
			    if (err) { 
			      	console.error(err); 
			       	res.send("Error " + err); 
			    }else { 
			       	res.render('db', {results: result.rows, count: result.rows.length} ); 
			    }
		    });
		  });
   	} else {
     	
      	res.render('admin')
   	}
});
app.get('*', function(req, res){
  res.render('404', {date: d.getFullYear()});
});
io.on('connection', function(socket){

	socket.on('insertMsg', function(data, callback){
		var date = d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear()+" - "+d.getHours()+":"+d.getMinutes();
		 pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		 	console.log(pb(data.nome));
		 	var datas = "'"+pb(data.nome)+"', '"+pb(data.email)+"', '"+pb(data.telefone)+"', '"+pb(data.celular)+"', '"+pb(data.mensagem)+"', '"+date+"'";
		    client.query("insert into budget_message (nome, email, telefone, celular, mensagem, date) values ("+datas+")", function(err, result) {
		      done();
		      if (err)
		       { console.error(err); res.send("Error " + err); }
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
	})
	socket.on('searchLike', function(data, callback){
		
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
	})
	socket.on('del-item', function(data){
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
	})
	socket.on('logindb', function(data, callback){
		if(data){
			pg.connect(process.env.DATABASE_URL, function(err, client, done){
				client.query("select count(*) from admin where login='"+data.l+"' and senha='"+data.s+"'", function(err, result){
					done();
					if (err) {
						{ console.error(err); }
					}else{
						
						if(result.rows[0].count == 1){
							socket.handshake.session.login = true;
							callback(socket.handshake.session.login);
							
						}else{
							socket.handshake.session.login = false;
							callback(socket.handshake.session.login);
						}
						socket.handshake.session.save();	
					}
				});
			})	
		}	
	})
})


http.listen(PORT, function(){
console.log('listening on *:'+PORT);
});
