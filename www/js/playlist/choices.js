/*
    Rayane MOHAMED BEN-ALI
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audio Windows 2016 - Audiosa

	Fichier: choices.js
	Description: Gestion des choix de l'utilisateur sur l'interface création de playlist
*/

genres_choisis 		= [];
artistes_choisis 	= [];
albums_choisis 		= [];
annees_choisis 		= [];

genresLoaded		= false, 
albumsLoaded		= false,
artistesLoaded		= false,
anneesLoaded		= false;

$(document).ready(function() {

$(".choice_click").click(function() {
	$("#quitPlaylistButton").css("display","none");
	$("#backPlaylistChoice").css("display","block");
});

$("#backPlaylistChoice").click(function() {
	choice_back();
});

$("#choice_genres").click(function() {
	$("#choix").css("display","none");
	$("#list_genres").css("display","block");
});

$("#choice_artistes").click(function() {
	$("#choix").css("display","none");
	$("#list_artistes").css("display","block");
});

$("#choice_annees").click(function() {
	$("#choix").css("display","none");
	$("#list_annees").css("display","block");
});

$("#choice_albums").click(function() {
	$("#choix").css("display","none");
	$("#list_albums").css("display","block");
});

$("#create_playlist").click(function() {
	$("#choix").css("display","none");
	$("#list_annees").css("display","none");
	$("#list_albums").css("display","none");
	$("#list_artistes").css("display","none");
	$("#list_genres").css("display","none");
	$("#set_playlist_name").css("display","block");
	$("#create_playlist").css("display","none");
	
	$("#quitPlaylistButton").css("display","none");
	$("#backPlaylistChoice").css("display","block");
	
	$("#animate_playlist").css("height","350px");
	$("#animate_playlist").css("width","366px");
});

$("#valider_playlist").click(function() {

	var name = $("#nom_playlist_input").val();
	
	if( name ) {
	
		var alphanum  = /[^a-z\d]/i;
		var nameIsValid = !(alphanum.test( name ));
		var elementMessageDiv = $("#messageInfoPlaylistDiv");
		var elementMessageLabel = $("#messageInfoPlaylistLabel");
		
		if(nameIsValid) {

			sendChoices(genres_choisis, 
						artistes_choisis, 
						annees_choisis, 
						albums_choisis, 
						name, function( rep ) {
							
								console.log(name);
						
							if(rep.status_code == 0) {
							
								if(rep.error_description == "undeclared variables")
								{
								
									elementMessageLabel.text("Vous devez être connecté");
									
								}
								else if(rep.error_description == "connection to database failed")
								{
								
									elementMessageLabel.text("Une erreur est survenue, réessayez plus tard");
									
								}
								else if(rep.error_description == "username and/or password does not match")
								{
								
									elementMessageLabel.text("Vous devez être connecté");
									
								}
								else if(rep.error_description == "Music list is empty")
								{
								
									elementMessageLabel.text("Aucune musique ne corréspond à votre recherche");
									
								}
								else
								{
									elementMessageLabel.text("Une erreur est survenue, réessayez plus tard");
								}
							
								elementMessageDiv.css("background-color", "#e74c3c");
					
								elementMessageDiv.css("display", "block");
																		
								elementMessageDiv.addClass("animated shake");
									
								window.setTimeout(function() {
									elementMessageDiv.css("display", "none");
								}, 2500);
									
							} 
							else 
							{
							
								elementMessageDiv.css("background-color", "#16a085");
										
								elementMessageDiv.css("display", "block");
									
								elementMessageLabel.text("Playlist "+name+" créee avec succès");
																	
								window.setTimeout(function() {
									elementMessageDiv.css("display", "none");
									$("#popupPlaylist").popup("close");
									reset_choices();
									blurAction(0, document.getElementById('fullPage'));
								}, 2500);
							}
						});
		}
		else
		{
			
			elementMessageDiv.css("background-color", "#e74c3c");
					
			elementMessageDiv.css("display", "block");
				
			//elementMessageLabel.text("Entrez un nom de playlist valide");
				
			elementMessageDiv.addClass("animated shake");
				
			window.setTimeout(function() {
				elementMessageDiv.css("display", "none");
			}, 2500);
		}

	}

});

});

