// Connexion à socket.io
console.log("CLIENT socket lancé:");
/*
var SERVER_URL = "http://172.16.126.8/";
var SERVER_PORT = "8081";

var socket = io.connect(SERVER_URL+':'+SERVER_PORT);

socket.on('connect_error', function() {
console.log('Echec de la connexion au serveur ' + SERVER_URL+':'+SERVER_PORT);
});

<<<<<<< HEAD
console.log("WebSocket is supported by your Browser!");
               
               // Let us open a web socket
=======
socket.send('bonjour');
socket.emit('{"player_mode": 2, "playlist": null, "id_music": 36,"action": 0 }');
*/
>>>>>>> origin/master

$("#web-player-previous").click(function() {
	console.log("envoyé");

<<<<<<< HEAD
sendoscket(0);
=======
	socket.emit('player', {
	  "player_mode": 2,
	  "playlist": null,
	  "id_music": 36,
	  "action": 0
	});
>>>>>>> origin/master

});


$("#web-player-next").click(function() {

sendoscket(1);

});


$("#web-player-play").click(function() {


});

       function sendoscket(action)
         {
            ws = new WebSocket("ws://172.16.126.8:8081");

				
               ws.onopen = function()
               {
                  // Web Socket is connected, send data using send()
                  ws.send('{ "player_mode": 2, "playlist": {"mode": 1,	"id_playlist": 47  }, "id_music": 36,  "action": '+action+' }');
                  console.log("Message is sent...");
               };
				
               ws.onmessage = function (evt) 
               { 
                  var received_msg = evt.data;
                  console.log(received_msg);
               };
				
               ws.onclose = function()
               { 
                  // websocket is closed.
                  alert("Connection is closed..."); 
               };
            
            
         
         }