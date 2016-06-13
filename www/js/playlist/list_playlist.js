/*
    Rayane MOHAMED BEN-ALI
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audio Windows 2016 - Audiosa

	Fichier: list_playlist.js
	Description: Liste les playlists sur l'interface et enregistre le contenu de ces playlists
*/

playlistTracks = [];
		
function list_playlists()
{
	$.ajax({
			method: "POST",
			url: "apis/retrievedata.php",
			data: { argPost: "playlists" }
		})
		.done(function( msg ) {
		
			if(msg.status_code != 1)
			{
				console.log("UNE ERREUR EST SURVENUE");
				//GESTION DES ERREURS

				return false;
			}
			
			for(var indicePlaylist=0; indicePlaylist < msg.playlists.length; indicePlaylist++) {
				$("#into_playlists").append('<a href="#" id="'+escapeHtml(msg.playlists[indicePlaylist].name)+'_'+msg.playlists[indicePlaylist].idPLAYLIST+'" data-name="'+escapeHtml(msg.playlists[indicePlaylist].name)+'" data-idplaylist="'+indicePlaylist+'" data-idplaylistDB="'+msg.playlists[indicePlaylist].idPLAYLIST+'" class="no-margin txt-left ui-btn ui-btn-icon-right ui-icon-carat-r"><div class="cellSideBar"><img class="icon_sidebar_cell mCS_img_loaded" src="img/play_blue.png" alt="Jouer">&nbsp;&nbsp;&nbsp;&nbsp;'+escapeHtml(msg.playlists[indicePlaylist].name)+'</div></a>');
				
				playlistTracks[indicePlaylist] = msg.playlists[indicePlaylist].tracks;
				
				$('#'+escapeHtml(msg.playlists[indicePlaylist].name)+'_'+msg.playlists[indicePlaylist].idPLAYLIST).click(function() {
					
					page_actu_playlist = true;


						if(page_actu == 1) {						
							$("#into_morceaux").mCustomScrollbar('destroy');
							$("#into_morceaux").html("");
							$("#transi_morceaux").removeClass("ui-btn-active ui-radio-on");

							$('#popupPlaylistName').html($(this).data("name"));
							$('#popupPlaylistName').data("idp", $(this).data("idplaylistdb"));

							for(var indiceTrack=0; indiceTrack < playlistTracks[$(this).data("idplaylist")].length; indiceTrack++) {

								$("#into_morceaux").append('<li class="no-carat-l musicplay" data-idpiste="'+playlistTracks[$(this).data("idplaylist")][indiceTrack].idPISTES+'" data-emplacement="2" data-emplacement_name="'+$(this).data("idplaylistdb")+'" data-title="'+escapeHtml(playlistTracks[$(this).data("idplaylist")][indiceTrack].title)+'" data-artist="'+escapeHtml(playlistTracks[$(this).data("idplaylist")][indiceTrack].artist)+'" data-cover="'+playlistTracks[$(this).data("idplaylist")][indiceTrack].cover+'" data-duree="'+playlistTracks[$(this).data("idplaylist")][indiceTrack].duree+'"><a class="no-margin txt-left list-central-morceaux ui-btn ui-btn-icon-right ui-icon-carat-r" href="#"><div class="cover"><img class="default-cover-morceaux" src="./img/covers/'+playlistTracks[$(this).data("idplaylist")][indiceTrack].cover+'" alt="Default cover" /></div><div class="morceaux-artist">'+escapeHtml(playlistTracks[$(this).data("idplaylist")][indiceTrack].title)+'<br><span class="morceaux-artist-album">'+escapeHtml(playlistTracks[$(this).data("idplaylist")][indiceTrack].artist)+' - '+escapeHtml(playlistTracks[$(this).data("idplaylist")][indiceTrack].album)+'</span></div></a></li>');

							}
								
							$("#into_morceaux").listview().listview('refresh');
							
														if(pseudo != null)
							{
								$("#into_morceaux").prepend('<li class="no-carat-l" data-role="list-divider" role="heading" ><span style="height: 50px; background-color: #1D1D1D; color: white; font-family: \'Lato\', Calibri, Arial, sans-serif;" class="no-margin txt-left list-central-morceaux ui-btn"><div style="margin-left: 42px; font-size: 0px;"><span id="albumHead_titleAlbum"></span><br><span style="font-size: 19px;" class="morceaux-artist-album"><span id="albumHead_artistAlbum"></span><span id="albumHead_nbrMusic"></span>'+$(this).data("name")+'</span></div><div style="float: right;"><span id="btnDelPlaylist" style="margin-right: 15px;" onclick="$( \'#supprPlaylist\' ).popup( \'open\' )" class="ui-btn-right ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all" data-rel="back" data-role="button" role="button">Retour</span></div></span></li>');
							}
							else
							{
								$("#into_morceaux").prepend('<li class="no-carat-l" data-role="list-divider" role="heading" ><span style="height: 50px; background-color: #1D1D1D; color: white; font-family: \'Lato\', Calibri, Arial, sans-serif;" class="no-margin txt-left list-central-morceaux ui-btn"><div style="margin-left: 42px; font-size: 0px;"><span id="albumHead_titleAlbum"></span><br><span style="font-size: 19px;" class="morceaux-artist-album"><span id="albumHead_artistAlbum"></span><span id="albumHead_nbrMusic"></span>'+$(this).data("name")+'</span></div><div style="float: right;"><span id="btnDelPlaylist" style="display: none; margin-right: 15px;" onclick="$( \'#supprPlaylist\' ).popup( \'open\' )" class="ui-btn-right ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all" data-rel="back" data-role="button" role="button">Retour</span></div></span></li>');
							}	

							$("#into_morceaux").mCustomScrollbar({
								theme:"minimal"
							});
							
						//	console.log("pls");
						//	document.getElementById('dataplss').setAttribute('data', "idp: 'test'");

							createMusicPlayerEvent();
							morceaux_loaded = false;
						}
						else if(page_actu == 2) {
							$("#into_artistes").mCustomScrollbar('destroy');
							$("#into_artistes").html("");
							$("#transi_artiste").removeClass("ui-btn-active ui-radio-on");

							for(var indiceTrack=0; indiceTrack < playlistTracks[$(this).data("idplaylist")].length; indiceTrack++) {
					
								$("#into_artistes").append('<li class="no-carat-l musicplay"><a class="no-margin txt-left list-central-morceaux ui-btn ui-btn-icon-right ui-icon-carat-r" href="#"><div class="cover"><img class="default-cover-morceaux" src="./img/covers/'+playlistTracks[$(this).data("idplaylist")][indiceTrack].cover+'" alt="Default cover" /></div><div class="morceaux-artist">'+escapeHtml(playlistTracks[$(this).data("idplaylist")][indiceTrack].title)+'<br><span class="morceaux-artist-album">'+escapeHtml(playlistTracks[$(this).data("idplaylist")][indiceTrack].artist)+' - '+escapeHtml(playlistTracks[$(this).data("idplaylist")][indiceTrack].album)+'</span></div></a></li>');
				
							}
							
							$("#into_artistes").listview().listview('refresh');
							$("#into_artistes").mCustomScrollbar({
								theme:"minimal"
							});
							
							$("#into_artistes").prepend('<li class="no-carat-l" data-role="list-divider" role="heading" ><span style="height: 50px; background-color: #1D1D1D; color: white; font-family: \'Lato\', Calibri, Arial, sans-serif;" class="no-margin txt-left list-central-morceaux ui-btn"><div style="margin-left: 42px; font-size: 0px;"><span id="albumHead_titleAlbum"></span><br><span style="font-size: 19px;" class="morceaux-artist-album"><span id="albumHead_artistAlbum"></span><span id="albumHead_nbrMusic"></span>'+$(this).data("name")+'</span></div><div style="float: right;"><span style="margin-right: 15px;" onclick="$( \'#supprPlaylist\' ).popup( \'open\' )" class="ui-btn-right ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all" data-rel="back" data-role="button" role="button">Retour</span></div></span></li>');

							artistes_loaded = false;
						}
						else {
							$("#into_albums").mCustomScrollbar('destroy');
							$("#into_albums").html("");	
							$("#transi_album").removeClass("ui-btn-active ui-radio-on");

							for(var indiceTrack=0; indiceTrack < playlistTracks[$(this).data("idplaylist")].length; indiceTrack++) {
					
								$("#into_albums").append('<li class="no-carat-l musicplay"><a class="no-margin txt-left list-central-morceaux ui-btn ui-btn-icon-right ui-icon-carat-r" href="#"><div class="cover"><img class="default-cover-morceaux" src="./img/covers/'+playlistTracks[$(this).data("idplaylist")][indiceTrack].cover+'" alt="Default cover" /></div><div class="morceaux-artist">'+escapeHtml(playlistTracks[$(this).data("idplaylist")][indiceTrack].title)+'<br><span class="morceaux-artist-album">'+escapeHtml(playlistTracks[$(this).data("idplaylist")][indiceTrack].artist)+' - '+escapeHtml(playlistTracks[$(this).data("idplaylist")][indiceTrack].album)+'</span></div></a></li>');
				
							}
							
							$("#into_albums").listview().listview('refresh');
							$("#into_albums").mCustomScrollbar({
								theme:"minimal"
							});
							
							$("#into_albums").prepend('<li class="no-carat-l" data-role="list-divider" role="heading" ><span style="height: 50px; background-color: #1D1D1D; color: white; font-family: \'Lato\', Calibri, Arial, sans-serif;" class="no-margin txt-left list-central-morceaux ui-btn"><div style="margin-left: 42px; font-size: 0px;"><span id="albumHead_titleAlbum"></span><br><span style="font-size: 19px;" class="morceaux-artist-album"><span id="albumHead_artistAlbum"></span><span id="albumHead_nbrMusic"></span>'+$(this).data("name")+'</span></div><div style="float: right;"><span style="margin-right: 15px;" onclick="$( \'#supprPlaylist\' ).popup( \'open\' )" class="ui-btn-right ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all" data-rel="back" data-role="button" role="button">Retour</span></div></span></li>');
							
							albums_loaded = false;							
						}
					
				
				});
			}
			
			
			
		});
}