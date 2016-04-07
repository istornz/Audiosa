genres_choisis = [];
artistes_choisis = [];
albums_choisis = [];
annees_choisis = [];


$(document).ready(function()		
{
$(".categories_genres").click(function() {

	var is_in_array = in_array($(this).attr("id"),genres_choisis)
	console.log(is_in_array);
	
	if(!is_in_array[0] == true)
	{
		genres_choisis.push($(this).attr("id"));
		$('#'+$(this).attr("id")+' div:last').before( $('<img class="checked_cat_genres '+$(this).attr("id")+'_checked" src="img/categories/valide.png">') );
		
		console.log(genres_choisis);
	}
	else
	{
		$('.'+$(this).attr("id")+'_checked').remove();
		genres_choisis.splice(is_in_array[1], 1);
	}
	
	afficher_bouton_creer(genres_choisis, artistes_choisis, albums_choisis, annees_choisis)
});

$(".categories_artistes").click(function() {

	var is_in_array = in_array($(this).attr("id"),artistes_choisis)
	console.log(is_in_array);
	
	if(!is_in_array[0] == true)
	{
		artistes_choisis.push($(this).attr("id"));
		$('#'+$(this).attr("id")+' div:last').before( $('<img class="checked_cat_artistes '+$(this).attr("id")+'_checked" src="img/categories/valide.png">') );
		
		console.log(artistes_choisis);
	}
	else
	{
		$('.'+$(this).attr("id")+'_checked').remove();
		artistes_choisis.splice(is_in_array[1], 1);
	}
	
	afficher_bouton_creer(genres_choisis, artistes_choisis, albums_choisis, annees_choisis)
});

$(".categories_albums").click(function() {

	var is_in_array = in_array($(this).attr("id"),albums_choisis)
	console.log(is_in_array);
	
	if(!is_in_array[0] == true)
	{
		albums_choisis.push($(this).attr("id"));
		$('#'+$(this).attr("id")+' div:last').before( $('<img class="checked_cat_albums '+$(this).attr("id")+'_checked" src="img/categories/valide.png">') );
		
		console.log(albums_choisis);
	}
	else
	{
		$('.'+$(this).attr("id")+'_checked').remove();
		albums_choisis.splice(is_in_array[1], 1);
	}
	
	afficher_bouton_creer(genres_choisis, artistes_choisis, albums_choisis, annees_choisis)
});

$(".categories_annees").click(function() {

	var is_in_array = in_array($(this).attr("id"),annees_choisis)
	console.log(is_in_array);
	
	if(!is_in_array[0] == true)
	{
		annees_choisis.push($(this).attr("id"));
		$('#'+$(this).attr("id")+' div:last').before( $('<img class="checked_cat_annees '+$(this).attr("id")+'_checked" src="img/categories/valide.png">') );
		
		console.log(annees_choisis);
	}
	else
	{
		$('.'+$(this).attr("id")+'_checked').remove();
		annees_choisis.splice(is_in_array[1], 1);
	}
	
	afficher_bouton_creer(genres_choisis, artistes_choisis, albums_choisis, annees_choisis)
});

$(".choice_click").click(function() {
	$("#quitPlaylistButton").css("display","none");
	$("#backPlaylistChoice").css("display","block");
});

$("#backPlaylistChoice").click(function() {
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
	
	afficher_bouton_creer(genres_choisis, artistes_choisis, albums_choisis, annees_choisis)
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
	
	$("#animate_playlist").css("height","240px");
	$("#animate_playlist").css("width","350px");


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
							
							//	console.log(rep);
						
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

function setMessage(div, type, msg, timeout) {

	$("#"+div).css("visibility","visible");

	if(type == "error") {
		type = "style='color: red;'";
	} else { type = ""; }
	
	$("#"+div).html( "<p "+type+">"+msg+"</p>" );
	
	if(timeout != 0) {
		setTimeout(function() { 
			$("#"+div).css("visibility","hidden");
		}, timeout);
	}
}

function in_array(string, array){
    var result = [false,""];
    for(i=0; i<array.length; i++){
        if(array[i] == string){
            result[0] = true;
            result[1] = i;
        }
    }
    return result;
}

function sendChoices(genres, artists, annees, albums, playlist_name, callback) {

	genres = JSON.stringify(genres);
	artists = JSON.stringify(artists);
	annees = JSON.stringify(annees);
	albums = JSON.stringify(albums);
	playlist_name = JSON.stringify(playlist_name);
	
	$.ajax({
	  method: "POST",
	  url: "apis/playlist.php",
	  data: { playlist_name : playlist_name, genres: genres, artists: artists, annees: annees, albums: albums, pseudoPost: pseudo, passwordPost: passwordHash}
	})
	  .done(function( msg ) {
		callback( msg );
	  });
}

function afficher_bouton_creer(genres_choisis, artistes_choisis, albums_choisis, annees_choisis) {
	if(genres_choisis.length == 0 && artistes_choisis.length == 0 && albums_choisis.length == 0 && annees_choisis.length == 0){   
	   $("#create_playlist").css("display","none");
	}else{
	   $("#create_playlist").css("display","inline-block");
	}
}