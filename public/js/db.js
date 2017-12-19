$(document).ready(function(){
			var socket = io('/admin');
			
			socket.on('real-time-data', function(data){

				if(data.removeOne){
					data.id.forEach(function(id){
						var text = $("#count-list span").text();
						$("#count-list span").text(parseInt(text)-1);
						$("li#"+id).remove();
					})
				}else{
					p(data);
				}
				
			});
			$("form").submit(function(e){
				e.preventDefault();
				return false;
			});
			$(".div-search-primary").click(function(){
				$(".opt-top-none").addClass("opt-top");
			});
			$(".a-close").click(function(){
				$(".opt-top-none").removeClass("opt-top");
			});
			$("#checkbox-primary").change(function(){
			  $("input[name='checkbox-del[]']").prop('checked', this.checked);
			});
			$("#del-item").click(function(){
				$("#checkbox-primary").prop('checked', false);
				checkboxCollection = [];
				var checkbox = $("input[name='checkbox-del[]']");
				checkbox.each(function(){
					if($(this).is(':checked')){
						checkboxCollection.push($(this).val());
					}
				});
				if(checkboxCollection.length > 0){
					socket.emit('del-item', checkboxCollection);

				}		
			});
			$(".itens-data").click(function(){ k(this);});
			$("#search").keyup(function(){
				var val = $(this).val();
	
				socket.emit('searchLike', val, function(data){
					p(data);
				});
			});
			function k(e){
				if($(e).attr('checkOpen') == 'false'){
					$(e).parent().removeClass('hide_text');
					$(e).attr('checkOpen', 'true');
				}else{
					$(e).parent().addClass('hide_text');
					$(e).attr('checkOpen', 'false');
				}
			};
			function p(data){
				$("#list-data").html('');
				$("#count-list span").text(data.r.length);
				data.r.forEach(function(r){
					var html = data.html;

					var mat = html.match(/<& \w+\W\w+ &>/g);
					for (var i = 0; i < mat.length; i++) {
						html = html.replace(/<& \w+\W\w+ &>/, r[mat[i].match(/\w+\W\w+/g)[0].substr(2)])
					};
					$("#list-data").append(html)
				});	
				$(".itens-data").click(function(){k(this);});
			}

		})