function createChoiceEvent() {

$(".categories_genres").click(function() {

	var is_in_array = in_array($(this).data("title"),genres_choisis)
	console.log(is_in_array);
	
	if(!is_in_array[0] == true)
	{
		genres_choisis.push($(this).data("title"));
		$('#'+$(this).attr("id")+' div:last').before( $('<img class="checked_cat_genres '+$(this).attr("id")+'_checked" src="img/categories/valide.png">') );
		
		console.log(genres_choisis);
	}
	else
	{
		$('.'+$(this).attr("id")+'_checked').remove();
		genres_choisis.splice(is_in_array[1], 1);
	}
	
	afficher_bouton_creer(genres_choisis, artistes_choisis, albums_choisis, annees_choisis);
});

$(".categories_artistes").click(function() {

	var is_in_array = in_array($(this).data("title"),artistes_choisis)
	console.log(is_in_array);
	
	if(!is_in_array[0] == true)
	{
		artistes_choisis.push($(this).data("title"));
		$('#'+$(this).attr("id")+' div:last').before( $('<img class="checked_cat_artistes '+$(this).attr("id")+'_checked" src="img/categories/valide.png">') );
		
		console.log(artistes_choisis);
	}
	else
	{
		$('.'+$(this).attr("id")+'_checked').remove();
		artistes_choisis.splice(is_in_array[1], 1);
	}
	
	afficher_bouton_creer(genres_choisis, artistes_choisis, albums_choisis, annees_choisis);
});

$(".categories_albums").click(function() {

	var is_in_array = in_array($(this).data("title"),albums_choisis)
	console.log(is_in_array);
	
	if(!is_in_array[0] == true)
	{
		albums_choisis.push($(this).data("title"));
		$('#'+$(this).attr("id")+' div:last').before( $('<img class="checked_cat_albums '+$(this).attr("id")+'_checked" src="img/categories/valide.png">') );
		
		console.log(albums_choisis);
	}
	else
	{
		$('.'+$(this).attr("id")+'_checked').remove();
		albums_choisis.splice(is_in_array[1], 1);
	}
	
	afficher_bouton_creer(genres_choisis, artistes_choisis, albums_choisis, annees_choisis);
});

$(".categories_annees").click(function() {

	var is_in_array = in_array($(this).data("title"),annees_choisis)
	console.log(is_in_array);
	
	if(!is_in_array[0] == true)
	{
		annees_choisis.push($(this).data("title"));
		$('#'+$(this).attr("id")+' div:last').before( $('<img class="checked_cat_annees '+$(this).attr("id")+'_checked" src="img/categories/valide.png">') );
		
		console.log(annees_choisis);
	}
	else
	{
		$('.'+$(this).attr("id")+'_checked').remove();
		annees_choisis.splice(is_in_array[1], 1);
	}
	
	afficher_bouton_creer(genres_choisis, artistes_choisis, albums_choisis, annees_choisis);
});

};


function in_array(string, array){
    var result = [false,""];
    for(i=0; i<array.length; i++){
        if(array[i] == string){
            result[0] = true;
            result[1] = i;
        }
    }
    return result;
};

function sendChoices(genres, artists, annees, albums, playlist_name, callback) {

	genres = JSON.stringify(genres);
	artists = JSON.stringify(artists);
	annees = JSON.stringify(annees);
	albums = JSON.stringify(albums);
	
	$.ajax({
	  method: "POST",
	  url: "apis/playlist.php",
	  data: { playlist_name : playlist_name, genres: genres, artists: artists, annees: annees, albums: albums, pseudoPost: pseudo, passwordPost: passwordHash}
	})
	  .done(function( msg ) {
		callback( msg );
	  });
};

function reset_choices()
{
	genres_choisis = [];
	artistes_choisis = [];
	albums_choisis = [];
	annees_choisis = [];
	
	afficher_bouton_creer(genres_choisis, artistes_choisis, albums_choisis, annees_choisis);
};

function choice_back() {

	$("#animate_playlist").css("height","475px");
	$("#animate_playlist").css("width","587px");
	$("#set_playlist_name").css("display","none");
	$("#list_genres").css("display","none");
	$("#list_artistes").css("display","none");
	$("#list_annees").css("display","none");
	$("#list_albums").css("display","none");
	$("#choix").css("display","block");
	$("#backPlaylistChoice").css("display","none");
	$("#quitPlaylistButton").css("display","block");	
	
	afficher_bouton_creer(genres_choisis, artistes_choisis, albums_choisis, annees_choisis);
};

function afficher_bouton_creer(genres_choisis, artistes_choisis, albums_choisis, annees_choisis) {
	if(genres_choisis.length == 0 && artistes_choisis.length == 0 && albums_choisis.length == 0 && annees_choisis.length == 0){   
	   $("#create_playlist").css("display","none");
	} else {
	   $("#create_playlist").css("display","inline-block");
	}
};

