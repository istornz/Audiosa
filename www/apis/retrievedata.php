<?php

header('Content-Type: application/json');
require("global_fonction.php");

/************************/
//		Variables		//
/************************/

if(!isset($_POST['argPost']))
{
	die('{"status_code":0,"error_description":"undeclared variable"}');
}

/************************/
//		   MYSQL		//
/************************/

try
{
    $connexion = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME", $DB_READER_MUSIC_LOGIN, $DB_READER_MUSIC_PSW);
}
catch(PDOException $e)
{
	write_error_to_log("API Récupération données","Connexion à la base de données impossible : " . $e->getMessage());
	die('{"status_code":0, "error_description":"connection to database failed"}');
}

/************************/
//		   JSON			//
/************************/

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

function retrieveMorceaux($connexion)
{
	$commande_SQL	= "SELECT * FROM `pistes` JOIN genres ON genres.idGENRES = pistes.genre ORDER BY title ASC;";
	$date = getdate();
	$dateStr = $date['mday'] . "/" . $date['mon'] . "/" . $date['year'];
	echo '{"status_code":1, "fetched_at": "'. $dateStr .'","pistes": ';
	
	if($selectStatement = $connexion->query($commande_SQL))
	{
		$increLigne = 0;
		$nbrLigne = $selectStatement->rowCount();
		
		while($ligne = $selectStatement->fetch(PDO::FETCH_ASSOC))
		{
			$nbrColonne = $selectStatement->columnCount();
			$convertToUTF8Format[] = array_map("utf8_encode", $ligne);
						
			$increLigne++;
		}
		
		echo json_encode($convertToUTF8Format);
		
		echo "}";
	}
	else
	{
		$errorInfoArray = $connexion->errorInfo();
		write_error_to_log("API Récupération données","Impossible d'exécuter la commande SQL (selection morceaux) : " . $errorInfoArray[2]);
		die('{"status_code":0,"error_description":"failed to execute select query"}');
	}
}

function retrieveArtistes($connexion)
{
	$commande_SQL		= "SELECT * FROM pistes ORDER BY artist ASC";
	$tableauArtistes 	= array();
	$date 				= getdate();
	$dateStr 			= $date['mday'] . "/" . $date['mon'] . "/" . $date['year'];
	$increLigne 		= 0;
	
	echo '{"status_code":1, "fetched_at": "'. $dateStr .'","artistes": [';
	
	if($selectStatement = $connexion->query($commande_SQL))
	{
		$nbrLigne = $selectStatement->rowCount();
		
		while($ligne = $selectStatement->fetch(PDO::FETCH_ASSOC))
		{
			if (!in_array($ligne['artist'], $tableauArtistes))
			{
				//Ajout de l'artiste
				$tableauArtistes[] = $ligne['artist'];
			}
		}
		
		$nbrArtiste = count($tableauArtistes);
		
		if($nbrArtiste == 0)
		{
			die('{"status_code":0,"error_description":"no artist"}');
		}
		
		for($i = 0; $i < $nbrArtiste; $i++)
		{
			$albums 	= getAlbumsForArtist($connexion, $tableauArtistes[$i]);
			
			echo "{";
				echo '"artist_name": "' . utf8_encode($tableauArtistes[$i])  . '",';
				echo '"albums": ' . json_encode($albums)  . ',';
				echo '"items_count": ' . count($albums);
			
			if($increLigne == ($nbrArtiste - 1 ))
				echo "}";
			else
				echo "},";
			
			$increLigne++;
		}
		
		echo "]}";
	}
	else
	{
		$errorInfoArray = $connexion->errorInfo();
		write_error_to_log("API Récupération données","Impossible d'exécuter la commande SQL (selection artistes) : " . $errorInfoArray[2]);
	}
}

