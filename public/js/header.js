$(document).ready(function(){
	if(screen.width <= 800){
		$("#menu-btn").click(function(e){
			
			if($(".menu-list").hasClass("opacity-hidden")){
				$(".menu-list").removeClass("opacity-hidden");
				$(".menu-list").addClass("opacity-visible");
			}else{
				$(".menu-list").removeClass("opacity-visible");
				$(".menu-list").addClass("opacity-hidden");	
			}
		})
	};
	if(screen.width < 600){
		$(".img-slide").find('img').attr('src', 'imgs/slidePar.jpg');
	};
	$(document).click(function(e){
		var elem = e.target.classList[0];
		
		if(!$('.'+elem).closest(".menu-btn").length){
			if(!$('.'+elem).hasClass('menu-btn')){
				if($('.'+elem).closest(".menu-list").length == 0){
					$(".menu-list").removeClass("opacity-visible");
					$(".menu-list").addClass("opacity-hidden");	
				}
			}	
		}			
	})
})
