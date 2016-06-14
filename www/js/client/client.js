/*
    Rayane MOHAMED BEN-ALI
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audio Windows 2016 - Audiosa
    
	Fichier: client.js
	Description: Client JS permettant la communication avec le serveur
*/

console.log("CLIENT socket lancé:");

synchroClient		= 0;
synchroClientTime	= 0;
isPlayed			= false;
isPaused			= false;
emplacement 		= 2; //0: pistes; 1: album; 2: playlist
emplacement_name 	= "14"; //	Nom album ou idPlaylist
idMusic				= 53;
volumeRate 			= 0.5;
percentPiste		= 0;
posiLocale			= 0;
PosiEntiere 		= 0;
posiactuelle		= 0;
posisarce			= 0;
posiactuellels		= 0;
PosiEntiereSecondeChange	=0;

wsocket = new WebSocket("ws://172.16.126.170:8081");	
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
		
		posiLocale = jsonCallback.player_status.position;

		var piste = ListeMusiques.pistes[idListeMusiques];
		percentPiste = ((jsonCallback.player_status.position / 1000) * 100) / piste.duree ;
		posiactuelle = percentPiste;

		//$($(".ui-slider-handle")[1]).css("left",percentPiste); //Synchro media player
		
		duree = piste.duree,
		positionRecu = (jsonCallback.player_status.position / 1000);
			
	//	difference = duree - positionRecu;
				
		// Minutes and seconds
	//	var mins = ~~(difference / 60);
	//	var secs = ~~(difference % 60);

		$("#mediaPlayerTitle").html(escapeHtml(piste.title));
		$("#mediaPlayerArtist").html(escapeHtml(piste.artist));
	//	$("#mediaPlayerDuree").html(mins+":"+secs);
		$("#web-player-img").attr("src","img/covers/"+piste.cover);
		$("#web-player").css("background-image","url('img/covers/"+piste.cover+"')");
		}
    } catch (e) {
	  //  console.log(e);
        return false;
    }
    
  //  console.log(idMusic);
};

wsocket.onclose = function()
{ 
	console.log("Connection is closed..."); 
};

//previous 4
$("#web-player-previous").click(function() {
	setPistePosition();
	actionPlayer(wsocket, idMusic, 4, volumeRate, emplacement, emplacement_name);
	
});

//next 3
$("#web-player-next").click(function() {
	setPistePosition();
	actionPlayer(wsocket, idMusic, 3, volumeRate, emplacement, emplacement_name);

});


// Demarrer 0; pause 1 //sortir pause 2
$("#web-player-play").click(function() {
	
	if(isPlayed)
	{
		if(isPaused)
		{
			isPaused = false;
			actionPlayer(wsocket, idMusic, 2, volumeRate, emplacement, emplacement_name);
		}
		else
		{
			isPaused = true;
			actionPlayer(wsocket, idMusic, 1, volumeRate, emplacement, emplacement_name);
		}
	}
	else
	{
		isPlayed = true;
		isPaused = false;
		actionPlayer(wsocket, idMusic, 0, volumeRate, emplacement, emplacement_name);
	}
		
});

/*
emplacement 		= 2; //0: pistes; 1: album; 2: playlist
emplacement_name 	= "14"; //Nom album ou idPlaylist
idMusic				= 53;
volumeRate 			= 1;
*/
function actionPlayer(wsocket, idMusic, action, volumeRate, emplacement, emplacement_name) {

 if(action == 0) { //Musique lancée
	setPistePosition();
	sync();
	$("#web-player-play").attr("src","img/player/pause.png");
	isPlayed			= true;
	isPaused 			= false;
 } else if (action == 1) { //Musique en pause
	$("#web-player-play").attr("src","img/player/play.png");
	isPaused			= true;
 } else if (action == 2) { //Musique relancée
	$("#web-player-play").attr("src","img/player/pause.png");
	isPaused			= false;
 }
 
 //console.log('{"id_music": '+idMusic+',"action": '+action+',"volume_rate": '+ volumeRate +',"emplacement_mode": '+emplacement+',"emplacement_name": "'+emplacement_name+'"}');   

 wsocket.send('{"id_music": '+idMusic+',"action": '+action+',"volume_rate": '+ volumeRate +',"emplacement_mode": '+emplacement+',"emplacement_name": "'+emplacement_name+'"}');    
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

function sync()
{
	synchroClient = setInterval(function() {
		if(isPaused === false && isPlayed === true)	{
			
			if(posiactuelle > 100)
					posiactuelle = 100;
			
			posiactuelle += ((500/PosiEntiere)*100);
			//console.log("Position actuelle: "+posiactuelle);
			
			$($(".ui-slider-handle")[1]).css("left",posiactuelle+"%");
		}
	}, 500);

	synchroClientTime = setInterval(function() {
		if(isPaused === false && isPlayed === true)	{
			
			PosiEntiereSecondeChange -= 1;
			
			// Minutes and seconds
			var mins = ~~(PosiEntiereSecondeChange / 60);
			var secs = ~~(PosiEntiereSecondeChange % 60);

		//	console.log(mins+":"+secs);

			if(secs < 10) {
				secs = "0"+secs;
			}
			
			$("#mediaPlayerDuree").html(mins+":"+secs);
	}
	}, 1000);
}

function setPistePosition()
{
	 if(checkMusic(idMusic, ListeMusiques.pistes)[0]) {
			var idListeMusiques = checkMusic(idMusic, ListeMusiques.pistes)[1];
			
			var piste = ListeMusiques.pistes[idListeMusiques];
 			PosiEntiereSecondeChange = piste.duree;
			console.log("ok");
 }
}