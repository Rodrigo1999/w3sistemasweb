module.exports = function(socket,pg,file,nspAdmin){

	socket.on('searchLike',(data,callback)=>{
		
		pg.connect(process.env.DATABASE_URL,(err,client,done)=>{
			if (data.length > 0) {
				var query="where (nome ilike '%"+data+"%' or email ilike '%"+data+"%' or mensagem ilike '%"+data+"%' or telefone ilike '%"+data+"%' or celular ilike '%"+data+"%' or date ilike '%"+data+"%')";
			}else{
				var query="";
			}
			
		    client.query("SELECT * FROM budget_message "+query+" order by id desc",(err,result)=>{
		      done();

		      if(!err){
		      	callback({r: result.rows,html: file.toString()});
		      }
		    });
		});
	}).on('del-item',(data)=>{
		if(Array.isArray(data)&&data.length>0){
			pg.connect(process.env.DATABASE_URL,(err,client,done)=>{
			    client.query('delete from budget_message where id in ('+data.join()+')',(err,result)=>{
			      done();

			      if(!err){

			      	nspAdmin.emit('real-time-data',{id: data,removeOne: true});
			      }

			    });
			  });
		}
	}).on('logindb',(data,callback)=>{
		var session=socket.handshake.session,
		l='rodrigo',
		s='123';

		if(data){
			session.login=l==data.l&&s==data.s?true:false;
			session.save();
		}
		callback(session.login);
	})
}