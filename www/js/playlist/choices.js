genres_choisis = [];


$(document).ready(function()		
{
$(".categories_genres").click(function() {

	var is_in_array = in_array($(this).attr("id"),genres_choisis)
	console.log(is_in_array);
	
	if(!is_in_array[0] == true)
	{
		genres_choisis.push($(this).attr("id"));
		$('#'+$(this).attr("id")+' div:last').before( $('<img class="checked_cat" src="img/categories/valide.png">') );
		
		console.log(genres_choisis);
	}
	else
	{
		console.log("cc");
	//	array.splice(i, 1);
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