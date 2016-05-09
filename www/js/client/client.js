// Connexion à socket.io
console.log("CLIENT socket lancé:");

isPlayed			= false;
isPaused			= false;
emplacement 		= 2; //0: pistes; 1: album; 2: playlist
emplacement_name 	= "14"; //	Nom album ou idPlaylist
idMusic				= 53;
volumeRate 			= 1;
mode_player 		= 0; //Lecture a la suite, 1 pour alea

wsocket = new WebSocket("ws://192.168.1.15:8081");	
wsocket.onopen = function()
{
	console.log("Connected !");
};

wsocket.onmessage = function (evt) 
{
	var received_msg = evt.data;
	console.log(received_msg);
	
	try {
        var jsonCallback = JSON.parse(received_msg);
        idMusic = jsonCallback.id_music_played;
		
		if(checkMusic(idMusic, ListeMusiques.pistes)[0]) {
			idListeMusiques = checkMusic(idMusic, ListeMusiques.pistes)[1];
			console.log(idListeMusiques);
		
		var piste = ListeMusiques.pistes[idListeMusiques];
		var minutes = Math.floor(piste.duree / 60);
		var seconds = piste.duree - minutes * 60;

		var finalTime = str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
		
		$("#mediaPlayerTitle").html(escapeHtml(piste.title));
		$("#mediaPlayerArtist").html(escapeHtml(piste.artist));
		$("#mediaPlayerDuree").html(finalTime);
		$("#web-player-img").attr("src","img/covers/"+piste.cover);
		$("#web-player").css("background-image","url('img/covers/"+piste.cover+"')");
		}
    } catch (e) {
	    console.log(e);
        return false;
    }
    
    console.log(idMusic);
};

wsocket.onclose = function()
{ 
	console.log("Connection is closed..."); 
};

//previous 4
$("#web-player-previous").click(function() {
	
	actionPlayer(wsocket, idMusic, 4, mode_player, volumeRate, emplacement, emplacement_name);

});

//next 3
$("#web-player-next").click(function() {

	actionPlayer(wsocket, idMusic, 3, mode_player, volumeRate, emplacement, emplacement_name);

});

$("#web-player-shuffle").click(function() {

	if(mode_player == 0)
		mode_player = 1;
	else
		mode_player = 0;

});


// emarrer 0; pause 1 //sortir pause 2
$("#web-player-play").click(function() {
	
	if(isPlayed)
	{
		if(isPaused)
		{
			isPaused = false;
			actionPlayer(wsocket, idMusic, 2, mode_player, volumeRate, emplacement, emplacement_name);
		}
		else
		{
			isPaused = true;
			actionPlayer(wsocket, idMusic, 1, mode_player, volumeRate, emplacement, emplacement_name);
		}
	}
	else
	{
		isPlayed = true;
		actionPlayer(wsocket, idMusic, 0, mode_player, volumeRate, emplacement, emplacement_name);
	}
		
});

/*
emplacement 		= 2; //0: pistes; 1: album; 2: playlist
emplacement_name 	= "14"; //Nom album ou idPlaylist
idMusic				= 53;
volumeRate 			= 1;
mode_player 		= 0; //Lecture a la suite, 1 pour alea
*/
function actionPlayer(wsocket, idMusic, action, mode_player, volumeRate, emplacement, emplacement_name) {
 if(action == 0) { //Musique lancée
	$("#web-player-play").attr("src","img/player/play.png");
 } else if (action == 1) { //Musique en pause
	$("#web-player-play").attr("src","img/player/pause.png");
 } else if (action == 2) { //Musique relancée
	$("#web-player-play").attr("src","img/player/play.png");
 }
 
 wsocket.send('{"id_music": '+idMusic+',"action": '+action+',"player_mode": '+mode_player+',"volume_rate": '+ volumeRate +',"emplacement_mode": '+emplacement+',"emplacement_name": "'+emplacement_name+'"}');    
}

function checkMusic(idMusic, array){
    var result = [false,""];
    for(i=0; i<array.length; i++){
        if(array[i]["idPISTES"] == idMusic){
            result[0] = true;
            result[1] = i;
        }
    }
    return result;
}