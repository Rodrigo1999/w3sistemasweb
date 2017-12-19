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
io.of('/admin').use(sharedsession(session,{ autoSave:true })); 

app.use(express.static(path.join(__dirname,'public')));
app.use(compression());
var d=new Date();
app.set('view engine','ejs');
app.all('/',(req,res)=>{	
	res.render('home',{date: d.getFullYear()});
}).all('/admin/db',(req,res,next)=>{

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
}).all('*',(req,res)=>{
  res.render('404',{date: d.getFullYear()});
});
var nspIndex=io.of('/index'),
nspAdmin=io.of('/admin');
nspIndex.on('connection',(socket)=>{
	require('./libs/socket/index.js')(socket,nspIndex,pg,d,file);
});

nspAdmin.on('connection', (socket)=>{
	require('./libs/socket/admin.js')(socket,pg,file,nspAdmin);
});
http.listen(PORT,function(){
console.log('listening on *:'+PORT);
});