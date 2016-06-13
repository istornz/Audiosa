function delete_playlist()
{
	var idplaylist = $("#popupPlaylistName").data("idp");
	
	console.log(idplaylist);
	
	$.ajax({
		statusCode: {
		200: function( msg ) {
			console.log("cc");
		//	$('#supprPlaylist').popup('close');
			window.location.replace("/");
		}
	   },
		method: "POST",
		url: "apis/playlist.php",
		data: { pseudoPost: pseudo, passwordPost: passwordHash , delete_playlist: idplaylist }
	});
}