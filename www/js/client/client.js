// Connexion à socket.io
console.log("CLIENT socket lancé:");

var SERVER_URL = "http://localhost";
var SERVER_PORT = "8080";

var socket = io.connect(SERVER_URL+':'+SERVER_PORT);

socket.on('connect_error', function() {
    console.log('Echec de la connexion au serveur ' + SERVER_URL+':'+SERVER_PORT);
});

$("#web-player-previous").click(function() {

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