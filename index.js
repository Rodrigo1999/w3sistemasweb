var express=require('express'), app=express(), http=require('http').createServer(app), io=require('socket.io')(http), path=require('path'), pg=require('pg'), sharedsession=require("express-socket.io-session"), fs=require('fs'), compression=require('compression'), htmlentities=require('htmlentities'); const PORT=process.env.PORT || 5000; var pb = function(d){return htmlentities.encode(d); }; var dc = function(d){d=JSON.stringify(d); d=htmlentities.decode(d); return JSON.parse(d); }; var file=fs.readFileSync(__dirname+'/views/readdingDbList.txt'), d=new Date(); var session=require('express-session')({secret: "my-secret", resave: true, saveUninitialized: true, cookie: { maxAge: 3000000 } }); app.use(express.static(path.join(__dirname,'public'))).use(compression()).use(session); io.of('/admin').use(sharedsession(session,{ autoSave:true })); app.set('view engine','ejs'); app.all('/',(req,res)=>{res.render('home',{date: d.getFullYear()}); }).all('/admin/db',(req,res,next)=>{require('./libs/express/admin.js')(req,res,pg,dc); }).all('*',(req,res)=>{res.render('404',{date: d.getFullYear()}); }); var nspIndex=io.of('/index'), nspAdmin=io.of('/admin'); nspIndex.on('connection',(socket)=>{require('./libs/socket/index.js')(socket,nspAdmin,pg,d,file,pb); }); nspAdmin.on('connection', (socket)=>{require('./libs/socket/admin.js')(socket,pg,file,nspAdmin); }); http.listen(PORT,function(){console.log('listening on *:'+PORT); });