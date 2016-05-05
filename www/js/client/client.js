// Connexion à socket.io
console.log("CLIENT socket lancé:");

isPlayed			= false;
isPaused			= false;
emplacement 		= 2; //0: pistes; 1: album; 2: playlist
emplacement_name 	= "14"; //Nom album ou idPlaylist
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

$("#web-player-previous").click(function() {
	
	wsocket.send('{"id_music": '+idMusic+',"action": 4,"player_mode": '+mode_player+',"volume_rate": '+ volumeRate +',"emplacement_mode": '+emplacement+',"emplacement_name": "'+emplacement_name+'"}');				  

});


$("#web-player-next").click(function() {

	wsocket.send('{"id_music": '+idMusic+',"action": 3,"player_mode": '+mode_player+',"volume_rate": '+ volumeRate +',"emplacement_mode": '+emplacement+',"emplacement_name": "'+emplacement_name+'"}');					  

});

$("#web-player-shuffle").click(function() {

	if(mode_player == 0)
		mode_player = 1;
	else
		mode_player = 0;

});

$("#web-player-play").click(function() {
	
	if(isPlayed)
	{
		if(isPaused)
		{
			isPaused = false;
			wsocket.send('{"id_music": '+idMusic+',"action": 2,"player_mode": '+mode_player+',"volume_rate": '+ volumeRate +',"emplacement_mode": '+emplacement+',"emplacement_name": "'+emplacement_name+'"}');					  
		}
		else
		{
			isPaused = true;
			wsocket.send('{"id_music": '+idMusic+',"action": 1,"player_mode": '+mode_player+',"volume_rate": '+ volumeRate +',"emplacement_mode": '+emplacement+',"emplacement_name": "'+emplacement_name+'"}');				  
		}
	}
	else
	{
		isPlayed = true;
		wsocket.send('{"id_music": '+idMusic+',"action": 0,"player_mode": '+mode_player+',"volume_rate": '+ volumeRate +',"emplacement_mode": '+emplacement+',"emplacement_name": "'+emplacement_name+'"}');		  
	}
		
});