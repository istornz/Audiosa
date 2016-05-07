musicArray = [];

//get_music("artistes");
//get_music("albums");

//type : artistes / morceaux / albums

function get_music(type) {
	
	if(type != "artistes" && type != "morceaux" && type != "albums") {
		console.log(type);
		return false;
	}
	
	$('body').addClass('ui-loading');
	
	$.ajax({
		method: "POST",
		url: "apis/retrievedata.php",
		data: { argPost: type }
	})
	.done(function( msg ) {
		ListeMusiques = msg;
		
		musicArray = msg.pistes;
		
		console.log(msg);

		if(msg.status_code != 1)
		{
			//console.log("UNE ERREUR EST SURVENUE");
			//GESTION DES ERREURS

			return false;
		}
		$("#into_"+type).mCustomScrollbar('destroy');
		$("#into_"+type).html("");	
			
			if(type == "morceaux") {
				for(var indicePiste=0; indicePiste < msg.pistes.length; indicePiste++) {
					$("#into_"+type).append('<li class="no-carat-l musicplay" data-idpiste="'+msg.pistes[indicePiste].idPISTES+'" data-emplacement="0" data-title="'+escapeHtml(msg.pistes[indicePiste].title)+'" data-artist="'+escapeHtml(msg.pistes[indicePiste].artist)+'" data-cover="'+msg.pistes[indicePiste].cover+'" data-duree="'+msg.pistes[indicePiste].duree+'" ><a class="no-margin txt-left list-central-morceaux ui-btn ui-btn-icon-right ui-icon-carat-r" href="#"><div class="cover"><img class="default-cover-morceaux" src="./img/covers/'+msg.pistes[indicePiste].cover+'" alt="Default cover" /></div><div class="morceaux-artist">'+escapeHtml(msg.pistes[indicePiste].title)+'<br><span class="morceaux-artist-album">'+escapeHtml(msg.pistes[indicePiste].artist)+' - '+escapeHtml(msg.pistes[indicePiste].album)+'</span></div><div class="edit_music_container"><img onclick="loadEditMetatagPopup('+indicePiste+');" class="edit_music" src="img/edit_music.png"></div></a></li>');
				}
				
				if(pseudo != null && passwordHash != null)
				{
					$(".edit_music_container").css("display", "block");
				}
				
				createMusicPlayerEvent()
				morceaux_loaded = true;
				
				$('body').removeClass('ui-loading');
			}
			else if(type == "artistes")
			{
				var nbrMorceaux = 0;
			
				$("#into_"+type).css("display","none");
				for(var indicePiste=0; indicePiste < msg.artistes.length; indicePiste++) {

				for(var indicenbrMorceaux=0; indicenbrMorceaux < msg.artistes[indicePiste].albums.length; indicenbrMorceaux++) {
						
						nbrMorceaux += msg.artistes[indicePiste].albums[indicenbrMorceaux].items_count;
					}
					
					get_artist_cover(indicePiste, type, msg, msg.artistes.length, nbrMorceaux);
					
					nbrMorceaux = 0;
				}
				
			}
			else
			{
				for(var indicePiste=0; indicePiste < msg.albums.length; indicePiste++) {
					$("#into_"+type).append('<li><a class="no-margin txt-left list-central-morceaux" href="#"><div class="cover"><img class="default-cover-morceaux" src="./img/covers/'+msg.albums[indicePiste].tracks[0].cover+'" alt="Default cover" /></div><div class="morceaux-artist">'+escapeHtml(msg.albums[indicePiste].album_name)+'<br><span class="morceaux-artist-album">'+escapeHtml(msg.albums[indicePiste].artist_name)+' - '+msg.albums[indicePiste].items_count+' musique(s)</span></div> </a></li>');
				}
				
				$('body').removeClass('ui-loading');
				albums_loaded = true;
			}
			
			if(type != "artistes") {
				$("#into_"+type).listview().listview('refresh');
				$("#into_"+type).mCustomScrollbar({
					theme:"minimal"
				});
			}
	});
	
	
}


$("#button_my_music").click(function() {
	$( '.paging_morceaux' ).click();
});

function get_artist_cover(indicePiste,type,msg,maxPiste,nbrMorceaux) {

	$.ajax({
		type: 'GET',
		url: "https://api.deezer.com/search?q="+msg.artistes[indicePiste].artist_name+"&limit=1&output=jsonp",
		dataType: 'jsonp',
		cache: true,
		contentType: "application/json; charset=utf-8"
		}).done(function(data) {
			$("#into_"+type).append('<li><a class="no-margin txt-left list-central-morceaux ui-btn ui-btn-icon-right ui-icon-carat-r" href="#"><div class="cover"><img class="default-cover-morceaux" src="'+data.data[0].artist.picture_medium+'" alt="Default cover"></div><div class="morceaux-artist">'+msg.artistes[indicePiste].artist_name+'<br><span class="morceaux-artist-album">'+msg.artistes[indicePiste].items_count+' Albums - '+nbrMorceaux+' Morceaux</span></div></a></li>');
			
			if(indicePiste == --maxPiste) {

				$("#into_"+type).listview().listview('refresh');
				$("#into_"+type).mCustomScrollbar({
						theme:"minimal"
				});
				$("#into_"+type).css("display","block");

				$('body').removeClass('ui-loading');
				artistes_loaded = true;
			}
		});

}

function createMusicPlayerEvent()
{

$(".musicplay").click(function() {
	var idpiste = $(this).data("idpiste"),
		title = $(this).data("title"),
		artist = $(this).data("artist"),
		cover = $(this).data("cover"),
		duree = $(this).data("duree"),
		emplacement = $(this).data("emplacement"),
		emplacement_name = $(this).data("emplacement"),
		finalTime,
		minutes,
		seconds;
		
		// Global player vars
		emplacement 		= emplacement; //0: pistes; 1: album; 2: playlist
		emplacement_name 	= emplacement_name; //	Nom album ou idPlaylist
		idMusic				= idpiste;
		volumeRate 			= 1;
		mode_player 		= 0; //Lecture a la suite, 1 pour alea
		
		minutes = Math.floor(duree / 60);
		seconds = duree - minutes * 60;


		finalTime = str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
		
		$("#mediaPlayerTitle").html(escapeHtml(title));
		$("#mediaPlayerArtist").html(escapeHtml(artist));
		$("#mediaPlayerDuree").html(finalTime);
		$("#web-player-img").attr("src","img/covers/"+cover);
		$("#web-player").css("background-image","url('img/covers/"+cover+"')");
		
		actionPlayer(wsocket, idMusic, 0, mode_player, volumeRate, emplacement, emplacement_name);
	
});

}

function str_pad_left(string,pad,length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
}

function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
  