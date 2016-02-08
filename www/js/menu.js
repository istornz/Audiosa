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
				$("#mCSB_1_container").html("");
			}
		});
		
		//Aristes
		$(".menu_artist").click(function() {
			if(page_actuel == 2) {
				//Ne rien faire
			}
			else
			{
				$("#mCSB_1_container").html("");
			}
		});
		
		//Album
		$(".menu_album").click(function() {
			if(page_actuel == 3) {
				//Ne rien faire
			}
			else
			{
				$("#mCSB_1_container").html("");
			}
		});
	});
})(jQuery);

function testaa() {
	alert("cc");
}