(function($){
	$(window).load(function(){
		var page_actuel = 1; //1: morceaux / 2: artist / 3: album
	
		//Morceaux
		$(".menu_morceaux").click(function() {
			if(page_actuel == 1) {
				//Ne rien faire
			}
			else
			{
				$("#list_morceaux").css("display","block");

				if(page_actuel == 2) {
					$("#list_artiste").css("display","none");
				}
				else {
					$("#list_album").css("display","none");
				}
				
				
				page_actuel = 1;
			}
		});
		
		//Aristes
		$(".menu_artist").click(function() {
			if(page_actuel == 2) {
				//Ne rien faire
			}
			else
			{
				$("#list_artiste").css("display","block");

				if(page_actuel == 1) {
					$("#list_morceaux").css("display","none");
				}
				else {
					$("#list_album").css("display","none");
				}
								
				page_actuel = 2;

			}
		});
		
		//Album
		$(".menu_album").click(function() {
			if(page_actuel == 3) {
				//Ne rien faire
			}
			else
			{
			
				$("#list_album").css("display","block");

				if(page_actuel == 1) {
					$("#list_morceaux").css("display","none");
				}
				else {
					$("#list_artiste").css("display","none");
				}
				
				
				page_actuel = 3;
			}
		});
	});
})(jQuery);

function testaa() {
	alert("cc");
}