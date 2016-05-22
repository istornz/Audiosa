<?php

/*
    Dimitri DESSUS
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audio Windows 2016 - Audiosa
    
	Fichier: retrievedata.php
	Description: API permettant de récupérer les musiques stockées dans la base de données
*/

// Spécification de l'en-tête HTTP en JSON
header('Content-Type: application/json');
// Importation des variables et fonctions globales
require("global_fonction.php");

/************************/
//		Variables		//
/************************/

// Vérification de l'argument "argPost"
if(!isset($_POST['argPost']))
{
	// L'argument n'est pas défini
	write_error_to_log("API Récupération données","Paramètre manquant, 'argPost' n'est pas renseigné");
	die('{"status_code":0,"error_description":"undeclared variable"}');
}

/************************/
//		   MYSQL		//
/************************/

try
{
	// Connexion à la base de données avec l'utilisateur "db_reader_music"
    $connexion = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME", $DB_READER_MUSIC_LOGIN, $DB_READER_MUSIC_PSW);
}
catch(PDOException $e)
{
	// Une erreur est survenue lors de la connexion à la base de données
	write_error_to_log("API Récupération données","Connexion à la base de données impossible : " . $e->getMessage());
	die('{"status_code":0, "error_description":"connection to database failed"}');
}

/************************/
//		   JSON			//
/************************/

// Test de la valeur de "argPost", en fonction de la valeur
// une fonction précise sera alors executée
if($_POST['argPost'] == "morceaux")
	retrieveMorceaux($connexion);
else if($_POST['argPost'] == "artistes")
	retrieveArtistes($connexion);
else if($_POST['argPost'] == "albums")
	retrieveAlbums($connexion);
else if($_POST['argPost'] == "playlists")
	retrievePlaylists($connexion);
else
	die('{"status_code":0, "error_description":"invalid parameter"}');

// Fonction permettant de récupérer la liste de toutes les musiques
function retrieveMorceaux($connexion)
{
	// Création de la commande SQL
	$commande_SQL	= "SELECT * FROM `pistes` JOIN genres ON genres.idGENRES = pistes.genre ORDER BY title ASC;";
	
	// Récupération et formattage de la date
	$date = getdate();
	$dateStr = $date['mday'] . "/" . $date['mon'] . "/" . $date['year'];
	
	// Démarrage de l'affichage en JSON
	echo '{"status_code":1, "fetched_at": "'. $dateStr .'","pistes": ';
	
	// Execution de la commande SQL
	if($selectStatement = $connexion->query($commande_SQL))
	{
		// Calcul du nombre de ligne
		$increLigne = 0;
		$nbrLigne = $selectStatement->rowCount();
		
		// Assignation de chaque ligne
		while($ligne = $selectStatement->fetch(PDO::FETCH_ASSOC))
		{
			// Calcul du nombre de colonne
			$nbrColonne = $selectStatement->columnCount();
			
			// Application de la fonction "utf8_encode()" pour chaque élément du tableau "$ligne"
			// utf8_encode() permet de convertir une chaine de caractère en UTF-8
			$convertToUTF8Format[] = array_map("utf8_encode", $ligne);
			
			// Incrémentation du nombre de ligne
			$increLigne++;
		}
		
		// Affichage du tableau "$convertToUTF8Format" au format JSON
		echo json_encode($convertToUTF8Format);
		echo "}";
	}
	else
	{
		// Une erreur est survenue lors de l'execution de la commande SQL
		$errorInfoArray = $connexion->errorInfo();
		write_error_to_log("API Récupération données","Impossible d'exécuter la commande SQL (selection morceaux) : " . $errorInfoArray[2]);
		die('{"status_code":0,"error_description":"failed to execute select query"}');
	}
}

