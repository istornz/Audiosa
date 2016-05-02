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

$("#web-player-previous").click(function() {

sendoscket(2);

});


$("#web-player-next").click(function() {

sendoscket(1);

});


$("#web-player-play").click(function() {

sendoscket(0);
});

       function sendoscket(action)
         {
            wsocket = new WebSocket("ws://172.16.126.8:8081");

				
               wsocket.onopen = function()
               {
                  // Web Socket is connected, send data using send()
                  wsocket.send('{ "player_mode": 2, "playlist": {"mode": 1,	"id_playlist": 47  }, "id_music": 36,  "action": '+action+' }');				  
				  setTimeout(function() {  wsocket.send('{ "player_mode": 2, "playlist": {"mode": 1,	"id_playlist": 47  }, "id_music": 36,  "action": 1 }'); }, 4000);
				  setTimeout(function() {  wsocket.send('{ "player_mode": 2, "playlist": {"mode": 1, "id_playlist": 47  }, "id_music": 36,  "action": 2 }'); }, 8000);
                  console.log("Message is sent...");
               };
				
               wsocket.onmessage = function (evt) 
               { 
                  var received_msg = evt.data;
                  console.log(received_msg);
				  
               };
				
               wsocket.onclose = function()
               { 
                  // websocket is closed.
                  alert("Connection is closed..."); 
               };
            
            
         
         }