/*
    Rayane MOHAMED BEN-ALI
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audio Windows 2016 - Audiosa

	Fichier: list_music.js
	Description: Chargement des listes de musiques Morceaux / Artistes / Albums
				 et création des evenements.
*/

musicArray = [];

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
		cache: false,
		data: { argPost: type }
	})
	.done(function( msg ) {
		ListeMusiques = msg;
		
		if(type == "morceaux") {
			musicArray = msg.pistes;
		}

		if(msg.status_code != 1)
		{
			//console.log("UNE ERREUR EST SURVENUE");
			//GESTION DES ERREURS

			return false;
		}
		$("#into_"+type).mCustomScrollbar('destroy');
		$("#into_"+type).empty();
	//	$("#into_"+type).html("");	
			
			
			
			if(type == "morceaux") {
				for(var indicePiste=0; indicePiste < msg.pistes.length; indicePiste++) {
					$("#into_"+type).append('<li class="no-carat-l musicplay" data-idpiste="'+msg.pistes[indicePiste].idPISTES+'" data-emplacement="0" data-emplacement_name="" data-title="'+escapeHtml(msg.pistes[indicePiste].title)+'" data-artist="'+escapeHtml(msg.pistes[indicePiste].artist)+'" data-cover="'+msg.pistes[indicePiste].cover+'?'+ddate.getTime()+'" data-duree="'+msg.pistes[indicePiste].duree+'" ><a class="no-margin txt-left list-central-morceaux ui-btn ui-btn-icon-right ui-icon-carat-r" href="#"><div class="cover"><img class="default-cover-morceaux" src="./img/covers/'+msg.pistes[indicePiste].cover+'?'+ddate.getTime()+'" alt="Default cover" /></div><div class="morceaux-artist">'+escapeHtml(msg.pistes[indicePiste].title)+'<br><span class="morceaux-artist-album">'+escapeHtml(msg.pistes[indicePiste].artist)+' - '+escapeHtml(msg.pistes[indicePiste].album)+'</span></div><div class="edit_music_container"><img onclick="loadEditMetatagPopup('+indicePiste+');" class="edit_music" src="img/edit_music.png"></div></a></li>');
				
					if(indicePiste == 0) {
						
						var duree = msg.pistes[indicePiste].duree,
						
						// Global player vars
						emplacement 		= 0; //0: pistes; 1: album; 2: playlist
						emplacement_name 	= ""; //	Nom album ou idPlaylist
						idMusic				= msg.pistes[indicePiste].idPISTES;
								
						PosiEntiereSecondeChange = duree;
						PosiEntiere = duree*1000;
						
						var mins = ~~(duree / 60);
						var secs = ~~(duree % 60);
						
						$("#mediaPlayerTitle").html(escapeHtml(msg.pistes[indicePiste].title));
						$("#mediaPlayerArtist").html(escapeHtml(msg.pistes[indicePiste].artist));
						$("#mediaPlayerDuree").html(mins+":"+secs);
						$("#web-player-img").attr("src","img/covers/"+msg.pistes[indicePiste].cover+'?'+ddate.getTime());
						$("#web-player").css("background-image","url('img/covers/"+msg.pistes[indicePiste].cover+'?'+ddate.getTime()+"')");
					}
				}
				
			$( ".edit_music" ).click(function( event ) {
			  event.preventDefault();
			  return false;
			});
				
				if(pseudo != null && passwordHash != null)
				{
					$(".edit_music_container").css("display", "block");
				}
				
				createMusicPlayerEvent();
				morceaux_loaded = true;
				$("#into_"+type).listview("refresh");
				$('body').removeClass('ui-loading');
			}
			else if(type == "artistes")
			{
				console.log(msg.artistes);

				var nbrMorceaux = 0,
					nbrArtist = 0;
			
				$("#into_"+type).css("display","none");
				
			//	for(var indicePiste=0; indicePiste < msg.artistes.length; indicePiste++) {

					for(var indicenbrMorceaux=0; indicenbrMorceaux < msg.artistes[0].albums.length; indicenbrMorceaux++) {
						
						nbrMorceaux += msg.artistes[0].albums[indicenbrMorceaux].items_count;
					}
					
					get_artist_cover(0, type, msg, msg.artistes.length, nbrMorceaux);
					
					//nbrMorceaux = 0;
			//	}
								
			}
			else
			{			
				for(var indicePiste=0; indicePiste < msg.albums.length; indicePiste++) {
					$("#into_"+type).append('<li class="album_tracks" data-albumindex="'+indicePiste+'"><a class="no-margin txt-left list-central-morceaux" href="#"><div class="cover"><img class="default-cover-morceaux" src="./img/covers/'+msg.albums[indicePiste].tracks[0].cover+'" alt="Default cover" /></div><div class="morceaux-artist">'+escapeHtml(msg.albums[indicePiste].album_name)+'<br><span class="morceaux-artist-album">'+escapeHtml(msg.albums[indicePiste].artist_name)+' - '+msg.albums[indicePiste].items_count+' musique(s)</span></div> </a></li>');
				}
				
				createAlbumEvent(msg);
				
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

function createMusicPlayerEvent()
{

$(".musicplay").click(function() {
	posiactuelle = 0;
	
//	console.log("perdu");
	var idpiste = $(this).data("idpiste"),
		title = $(this).data("title"),
		artist = $(this).data("artist"),
		cover = $(this).data("cover"),
		duree = $(this).data("duree"),
		emplacement = $(this).data("emplacement"),
		emplacement_name = $(this).data("emplacement_name"),
		finalTime,
		minutes,
		seconds;
		
		// Global player vars
		emplacement 		= emplacement; //0: pistes; 1: album; 2: playlist
		emplacement_name 	= emplacement_name; //	Nom album ou idPlaylist
		idMusic				= idpiste;
		
		minutes = Math.floor(duree / 60);
		seconds = duree - minutes * 60;


		finalTime = str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
		
		$("#mediaPlayerTitle").html(escapeHtml(title));
		$("#mediaPlayerArtist").html(escapeHtml(artist));
		$("#mediaPlayerDuree").html(finalTime);
		$("#web-player-img").attr("src","img/covers/"+cover);
		$("#web-player").css("background-image","url('img/covers/"+cover+"')");
		
		actionPlayer(wsocket, idMusic, 0, volumeRate, emplacement, emplacement_name);
	
});

}

function str_pad_left(string,pad,length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
}

function get_artist_cover(indicePiste,type,msg,maxPiste,nbrMorceaux) {

	var medium_picture;

	$.ajax({
		type: 'GET',
		url: "https://api.deezer.com/search?q="+msg.artistes[indicePiste].artist_name+"&limit=1&output=jsonp",
		dataType: 'jsonp',
		cache: true,
		contentType: "application/json; charset=utf-8"
		}).done(function(data) {
			
			if(typeof data.data == 'undefined' || typeof data.data[0] == 'undefined' || typeof data.data[0].artist == 'undefined' || typeof data.data[0].artist.picture_medium == 'undefined') {
				medium_picture = "https://cdns-images.dzcdn.net/images/artist//250x250-000000-80-0-0.jpg"
			}
			else
			{
				medium_picture = data.data[0].artist.picture_medium;
			}
			
				
			$("#into_"+type).append('<li class="artiste_tracklist" data-artistindex="'+indicePiste+'"><a class="no-margin txt-left list-central-morceaux ui-btn ui-btn-icon-right ui-icon-carat-r" href="#"><div class="cover"><img class="default-cover-morceaux" src="'+medium_picture+'" alt="Default cover"></div><div class="morceaux-artist">'+msg.artistes[indicePiste].artist_name+'<br><span class="morceaux-artist-album">'+msg.artistes[indicePiste].items_count+' Albums - '+nbrMorceaux+' Morceaux</span></div></a></li>');
			
			indicePiste++;
			
			if(indicePiste < (maxPiste-1)) {
				nbrMorceaux = 0;

				for(var indicenbrMorceaux=0; indicenbrMorceaux < msg.artistes[indicePiste].albums.length; indicenbrMorceaux++) {	
					nbrMorceaux += msg.artistes[indicePiste].albums[indicenbrMorceaux].items_count;
				}
				get_artist_cover(indicePiste, type, msg, maxPiste, nbrMorceaux);
			}
			
			if(indicePiste == (maxPiste-1)) {
			
				console.log(indicePiste);

				$("#into_"+type).listview().listview('refresh');
				$("#into_"+type).mCustomScrollbar({
						theme:"minimal"
				});
				$("#into_"+type).css("display","block");
				createArtistEvent(msg);
				$('body').removeClass('ui-loading');
				artistes_loaded = true;
				
				return;
			}
		});

}

function createAlbumEvent(msg) {

$(".album_tracks").click(function() {

	var albumInddex = $(this).data("albumindex");
	console.log(albumInddex);
	ListeMusiques.pistes = ListeMusiques.albums[albumInddex].tracks;
	$("#into_albums").mCustomScrollbar('destroy');
	$("#into_albums").html("");

	for(var indicePiste=0; indicePiste < msg.albums[albumInddex].tracks.length; indicePiste++) {
		$("#into_albums").append('<li class="no-carat-l musicplay" data-idpiste="'+msg.albums[albumInddex].tracks[indicePiste].idPISTES+'" data-emplacement="1" data-emplacement_name="'+escapeHtml(msg.albums[albumInddex].album_name)+'" data-title="'+escapeHtml(msg.albums[albumInddex].tracks[indicePiste].title)+'" data-artist="'+escapeHtml(msg.albums[albumInddex].tracks[indicePiste].artist)+'" data-cover="'+msg.albums[albumInddex].tracks[indicePiste].cover+'" data-duree="'+msg.albums[albumInddex].tracks[indicePiste].duree+'"><a class="no-margin txt-left list-central-morceaux ui-btn ui-btn-icon-right ui-icon-carat-r" href="#"><div class="cover"><img class="default-cover-morceaux" src="./img/covers/'+msg.albums[albumInddex].tracks[indicePiste].cover+'" alt="Default cover" /></div><div class="morceaux-artist">'+escapeHtml(msg.albums[albumInddex].tracks[indicePiste].title)+'<br><span class="morceaux-artist-album">'+escapeHtml(msg.albums[albumInddex].tracks[indicePiste].artist)+' - '+escapeHtml(msg.albums[albumInddex].tracks[indicePiste].album)+'</span></div></a></li>');
	}
	
	$("#into_albums").listview().listview('refresh');
	$("#into_albums").prepend('<li class="no-carat-l" data-role="list-divider" role="heading" ><span style="height: 110px; background-color: #1D1D1D; color: white; font-family: \'Lato\', Calibri, Arial, sans-serif;" class="no-margin txt-left list-central-morceaux ui-btn"><div class="cover"><img id="albumHead_coverAlbum" style="width: 87px;" class="default-cover-morceaux" src="" alt="Default cover" /></div><div style="margin-left: 42px; font-size: 22px;" class="morceaux-artist"><span id="albumHead_titleAlbum"></span><br><span style="font-size: 13px;" class="morceaux-artist-album"><span id="albumHead_artistAlbum"></span> - <span id="albumHead_nbrMusic"></span> musiques</span></div><div style="float: right;"><span style="margin-right: 15px;" onclick="get_music(\'albums\')" class="ui-btn-right ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all" data-rel="back" data-role="button" role="button">Retour</span></div></span></li>');

	$("#albumHead_nbrMusic").html(msg.albums[albumInddex].tracks.length);
	$("#albumHead_titleAlbum").html(msg.albums[albumInddex].album_name);
	$("#albumHead_artistAlbum").html(msg.albums[albumInddex].artist_name);
	$("#albumHead_coverAlbum").attr("src","./img/covers/"+msg.albums[albumInddex].tracks[0].cover);
	
	$("#into_albums").mCustomScrollbar({
			theme:"minimal"
	});

	createMusicPlayerEvent();
	albums_loaded = false;
});

}

function createArtistEvent(msg) {

$(".artiste_tracklist").click(function() {

	var artistInddex = $(this).data("artistindex");
	console.log(msg.artistes[artistInddex].albums);
		
	$("#into_artistes").mCustomScrollbar('destroy');
	$("#into_artistes").html("");

	for(var indicePiste=0; indicePiste < msg.artistes[artistInddex].albums.length; indicePiste++) {
		$("#into_artistes").append('<li class="artist_album_tracks" data-albumindex="'+indicePiste+'"><a class="no-margin txt-left list-central-morceaux" href="#"><div class="cover"><img class="default-cover-morceaux" src="./img/covers/'+msg.artistes[artistInddex].albums[0].tracks[0].cover+'" alt="Default cover" /></div><div class="morceaux-artist">'+escapeHtml(msg.artistes[artistInddex].albums[indicePiste].album_name)+'<br><span class="morceaux-artist-album">'+escapeHtml(msg.artistes[artistInddex].artist_name)+' - '+msg.artistes[artistInddex].albums[indicePiste].items_count+' musique(s)</span></div> </a></li>');
	}
	
	$("#into_artistes").listview().listview('refresh');
	$("#into_artistes").prepend('<li class="no-carat-l" data-role="list-divider" role="heading" ><span style="background-color: #1D1D1D;" class="no-margin txt-left list-central-morceaux ui-btn">'+msg.artistes[artistInddex].artist_name+'<div style="float: right;"><span style="margin-right: 15px;" onclick="get_music(\'artistes\')" class="ui-btn-right ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all" data-rel="back" data-role="button" role="button">Retour</span></div></span></li>');
	
	$("#into_artistes").mCustomScrollbar({
			theme:"minimal"
	});
	
	createArtistAlbumEvent(msg, artistInddex);

	artistes_loaded = false;

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
		emplacement_name = $(this).data("emplacement_name");
		
		// Global player vars
		emplacement 		= emplacement; //0: pistes; 1: album; 2: playlist
		emplacement_name 	= emplacement_name; //	Nom album ou idPlaylist
		idMusic				= idpiste;
				
		PosiEntiereSecondeChange = $(this).data("duree");
		PosiEntiere = duree*1000;
		

		
		var mins = ~~(duree / 60);
		var secs = ~~(duree % 60);
		
		$("#mediaPlayerTitle").html(escapeHtml(title));
		$("#mediaPlayerArtist").html(escapeHtml(artist));
		$("#mediaPlayerDuree").html(mins+":"+secs);
		$("#web-player-img").attr("src","img/covers/"+cover);
		$("#web-player").css("background-image","url('img/covers/"+cover+"')");
		
		actionPlayer(wsocket, idMusic, 0, volumeRate, emplacement, emplacement_name);
		isPlayed = true;		

});

}

function createArtistAlbumEvent(msg, artistInddex) {

$(".artist_album_tracks").click(function() {

	var albumInddex = $(this).data("albumindex");
	ListeMusiques.pistes = msg.artistes[artistInddex].albums[albumInddex].tracks;
	console.log(albumInddex);
		
	$("#into_artistes").mCustomScrollbar('destroy');
	$("#into_artistes").html("");

	for(var indicePiste=0; indicePiste < msg.artistes[artistInddex].albums[albumInddex].tracks.length; indicePiste++) {
		$("#into_artistes").append('<li class="no-carat-l musicplay" data-idpiste="'+msg.artistes[artistInddex].albums[albumInddex].tracks[indicePiste].idPISTES+'" data-emplacement="1" data-emplacement_name="'+escapeHtml(msg.artistes[artistInddex].albums[albumInddex].album_name)+'" data-title="'+escapeHtml(msg.artistes[artistInddex].albums[albumInddex].tracks[indicePiste].title)+'" data-artist="'+escapeHtml(msg.artistes[artistInddex].albums[albumInddex].tracks[indicePiste].artist)+'" data-cover="'+msg.artistes[artistInddex].albums[albumInddex].tracks[indicePiste].cover+'" data-duree="'+msg.artistes[artistInddex].albums[albumInddex].tracks[indicePiste].duree+'"><a class="no-margin txt-left list-central-morceaux ui-btn ui-btn-icon-right ui-icon-carat-r" href="#"><div class="cover"><img class="default-cover-morceaux" src="./img/covers/'+msg.artistes[artistInddex].albums[albumInddex].tracks[indicePiste].cover+'" alt="Default cover" /></div><div class="morceaux-artist">'+escapeHtml(msg.artistes[artistInddex].albums[albumInddex].tracks[indicePiste].title)+'<br><span class="morceaux-artist-album">'+escapeHtml(msg.artistes[artistInddex].albums[albumInddex].tracks[indicePiste].artist)+' - '+escapeHtml(msg.artistes[artistInddex].albums[albumInddex].tracks[indicePiste].album)+'</span></div></a></li>');
	}
	
	$("#into_artistes").listview().listview('refresh');
	$("#into_artistes").prepend('<li class="no-carat-l" data-role="list-divider" role="heading" ><span style="height: 110px; background-color: #1D1D1D; color: white; font-family: \'Lato\', Calibri, Arial, sans-serif;" class="no-margin txt-left list-central-morceaux ui-btn"><div class="cover"><img id="albumHead_coverAlbum" style="width: 87px;" class="default-cover-morceaux" src="" alt="Default cover" /></div><div style="margin-left: 42px; font-size: 22px;" class="morceaux-artist"><span id="albumHead_titleAlbum"></span><br><span style="font-size: 13px;" class="morceaux-artist-album"><span id="albumHead_artistAlbum"></span> - <span id="albumHead_nbrMusic"></span> musiques</span></div><div style="float: right;"><span style="margin-right: 15px;" onclick="get_music(\'artistes\')" class="ui-btn-right ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all" data-rel="back" data-role="button" role="button">Retour</span></div></span></li>');

	$("#albumHead_nbrMusic").html(msg.artistes[artistInddex].albums[albumInddex].tracks.length);
	$("#albumHead_titleAlbum").html(msg.artistes[artistInddex].albums[albumInddex].album_name);
	$("#albumHead_artistAlbum").html(msg.artistes[artistInddex].artist_name);
	$("#albumHead_coverAlbum").attr("src","./img/covers/"+msg.artistes[artistInddex].albums[albumInddex].tracks[0].cover);
	
	$("#into_artistes").mCustomScrollbar({
			theme:"minimal"
	});
	
	createMusicPlayerEvent();
	artistes_loaded = false;
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
  