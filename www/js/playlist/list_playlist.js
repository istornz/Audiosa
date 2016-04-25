playlistTracks = [];
		
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
				$("#into_playlists").append('<a href="#" id="'+escapeHtml(msg.playlists[indicePlaylist].name)+'_'+msg.playlists[indicePlaylist].idPLAYLIST+'" data-idplaylist="'+indicePlaylist+'" class="no-margin txt-left ui-btn ui-btn-icon-right ui-icon-carat-r"><div class="cellSideBar"><img class="icon_sidebar_cell mCS_img_loaded" src="img/play_blue.png" alt="Jouer">&nbsp;&nbsp;&nbsp;&nbsp;'+escapeHtml(msg.playlists[indicePlaylist].name)+'</div></a>');
				
				playlistTracks[indicePlaylist] = msg.playlists[indicePlaylist].tracks;
				
				$('#'+escapeHtml(msg.playlists[indicePlaylist].name)+'_'+msg.playlists[indicePlaylist].idPLAYLIST).click(function() {
					
					page_actu_playlist = true;
					
						if(page_actu == 1) {
							$("#into_morceaux").mCustomScrollbar('destroy');
							$("#into_morceaux").html("");
							$("#transi_morceaux").removeClass("ui-btn-active ui-radio-on");

							for(var indiceTrack=0; indiceTrack < playlistTracks[$(this).data("idplaylist")].length; indiceTrack++) {
					
								console.log(playlistTracks[$(this).data("idplaylist")][indiceTrack]);
								$("#into_morceaux").append('<li class="no-carat-l"><a class="no-margin txt-left list-central-morceaux ui-btn ui-btn-icon-right ui-icon-carat-r" href="#"><div class="cover"><img class="default-cover-morceaux" src="./img/covers/'+playlistTracks[$(this).data("idplaylist")][indiceTrack].cover+'" alt="Default cover" /></div><div class="morceaux-artist">'+escapeHtml(playlistTracks[$(this).data("idplaylist")][indiceTrack].title)+'<br><span class="morceaux-artist-album">'+escapeHtml(playlistTracks[$(this).data("idplaylist")][indiceTrack].artist)+' - '+escapeHtml(playlistTracks[$(this).data("idplaylist")][indiceTrack].album)+'</span></div></a></li>');
				
							}
							
							$("#into_morceaux").listview().listview('refresh');
							$("#into_morceaux").mCustomScrollbar({
								theme:"minimal"
							});
						}
						else if(page_actu == 2) {
							$("#into_artistes").mCustomScrollbar('destroy');
							$("#into_artistes").html("");
							$("#transi_artiste").removeClass("ui-btn-active ui-radio-on");

							for(var indiceTrack=0; indiceTrack < playlistTracks[$(this).data("idplaylist")].length; indiceTrack++) {
					
								console.log(playlistTracks[$(this).data("idplaylist")][indiceTrack]);
								$("#into_artistes").append('<li class="no-carat-l"><a class="no-margin txt-left list-central-morceaux ui-btn ui-btn-icon-right ui-icon-carat-r" href="#"><div class="cover"><img class="default-cover-morceaux" src="./img/covers/'+playlistTracks[$(this).data("idplaylist")][indiceTrack].cover+'" alt="Default cover" /></div><div class="morceaux-artist">'+escapeHtml(playlistTracks[$(this).data("idplaylist")][indiceTrack].title)+'<br><span class="morceaux-artist-album">'+escapeHtml(playlistTracks[$(this).data("idplaylist")][indiceTrack].artist)+' - '+escapeHtml(playlistTracks[$(this).data("idplaylist")][indiceTrack].album)+'</span></div></a></li>');
				
							}		

							$("#into_artistes").listview().listview('refresh');
							$("#into_artistes").mCustomScrollbar({
								theme:"minimal"
							});							
						}
						else {
							$("#into_albums").mCustomScrollbar('destroy');
							$("#into_albums").html("");	
							$("#transi_album").removeClass("ui-btn-active ui-radio-on");

							for(var indiceTrack=0; indiceTrack < playlistTracks[$(this).data("idplaylist")].length; indiceTrack++) {
					
								console.log(playlistTracks[$(this).data("idplaylist")][indiceTrack]);
								$("#into_albums").append('<li class="no-carat-l"><a class="no-margin txt-left list-central-morceaux ui-btn ui-btn-icon-right ui-icon-carat-r" href="#"><div class="cover"><img class="default-cover-morceaux" src="./img/covers/'+playlistTracks[$(this).data("idplaylist")][indiceTrack].cover+'" alt="Default cover" /></div><div class="morceaux-artist">'+escapeHtml(playlistTracks[$(this).data("idplaylist")][indiceTrack].title)+'<br><span class="morceaux-artist-album">'+escapeHtml(playlistTracks[$(this).data("idplaylist")][indiceTrack].artist)+' - '+escapeHtml(playlistTracks[$(this).data("idplaylist")][indiceTrack].album)+'</span></div></a></li>');
				
							}
							
							$("#into_albums").listview().listview('refresh');
							$("#into_albums").mCustomScrollbar({
								theme:"minimal"
							});					
						}
					
				
				});
			}
			
			
			
		});
}