// Fonction permettant de récupérer la liste de tous les artistes
function retrieveArtistes($connexion)
{
	// Création de la commande SQL
	$commande_SQL		= "SELECT * FROM pistes ORDER BY artist ASC";
	$tableauArtistes 	= array();
	
	// Récupération et formattage de la date
	$date 				= getdate();
	$dateStr 			= $date['mday'] . "/" . $date['mon'] . "/" . $date['year'];
	$increLigne 		= 0;
	
	// Démarrage de l'affichage en JSON
	echo '{"status_code":1, "fetched_at": "'. $dateStr .'","artistes": [';
	
	// Execution de la commande SQL
	if($selectStatement = $connexion->query($commande_SQL))
	{
		// Calcul du nombre de ligne
		$nbrLigne = $selectStatement->rowCount();
		
		// Assignation de chaque ligne
		while($ligne = $selectStatement->fetch(PDO::FETCH_ASSOC))
		{
			// On vérifie si le tableau "$tableauArtistes" contient l'artiste de cet enregistrement
			if (!in_array($ligne['artist'], $tableauArtistes))
			{
				// L'artiste n'existe pas dans le tableau,
				// on va l'ajouter
				$tableauArtistes[] = $ligne['artist'];
			}
		}
		
		// Calcul du nombre d'élement du tableau "$tableauArtistes", 
		// soit le nombre d'artiste
		$nbrArtiste = count($tableauArtistes);
		
		if($nbrArtiste == 0)
		{
			// Aucun artiste n'est présent dans le tableau "$tableauArtistes"
			die('{"status_code":0,"error_description":"no artist"}');
		}
		
		// Pour chaque artiste
		for($i = 0; $i < $nbrArtiste; $i++)
		{
			// Execution de la fonction getAlbumsForArtist(),
			// cette fonction retourne un tableau contenant les albums de l'artiste
			$albums 	= getAlbumsForArtist($connexion, $tableauArtistes[$i]);
			
			// Affichage en JSON de la réponse
			echo "{";
				echo '"artist_name": "' . utf8_encode($tableauArtistes[$i])  . '",'; // Encodage en UTF-8 du nom de l'artiste
				echo '"albums": ' . json_encode($albums)  . ','; // Affichage du tableau "$albums" au format JSON 
				echo '"items_count": ' . count($albums); // Affichage du nombre d'albums pour cet artiste
			
			if($increLigne == ($nbrArtiste - 1 )) // Avant dernier élement du tableau
				echo "}"; // Fin de l'affichage JSON
			else
				echo "},";
			
			// Incrémentation du nombre de ligne
			$increLigne++;
		}
		
		echo "]}";
	}
	else
	{
		// Une erreur est survenue lors de l'execution de la commande SQL
		$errorInfoArray = $connexion->errorInfo();
		write_error_to_log("API Récupération données","Impossible d'exécuter la commande SQL (selection artistes) : " . $errorInfoArray[2]);
	}
}

// Fonction permettant de retourner un tableau contenant les albums d'un artiste en particulier
function getAlbumsForArtist($connexion, $artistName)
{
	// Protection de la chaîne (pour éviter les attaques SQL)
	$artistName 	= $connexion->quote($artistName);
	
	// Création de la commande SQL
	$commande_SQL	= "SELECT DISTINCT album FROM pistes WHERE artist=". $artistName ." ORDER BY album ASC";
	$tableauAlbums 	= array();
	$tableauTracks 	= array();
	$nbrAlbums 		= 0;
	
	// Execution de la commande SQL
	if($selectStatement = $connexion->query($commande_SQL))
	{
		// Calcul du nombre de ligne
		$nbrLigne = $selectStatement->rowCount();
		
		// Assignation de chaque ligne
		while($ligne = $selectStatement->fetch(PDO::FETCH_ASSOC))
		{
			// Execution de la fonction getTrackForAlbum(),
			// cette fonction retourne un tableau contenant les morceaux d'un album
			$tracks = getTrackForAlbum($connexion, $ligne['album']);
			
			// On vérifie si le tableau "$tableauAlbums" contient l'album de cet enregistrement
			if (!in_array($ligne['album'], $tableauAlbums))
			{
				// L'album n'existe pas dans le tableau,
				// on va l'ajouter sous forme de tableau
				$tableauAlbums[]	= array('album_name' => utf8_encode($ligne['album']), // Le nom de l'album (au format UTF-8)
											'tracks' => $tracks, // Le tableau des morceaux de l'album
											'items_count' => count($tracks)); // Le nombre de morceau de l'album
			}
		}
		
	}
	else
	{
		// Une erreur est survenue lors de l'execution de la commande SQL
		$errorInfoArray = $connexion->errorInfo();
		write_error_to_log("API Récupération données","Impossible d'exécuter la commande SQL (récupération du nombre de pistes pour chaque artistes) : " . $errorInfoArray[2]);
	}
	
	return $tableauAlbums;
}

