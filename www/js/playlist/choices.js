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
});

$(".choice_click").click(function() {
	$("#quitPlaylistButton").css("display","none");
	$("#backPlaylistChoice").css("display","block");
});

$("#backPlaylistChoice").click(function() {
	$("#list_genres").css("display","none");
	$("#list_artistes").css("display","none");
	$("#list_annees").css("display","none");
	$("#list_albums").css("display","none");
	$("#choix").css("display","block");
	$("#backPlaylistChoice").css("display","none");
	$("#quitPlaylistButton").css("display","block");
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

});

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

function sendChoices(genres, artists, annees, albums) {

	genres = JSON.stringify(genres);
	artists = JSON.stringify(artists);
	annees = JSON.stringify(annees);
	albums = JSON.stringify(albums);
	
	$.ajax({
	  method: "POST",
	  url: "apis/playlist.php",
	  data: { genres: genres, artists: artists, annees: annees, albums: albums, pseudoPost: pseudo, passwordPost: passwordHash}
	})
	  .done(function( msg ) {
		console.log(msg);
	  });
}