function getAlbumsForArtist($connexion, $artistName)
{
	$artistName 	= $connexion->quote($artistName);
	$commande_SQL	= "SELECT DISTINCT album FROM pistes WHERE artist=". $artistName ." ORDER BY album ASC";
	$tableauAlbums 	= array();
	$tableauTracks 	= array();
	$nbrAlbums 		= 0;
	
	if($selectStatement = $connexion->query($commande_SQL))
	{
		$nbrLigne = $selectStatement->rowCount();
		
		while($ligne = $selectStatement->fetch(PDO::FETCH_ASSOC))
		{
			$tracks = getTrackForAlbum($connexion, $ligne['album']);
			
			if (!in_array($ligne['album'], $tableauAlbums))
			{	
				$tableauAlbums[]	= array('album_name' => utf8_encode($ligne['album']),
											'tracks' => $tracks,
											'items_count' => count($tracks));
			}
		}
		
	}
	else
	{
		$errorInfoArray = $connexion->errorInfo();
		write_error_to_log("API Récupération données","Impossible d'exécuter la commande SQL (récupération du nombre de pistes pour chaque artistes) : " . $errorInfoArray[2]);
	}
	
	return $tableauAlbums;
}

function retrieveAlbums($connexion)
{
	$commande_SQL		= "SELECT album FROM pistes ORDER BY album ASC";
	$tableauAlbums 		= array();
	$date 				= getdate();
	$dateStr 			= $date['mday'] . "/" . $date['mon'] . "/" . $date['year'];
	$increLigne 		= 0;
	
	if($selectStatement = $connexion->query($commande_SQL))
	{
		$nbrLigne = $selectStatement->rowCount();
		
		while($ligne = $selectStatement->fetch(PDO::FETCH_ASSOC))
		{
			if (!in_array($ligne['album'], $tableauAlbums))
			{
				//Ajout de l'artiste
				$tableauAlbums[] = $ligne['album'];
			}
		}
		
		$nbrAlbum = count($tableauAlbums);
		
		if($nbrAlbum == 0)
		{
			die('{"status_code":0,"error_description":"no album"}');
		}
		
		echo '{"status_code":1, "fetched_at": "'. $dateStr .'","albums": [';
		
		for($i = 0; $i < $nbrAlbum; $i++)
		{
			$artistName = getArtistNameForAlbum($connexion, $tableauAlbums[$i]);
			$tracks 	= getTrackForAlbum($connexion, $tableauAlbums[$i]);
			
			echo "{";
				echo '"album_name": "' . utf8_encode($tableauAlbums[$i]) . '",';
				echo '"tracks": ' . json_encode($tracks) . ', ';
				echo '"items_count": ' . count($tracks) . ', ';
				echo '"artist_name": "' . utf8_encode($artistName) . '"';
			
			if($increLigne == ($nbrAlbum - 1 ))
				echo "}";
			else
				echo "},";
			
			$increLigne++;
		}
		
		echo "]}";
	}
	else
	{
		$errorInfoArray = $connexion->errorInfo();
		write_error_to_log("API Récupération données","Impossible d'exécuter la commande SQL (récupération des albums) : " . $errorInfoArray[2]);
	}
}

function getTrackForAlbum($connexion, $albumName)
{
	$albumName = $connexion->quote($albumName);
	
	$commande_SQL	= "SELECT * FROM pistes WHERE album=". $albumName ." ORDER BY title ASC";
	$tableauPistes = array();
	
	if($selectStatement = $connexion->query($commande_SQL))
	{		
		while($ligne = $selectStatement->fetch(PDO::FETCH_ASSOC))
		{
			if (!in_array($ligne, $tableauPistes))
			{
				$tableauPistes[]=array_map("utf8_encode", $ligne);
			}
		}
	}
	else
	{
		$errorInfoArray = $connexion->errorInfo();
		write_error_to_log("API Récupération données","Impossible d'exécuter la commande SQL (récupération des pistes d'un album) : " . $errorInfoArray[2]);
	}
	
	return $tableauPistes;
}