// Fonction permettant de récupérer la liste de tous les albums
function retrieveAlbums($connexion)
{
	// Création de la commande SQL
	$commande_SQL		= "SELECT album FROM pistes ORDER BY album ASC";
	$tableauAlbums 		= array();
	
	// Récupération et formattage de la date
	$date 				= getdate();
	$dateStr 			= $date['mday'] . "/" . $date['mon'] . "/" . $date['year'];
	$increLigne 		= 0;
	
	// Execution de la commande SQL
	if($selectStatement = $connexion->query($commande_SQL))
	{
		// Calcul du nombre de ligne
		$nbrLigne = $selectStatement->rowCount();
		
		// Assignation de chaque ligne
		while($ligne = $selectStatement->fetch(PDO::FETCH_ASSOC))
		{
			// On vérifie si le tableau "$tableauAlbums" contient l'album de cet enregistrement
			if (!in_array($ligne['album'], $tableauAlbums))
			{
				// L'album n'existe pas dans le tableau,
				// on va l'ajouter
				$tableauAlbums[] = $ligne['album'];
			}
		}
		
		// Calcul du nombre d'élement du tableau "$tableauAlbums", 
		// soit le nombre d'album
		$nbrAlbum = count($tableauAlbums);
		
		if($nbrAlbum == 0)
		{
			// Aucun album n'est présent dans le tableau "$nbrAlbum"
			die('{"status_code":0,"error_description":"no album"}');
		}
		
		// Démarrage de l'affichage JSON
		echo '{"status_code":1, "fetched_at": "'. $dateStr .'","albums": [';
		
		// Pour chaque album
		for($i = 0; $i < $nbrAlbum; $i++)
		{
			// Execution de la fonction getArtistNameForAlbum() et getTrackForAlbum().
			// Ces dernières permettent de récupérer un le nom de l'artiste et un tableau contenant les morceaux de l'albums
			$artistName = getArtistNameForAlbum($connexion, $tableauAlbums[$i]);
			$tracks 	= getTrackForAlbum($connexion, $tableauAlbums[$i]);
			
			// Affichage en JSON de la réponse
			echo "{";
				echo '"album_name": "' . utf8_encode($tableauAlbums[$i]) . '",';
				echo '"tracks": ' . json_encode($tracks) . ', ';
				echo '"items_count": ' . count($tracks) . ', ';
				echo '"artist_name": "' . utf8_encode($artistName) . '"';
			
			if($increLigne == ($nbrAlbum - 1 )) // Avant dernier élément du tableau
				echo "}";
			else
				echo "},";
			
			// Incrémentation du nombre de ligne
			$increLigne++;
		}
		
		echo "]}";
	}
	else
	{
		// Une erreur est survenue lors de l'execution de la commande SQL
		$errorInfoArray = $connexion->errorInfo();
		write_error_to_log("API Récupération données","Impossible d'exécuter la commande SQL (récupération des albums) : " . $errorInfoArray[2]);
	}
}

// Fonction permettant de retourner un tableau contenant les morceaux d'un album en particulier
function getTrackForAlbum($connexion, $albumName)
{
	// Protection de la chaîne (pour éviter les attaques SQL)
	$albumName = $connexion->quote($albumName);
	
	// Création de la commande SQL
	$commande_SQL	= "SELECT * FROM pistes WHERE album=". $albumName ." ORDER BY title ASC";
	$tableauPistes = array();
	
	// Execution de la commande SQL
	if($selectStatement = $connexion->query($commande_SQL))
	{
		// Assignation de chaque ligne
		while($ligne = $selectStatement->fetch(PDO::FETCH_ASSOC))
		{
			// On vérifie si le tableau "$tableauPistes" contient la piste de cet enregistrement
			if (!in_array($ligne, $tableauPistes))
			{
				// La piste n'existe pas dans le tableau,
				// on va l'ajouter
				$tableauPistes[] = array_map("utf8_encode", $ligne);
			}
		}
	}
	else
	{
		// Une erreur est survenue lors de l'execution de la commande SQL
		$errorInfoArray = $connexion->errorInfo();
		write_error_to_log("API Récupération données","Impossible d'exécuter la commande SQL (récupération des pistes d'un album) : " . $errorInfoArray[2]);
	}
	
	return $tableauPistes;
}

// Fonction permettant de retourner le nom de l'artiste associé à un album en particulier
function getArtistNameForAlbum($connexion, $albumName)
{
	// Protection de la chaîne (pour éviter les attaques SQL)
	$albumName = $connexion->quote($albumName);
	
	// Création de la commande SQL
	$commande_SQL	= "SELECT artist FROM pistes WHERE album=". $albumName ." ORDER BY artist ASC LIMIT 1";
	$nomArtiste 	= "inconnu";
	
	// Execution de la commande SQL
	if($selectStatement = $connexion->query($commande_SQL))
	{
		// Assignation de la ligne
		if($ligne = $selectStatement->fetch(PDO::FETCH_ASSOC))
		{
			// On récupère le nom de l'artiste
			$nomArtiste = $ligne['artist'];
		}
	}
	else
	{
		// Une erreur est survenue lors de l'execution de la commande SQL
		$errorInfoArray = $connexion->errorInfo();
		write_error_to_log("API Récupération données","Impossible d'exécuter la commande SQL (récupération du nom de l'artiste d'un album) : " . $errorInfoArray[2]);
	}
	
	return $nomArtiste;
}

