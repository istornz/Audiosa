musicArray = [];

  
get_music("morceaux");
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
		
		$('body').removeClass('ui-loading');
		
		musicArray = msg.pistes;
		
		if(msg.status_code != 1)
		{
			console.log("UNE ERREUR EST SURVENUE");
			//GESTION DES ERREURS

			return false;
		}
		$("#into_"+type).mCustomScrollbar('destroy');
		$("#into_"+type).html("");
			
			if(type == "morceaux") {
				for(var indicePiste=0; indicePiste < msg.pistes.length; indicePiste++) {
					$("#into_"+type).append('<li class="no-carat-l"><a class="no-margin txt-left list-central-morceaux ui-btn ui-btn-icon-right ui-icon-carat-r" href="#"><div class="cover"><img class="default-cover-morceaux" src="./img/covers/'+msg.pistes[indicePiste].cover+'" alt="Default cover" /></div><div class="morceaux-artist">'+escapeHtml(msg.pistes[indicePiste].title)+'<br><span class="morceaux-artist-album">'+escapeHtml(msg.pistes[indicePiste].artist)+' - '+escapeHtml(msg.pistes[indicePiste].album)+'</span></div><div class="edit_music_container"><img onclick="loadEditMetatagPopup('+indicePiste+');" class="edit_music" src="img/edit_music.png"></div></a></li>');
				}
				
				if(pseudo != null && passwordHash != null)
				{
					$(".edit_music_container").css("display", "block");
				}
				
			}
			else if(type == "artistes")
			{
				for(var indicePiste=0; indicePiste < msg.artists.length; indicePiste++) {
				
					$.ajax({
                    type: 'GET',
                    url: 'http://api.deezer.com/search?q=booba',
                    dataType: 'jsonp',
                    success: function(data) {
                        console.log(data);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        //console.log(XMLHttpRequest);
                        //console.log(textStatus);
                        //console.log(errorThrown);
                    }
                });
				}
				
			}
			else
			{
				for(var indicePiste=0; indicePiste < msg.albums.length; indicePiste++) {
					$("#into_"+type).append('<li><a class="no-margin txt-left list-central-morceaux" href="#"><div class="cover"><img class="default-cover-morceaux" src="./img/covers/'+msg.albums[indicePiste].tracks[0].cover+'" alt="Default cover" /></div><div class="morceaux-artist">'+escapeHtml(msg.albums[indicePiste].album_name)+'<br><span class="morceaux-artist-album">'+escapeHtml(msg.albums[indicePiste].artist_name)+' - '+msg.albums.length+' musiques</span></div> </a></li>');
				}
			}
			  
			$("#into_"+type).listview().listview('refresh');
			$("#into_"+type).mCustomScrollbar({
				theme:"minimal"
			});
	});
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
  