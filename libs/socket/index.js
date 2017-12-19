module.exports = function(socket,nspAdmin,pg,d,file, pb){
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
		       			nspAdmin.emit('real-time-data',{r: result.rows,html: file.toString()});
		       		})
		       }
		    });
		  });
	});
}