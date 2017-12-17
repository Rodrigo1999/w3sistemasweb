$(document).ready(function(){var l = Ladda.create( document.querySelector( '.budget-message' ) ); $("#form-primary").submit(function(evt){evt.preventDefault(); var validate = true; var data = {nome: evt.target.nome.value, email: evt.target.email.value, telefone: evt.target.telefone.value, celular: evt.target.celular.value, mensagem: evt.target.mensagem.value }
		var labels = ['nome', 'mensagem']; if(!validateEmail(data.email)){$("label[for=email]").css('color', 'red'); $("label[for=email]").text('Email inválido *'); validate = false; }; $("#email").change(function(){
			if(!validateEmail($(this).val()) || $(this).val() == 0){
				erro($(this), 'Email inválido *');
				validate = false;
			}else{
				$("label[for=email]").text("Email *");
				$("label[for=email]").css('color', 'rgb(50,50,50)');
			}
		});
		
		for (var i = 0; i < labels.length; i++) {
			if(data[labels[i]].length == 0){
				erro($("#"+labels[i]));
				validate = false;
			}
			$("#"+labels[i]).change(function(){
				if($(this).val() ==0){
					erro($(this));
					validate = false;
				}else{
					$("label[for="+$(this).attr('id')+"]").text(ucfirst($(this).attr('id')+"*"));
					$("label[for="+$(this).attr('id')+"]").css('color', 'rgb(50,50,50)');
				}
			})
		};
		if(validate){
			l.start();
			socket.emit('insertMsg', data, function(data){
				l.stop();
				JSAlert.alert("Mensagem enviada com sucesso");
			});
		};
		return false;
	})
	
});
function erro(e, m = false){
	$("label[for="+e.attr('id')+"]").text(m ? m : 'Preencha o campo *');
	$("label[for="+e.attr('id')+"]").css('color', 'red');
}
