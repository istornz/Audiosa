// Connexion à socket.io
console.log("CLIENT socket lancé:");
/*
var SERVER_URL = "http://172.16.126.8/";
var SERVER_PORT = "8081";

var socket = io.connect(SERVER_URL+':'+SERVER_PORT);

socket.on('connect_error', function() {
console.log('Echec de la connexion au serveur ' + SERVER_URL+':'+SERVER_PORT);
});

socket.send('bonjour');
socket.emit('{"player_mode": 2, "playlist": null, "id_music": 36,"action": 0 }');
*/

$("#web-player-previous").click(function() {
	console.log("envoyé");

	socket.emit('player', {
	  "player_mode": 2,
	  "playlist": null,
	  "id_music": 36,
	  "action": 0
	});

});


$("#web-player-next").click(function() {

	socket.emit('player', {
	  "player_mode": 2,
	  "playlist": {
		"mode": 1,
		"id_playlist": 47
	  },
	  "id_music": 36,
	  "action": 0
	});

});


$("#web-player-play").click(function() {

	socket.emit('player', {
	  "player_mode": 2,
	  "playlist": {
		"mode": 1,
		"id_playlist": 47
	  },
	  "id_music": 36,
	  "action": 0
	});

});

       function sendoscket()
         {
            if ("WebSocket" in window)
            {
               alert("WebSocket is supported by your Browser!");
               
               // Let us open a web socket
               var ws = new WebSocket("ws://172.16.126.17:8081");
				
               ws.onopen = function()
               {
                  // Web Socket is connected, send data using send()
                  ws.send("Message to send");
                  alert("Message is sent...");
               };
				
               ws.onmessage = function (evt) 
               { 
                  var received_msg = evt.data;
                  alert("Message is received...");
               };
				
               ws.onclose = function()
               { 
                  // websocket is closed.
                  alert("Connection is closed..."); 
               };
            }
            
            else
            {
               // The browser doesn't support WebSocket
               alert("WebSocket NOT supported by your Browser!");
            }
         }