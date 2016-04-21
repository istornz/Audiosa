list_playlists();

function list_playlists()
{
	$.ajax({
			method: "POST",
			url: "apis/retrievedata.php",
			data: { argPost: "playlists" }
		})
		.done(function( msg ) {
			
		console.log(msg);
		
			if(msg.status_code != 1)
			{
				console.log("UNE ERREUR EST SURVENUE");
				//GESTION DES ERREURS

				return false;
			}
			
			for(var indicePlaylist=0; indicePlaylist < msg.playlists.length; indicePlaylist++) {
				$("#into_playlists").append('<a href="#" class="no-margin txt-left ui-btn ui-btn-icon-right ui-icon-carat-r"><div class="cellSideBar"><img class="icon_sidebar_cell mCS_img_loaded" src="img/play_blue.png" alt="Jouer">&nbsp;&nbsp;&nbsp;&nbsp;'+escapeHtml(msg.playlists[indicePlaylist].name)+'</div></a>');
			}
			
		});
}