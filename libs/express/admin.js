module.exports = function(req,res,pg){
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
}