function get_choices(type) {

	if(type == "albums") { if(albumsLoaded) { return;} }
	else if(type == "artistes") { if(artistesLoaded) { return;} }
	else if(type == "annees") 	{ if(anneesLoaded) { return;} }
	else if(type == "genres") 	{ if(genresLoaded) { return;} }
	else { return; }

	$.ajax({
		method: "POST",
		url: "apis/load_playlist_choices.php",
		data: { type: type}
	})
	.done(function( msg ) {
			
			console.log(msg);
			if(msg.status_code != 1)
			{
				console.log("UNE ERREUR EST SURVENUE");
				//GESTION DES ERREURS

				return false;
			}
			
			$("#list_"+type).mCustomScrollbar('destroy');
			$("#list_"+type).html("");		
			
			
	if(type == "genres") {
		for(var indiceGenre=0; indiceGenre < msg.genres.length; indiceGenre++) {
			
			$("#list_genres").append('<div id="'+escapeHtml(msg.genres[indiceGenre].idGENRES)+'_genrec" data-title="'+escapeHtml(msg.genres[indiceGenre].nom)+'" class="categories categories_genres cat_genres" style="background-image: url(\'img/covers_genres/'+escapeHtml(msg.genres[indiceGenre].image)+'\') !important;"><div class="genre_title">'+escapeHtml(msg.genres[indiceGenre].nom)+'</div></div>');
			
		}
	} else if (type == "albums") {
		
		for(var indiceAlbum=0; indiceAlbum < msg.albums.length; indiceAlbum++) {
		
			$("#list_albums").append('<div id="'+escapeHtml(msg.albums[indiceAlbum].idPISTES)+'_albumc" data-title="'+escapeHtml(msg.albums[indiceAlbum].album)+'" class="categories categories_albums cat_c_albums cat_albums" style="background-image: url(\'img/covers/'+escapeHtml(msg.coverAlbum[indiceAlbum].cover)+'\') !important;"><div class="album_title">'+escapeHtml(msg.albums[indiceAlbum].album)+'</div></div>');
		
		}
		
	} else if (type == "artistes") {

	for(var indiceArtiste=0; indiceArtiste < msg.artistes.length; indiceArtiste++) {
		
			get_artist_cover_choices(indiceArtiste,type,msg,msg.artistes.length);
			
		}
	} else {

		for(var indiceAnnee=0; indiceAnnee < msg.annees.length; indiceAnnee++) {
		
			$("#list_annees").append('<div id="'+escapeHtml(msg.annees[indiceAnnee].idPISTES)+'_anneesc" data-title="'+escapeHtml(msg.annees[indiceAnnee].date)+'" class="categories categories_annees cat_annees"><div class="genre_title">'+escapeHtml(msg.annees[indiceAnnee].date)+'</div></div>');
			
		}
	
	}
	
	if(type != "artistes") {
			$("#list_"+type).mCustomScrollbar({
				theme:"minimal"
			});
			
			createChoiceEvent();
	}
				
			if(type == "albums") { albumsLoaded = true; }
			else if(type == "artistes") 	{ artistesLoaded = true}
			else if(type == "annees") 	{ anneesLoaded = true }
			else if(type == "genres") 	{ genresLoaded = true }
			else { return; }
		});
};

function get_artist_cover_choices(indiceArtiste,type,msg,maxPiste) {

	$.ajax({
		type: 'GET',
		url: "https://api.deezer.com/search?q="+msg.artistes[indiceArtiste].artist+"&limit=1&output=jsonp",
		dataType: 'jsonp',
		cache: true,
		contentType: "application/json; charset=utf-8"
		}).done(function(data) {
			$("#list_artistes").append('<div id="'+escapeHtml(msg.artistes[indiceArtiste].idPISTES)+'_artistc" data-title="'+escapeHtml(msg.artistes[indiceArtiste].artist)+'" class="categories categories_artistes cat_c_artistes cat_artistes" style="background-image: url(\''+data.data[0].artist.picture_medium+'\') !important;"><div class="artist_title">'+escapeHtml(msg.artistes[indiceArtiste].artist)+'</div></div>');

			
			if(indiceArtiste == --maxPiste) {

			$("#list_"+type).mCustomScrollbar({
				theme:"minimal"
			});
			
			createChoiceEvent();

				//$("#into_"+type).css("display","block");

			//	$('body').removeClass('ui-loading');
			//	artistes_loaded = true;
			}
		});

}