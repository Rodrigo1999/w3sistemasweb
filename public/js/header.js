$(document).ready(function(){
	if(screen.width <= 800){
		$("#menu-btn").click(function(){
			if($(".menu-list").hasClass("opacity-hidden")){
				$(".menu-list").removeClass("opacity-hidden");
				$(".menu-list").addClass("opacity-visible");
			}else{
				$(".menu-list").removeClass("opacity-visible");
				$(".menu-list").addClass("opacity-hidden");	
			}
		})
	}
})