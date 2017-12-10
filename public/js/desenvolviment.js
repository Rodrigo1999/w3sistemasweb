$(document).ready(function(){
	$(".continue_lendo").click(function(){
		var id = $(this).attr("reference");

		var condition = $(this).attr("toogle");

		if(condition == "false"){
			$("#"+id).removeClass("drop");
			$(this).text("Fechar");
			$(this).attr("toogle", "true");

		}else{
			
			$("#"+id).addClass("drop");
			$(this).text("Continue lendo");
			$(this).attr("toogle", "false");
		}
		
	})
})