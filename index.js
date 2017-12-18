var express=require('express'),
app=express(),
http=require('http').createServer(app),
io=require('socket.io')(http),
path=require('path'),
pg=require('pg'),
sharedsession=require("express-socket.io-session"),
fs=require('fs'),
compression=require('compression'),
htmlentities=require('htmlentities');
const PORT=process.env.PORT || 5000;


function pb(d){
	return htmlentities.encode(d);
}
function dc(d){
	d=JSON.stringify(d);
	d=htmlentities.decode(d);
	return JSON.parse(d);
}
var directory=__dirname+'/views/readdingDbList.txt';
if(fs.existsSync(directory)){
	var file=fs.readFileSync(directory);
}else{
	var file=false;
};
var session=require('express-session')({
	secret: "my-secret",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 3000000 }
});

app.use(session);
io.use(sharedsession(session,{ autoSave:true })); 

app.use(express.static(path.join(__dirname,'public')));
app.use(compression());
var d=new Date();
app.set('view engine','ejs');
app.get('/',(req,res)=>{	
	res.render('home',{date: d.getFullYear()});
}).get('/admin/db',(req,res,next)=>{

	var session=req.session;
	if(session.login){
		pg.connect(process.env.DATABASE_URL,(err,client,done)=>{
		    client.query('SELECT * FROM budget_message order by id desc',(err,result)=>{
			    done();
			    if (err) { 
			      	console.error(err); 
			       	res.send("Error " + err); 
			    }else { 
			       	res.render('db',{results: dc(result.rows),count: result.rows.length} ); 
			    }
		    });
		  });
   	} else {
     	
      	res.render('admin');
   	}
}).get('*',(req,res)=>{
  res.render('404',{date: d.getFullYear()});
});
io.on('connection',(socket)=>{
	console.log('oi');
	socket.on('insertMsg',(data,callback)=>{
		var date=d.getDate()+"/"+parseInt(d.getMonth()+1)+"/"+d.getFullYear()+" - "+d.getHours()+":"+d.getMinutes();
		 pg.connect(process.env.DATABASE_URL,(err,client,done)=>{
		 	var datas="'"+pb(data.nome.substr(0,150))+"','"+pb(data.email.substr(0,150))+"','"+pb(data.telefone.substr(0,15))+"','"+pb(data.celular.substr(0,15))+"','"+pb(data.mensagem)+"','"+date+"'";
		    client.query("insert into budget_message (nome,email,telefone,celular,mensagem,date) values ("+datas+")", function(err,result){
		      done();
		      if (err)
		       { console.error(err);}
		      else
		       { 
		       		
		       		client.query('SELECT * FROM budget_message order by id desc',(err,result)=>{
		       			done();
		       			callback(true);
		       			io.emit('real-time-data',{r: result.rows,html: file.toString()});
		       		})
		       }
		    });
		  });
	});
	require('./admin')(io, socket, pg);
})


http.listen(PORT,function(){
console.log('listening on *:'+PORT);
});