// Fonction permettant de récupérer la liste de toute les playlists
function retrievePlaylists($connexion)
{
	// Création de la commande SQL
	$commande_SQL		= "SELECT * FROM playlists ORDER BY name ASC";
	$tableauPlaylists 	= array();
	
	// Récupération et formattage de la date
	$date 				= getdate();
	$dateStr 			= $date['mday'] . "/" . $date['mon'] . "/" . $date['year'];
	$increLigne 		= 0;
	
	// Execution de la commande SQL
	if($selectStatement = $connexion->query($commande_SQL))
	{
		// Calcul du nombre de ligne
		$nbrLigne = $selectStatement->rowCount();
		
		// Assignation de chaque ligne
		while($ligne = $selectStatement->fetch(PDO::FETCH_ASSOC))
		{
			// On vérifie si le tableau "$tableauPlaylists" contient la playlist de cet enregistrement
			if (!in_array($ligne['name'], $tableauPlaylists))
			{
				// L'album n'existe pas dans le tableau,
				// on va l'ajouter sous forme de tableau
				$tableauPlaylists[] = array('idPLAYLIST' => $ligne['idPLAYLIST'], // L'identifiant de la playlist
											'name' => utf8_encode($ligne['name']), // Le nom de la playlist (convertit au format UTF-8)
											'items_count' => $ligne['items_count']); // Le nombre de piste dans la playlist
			}
		}
		
		// Calcul du nombre d'élement du tableau "$tableauPlaylists", 
		// soit le nombre de playlist
		$nbrPlaylists = count($tableauPlaylists);
		
		if($nbrPlaylists == 0)
		{
			// Aucune playlist n'est présente dans le tableau "$tableauPlaylists"
			die('{"status_code":0,"error_description":"no playlist"}');
		}
		
		// Démarrage de l'affichage JSON
		echo '{"status_code":1, "fetched_at": "'. $dateStr .'","playlists": [';
		
		// Pour chaque playlist
		for($i = 0; $i < $nbrPlaylists; $i++)
		{
			// Execution de la fonction getTrackForPlaylist(),
			// cette fonction retourne un tableau contenant les morceaux d'une playlist
			$tracks = getTrackForPlaylist($connexion, $tableauPlaylists[$i]['idPLAYLIST']);
			
			// Affichage en JSON de la réponse
			echo "{";
				echo '"idPLAYLIST": "' . $tableauPlaylists[$i]['idPLAYLIST'] . '",';
				echo '"name": "' . $tableauPlaylists[$i]['name'] . '",';
				echo '"items_count": "' . $tableauPlaylists[$i]['items_count'] . '",';
				echo '"tracks": ' . json_encode($tracks);
			
			if($increLigne == ($nbrPlaylists - 1 )) // Avant dernier element du tableau
				echo "}";
			else
				echo "},";
			
			// Incrémentation du nombre de ligne
			$increLigne++;
		}
		
		echo "]}";
	}
	else
	{
		// Une erreur est survenue lors de l'execution de la commande SQL
		$errorInfoArray = $connexion->errorInfo();
		write_error_to_log("API Récupération données","Impossible d'exécuter la commande SQL (récupération des playlists) : " . $errorInfoArray[2]);
	}
}

// Fonction permettant de retourner un tableau contenant les morceaux associés à une playlist en particulier
function getTrackForPlaylist($connexion, $playlistID)
{
	// Protection de la chaîne (pour éviter les attaques SQL)
	$playlistID = $connexion->quote($playlistID);
	
	// Création de la commande SQL
	$commande_SQL	= "SELECT DISTINCT * FROM pistes, contenu_playlists WHERE pistes.idPISTES = contenu_playlists.PISTES_idPISTES AND contenu_playlists.PLAYLIST_idPLAYLIST=" . $playlistID;
	$tableauPistes = array();
	
	// Execution de la commande SQL
	if($selectStatement = $connexion->query($commande_SQL))
	{
		// Assignation de chaque ligne
		while($ligne = $selectStatement->fetch(PDO::FETCH_ASSOC))
		{
			// On vérifie si le tableau "$tableauPistes" contient la piste de cet enregistrement
			if (!in_array($ligne, $tableauPistes))
			{
				// La piste n'existe pas dans le tableau,
				// on va l'ajouter
				$tableauPistes[] = array_map("utf8_encode", $ligne);
			}
		}
	}
	else
	{
		// Une erreur est survenue lors de l'execution de la commande SQL
		$errorInfoArray = $connexion->errorInfo();
		write_error_to_log("API Récupération données","Impossible d'exécuter la commande SQL (récupération des pistes d'une playlist) : " . $errorInfoArray[2]);
	}
	
	return $tableauPistes;
}

// Libération des résultats
$connexion = null;

?>