function getArtistNameForAlbum($connexion, $albumName)
{
	$albumName = $connexion->quote($albumName);
	$commande_SQL	= "SELECT artist FROM pistes WHERE album=". $albumName ." ORDER BY artist ASC LIMIT 1";
	$nomArtiste 	= "inconnu";
	
	if($selectStatement = $connexion->query($commande_SQL))
	{	
		if($ligne = $selectStatement->fetch(PDO::FETCH_ASSOC))
		{
			$nomArtiste = $ligne['artist'];
		}
	}
	else
	{
		$errorInfoArray = $connexion->errorInfo();
		write_error_to_log("API Récupération données","Impossible d'exécuter la commande SQL (récupération du nom de l'artiste d'un album) : " . $errorInfoArray[2]);
	}
	
	return $nomArtiste;
}

function retrievePlaylists($connexion)
{
	$commande_SQL		= "SELECT * FROM playlists ORDER BY name ASC";
	$tableauPlaylists 	= array();
	$date 				= getdate();
	$dateStr 			= $date['mday'] . "/" . $date['mon'] . "/" . $date['year'];
	$increLigne 		= 0;
	
	if($selectStatement = $connexion->query($commande_SQL))
	{
		$nbrLigne = $selectStatement->rowCount();
		
		while($ligne = $selectStatement->fetch(PDO::FETCH_ASSOC))
		{
			if (!in_array($ligne['name'], $tableauPlaylists))
			{
				$tableauPlaylists[] = array('idPLAYLIST' => $ligne['idPLAYLIST'], 
											'name' => utf8_encode($ligne['name']), 
											'items_count' => $ligne['items_count']);
			}
		}
		
		$nbrPlaylists = count($tableauPlaylists);
		
		if($nbrPlaylists == 0)
		{
			die('{"status_code":0,"error_description":"no playlist"}');
		}
		
		echo '{"status_code":1, "fetched_at": "'. $dateStr .'","playlists": [';
		
		for($i = 0; $i < $nbrPlaylists; $i++)
		{
			$tracks = getTrackForPlaylist($connexion, $tableauPlaylists[$i]['idPLAYLIST']);
			
			echo "{";
				echo '"name": "' . $tableauPlaylists[$i]['name'] . '",';
				echo '"items_count": "' . $tableauPlaylists[$i]['items_count'] . '",';
				echo '"tracks": ' . json_encode($tracks);
			
			if($increLigne == ($nbrPlaylists - 1 ))
				echo "}";
			else
				echo "},";
			
			$increLigne++;
		}
		
		echo "]}";
	}
	else
	{
		$errorInfoArray = $connexion->errorInfo();
		write_error_to_log("API Récupération données","Impossible d'exécuter la commande SQL (récupération des playlists) : " . $errorInfoArray[2]);
	}
}

function getTrackForPlaylist($connexion, $playlistID)
{
	$playlistID = $connexion->quote($playlistID);
	$commande_SQL	= "SELECT DISTINCT * FROM pistes, contenu_playlists WHERE pistes.idPISTES = contenu_playlists.PISTES_idPISTES AND contenu_playlists.PLAYLIST_idPLAYLIST=" . $playlistID;
	$tableauPistes = array();
	
	if($selectStatement = $connexion->query($commande_SQL))
	{		
		while($ligne = $selectStatement->fetch(PDO::FETCH_ASSOC))
		{
			if (!in_array($ligne, $tableauPistes))
			{
				$tableauPistes[]=array_map("utf8_encode", $ligne);
			}
		}
	}
	else
	{
		$errorInfoArray = $connexion->errorInfo();
		write_error_to_log("API Récupération données","Impossible d'exécuter la commande SQL (récupération des pistes d'une playlist) : " . $errorInfoArray[2]);
	}
	
	return $tableauPistes;
}

/* Libération des résultats */
$connexion = null;

?>