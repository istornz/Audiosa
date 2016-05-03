// Connexion à socket.io
console.log("CLIENT socket lancé:");

isPlayed	= false;
isPaused	= false;
emplacement = 0; //0: pistes; 1: album; 2: playlist
idMusic		= 10;
volumeRate 	= 0.5;
mode_player = 0 //Lecture a la suite, 1 pour alea

wsocket = new WebSocket("ws://172.16.126.10:8081");	
wsocket.onopen = function()
{
	console.log("Connected !");
};

wsocket.onmessage = function (evt) 
{ 
	var received_msg = evt.data;
	//var JSON = JSON.parse(received_msg);
	console.log(received_msg);
};

wsocket.onclose = function()
{ 
	console.log("Connection is closed..."); 
};

$("#web-player-previous").click(function() {
	
	wsocket.send('{ "player_mode": '+mode_player+', "playlist": {"mode": 1,	"id_playlist": 47  }, "id_music": '+idMusic+',  "action": 4, "volume_rate": '+ volumeRate +', "emplacement": '+emplacement+' }');				  

});


$("#web-player-next").click(function() {

	wsocket.send('{ "player_mode": '+mode_player+', "playlist": {"mode": 1,	"id_playlist": 47  }, "id_music": '+idMusic+',  "action": 3, "volume_rate": '+ volumeRate +', "emplacement": '+emplacement+' }');				  

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
			wsocket.send('{ "player_mode": '+mode_player+', "playlist": {"mode": 1,	"id_playlist": 47  }, "id_music": '+idMusic+',  "action": 2, "volume_rate": '+ volumeRate +', "emplacement": '+emplacement+' }');				  
		}
		else
		{
			isPaused = true;
			wsocket.send('{ "player_mode": '+mode_player+', "playlist": {"mode": 1,	"id_playlist": 47  }, "id_music": '+idMusic+',  "action": 1, "volume_rate": '+ volumeRate +', "emplacement": '+emplacement+' }');				  
		}
	}
	else
	{
		isPlayed = true;
		wsocket.send('{ "player_mode": '+mode_player+', "playlist": {"mode": 1,	"id_playlist": 47  }, "id_music": '+idMusic+',  "action": 0, "volume_rate": '+ volumeRate +', "emplacement": '+emplacement+' }');				  
	}
		
});