<?php

header('Content-Type: application/json');
include('conf.php');

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
else
	die('{"status_code":0, "error_description":"invalid parameter"}');

function retrieveMorceaux($connexion)
{
	$commande_SQL	= "SELECT * FROM PISTES";
	$date = getdate();
	$dateStr = $date['mday'] . "/" . $date['mon'] . "/" . $date['year'];
	echo '{"status_code":1, "fetched_at": "'. $dateStr .'","pistes": [';

	if($selectStatement = $connexion->query($commande_SQL))
	{
		$increLigne = 0;
		$nbrLigne = $selectStatement->rowCount();
		
		while($result = $selectStatement->fetch(PDO::FETCH_ASSOC))
		{
			$nbrColonne = $selectStatement->columnCount();
			$increColonne = 0;
			echo "{";
			// Pour chaque cellule, avec comme séparateur "=>"
			foreach ($result as $colonne => $valeur)
			{
				// Transformation des infos vides en null
				if($valeur == "")
					$valeur = "null";
				else
					$valeur = '"' . $valeur  . '"';
				
				echo '"' . $colonne. '": ' . $valeur  . '';
				
				if($increColonne != ($nbrColonne - 1 ))
					echo ", ";
				
				$increColonne++;
			}
			
			if($increLigne == ($nbrLigne - 1 ))
				echo "}";
			else
				echo "},";
			
			$increLigne++;
		}
		
	echo "]}";
	}
	else
	{
		die('{"status_code":0,"error_description":"failed to execute select query"}');
	}
}

function retrieveArtistes($connexion)
{
	$commande_SQL		= "SELECT * FROM PISTES";
	$tableauArtistes 	= array();
	$date = getdate();
	$dateStr = $date['mday'] . "/" . $date['mon'] . "/" . $date['year'];
	$increLigne = 0;
	
	echo '{"status_code":1, "fetched_at": "'. $dateStr .'","artists": [';
	
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
			echo "{";
			echo '"artist_name": "' . $tableauArtistes[$i]  . '",';
			echo '"album_nbr": ' . getAlbumNumberForArtist($connexion, $tableauArtistes[$i])  . ',';
			echo '"tracks_nbr": ' . getTrackNumberForArtist($connexion, $tableauArtistes[$i])  . '';
			
			if($increLigne == ($nbrArtiste - 1 ))
				echo "}";
			else
				echo "},";
			
			$increLigne++;
		}
		
		echo "]}";
	}
}

function getAlbumNumberForArtist($connexion, $artistName)
{
	$commande_SQL	= "SELECT album FROM PISTES WHERE artist='". $artistName ."'";
	$tableauAlbums = array();
	$nbrAlbums = 0;
	
	if($selectStatement = $connexion->query($commande_SQL))
	{
		$nbrLigne = $selectStatement->rowCount();
		
		while($ligne = $selectStatement->fetch(PDO::FETCH_ASSOC))
		{
			if (!in_array($ligne['album'], $tableauAlbums))
			{
				$tableauAlbums[] = $ligne['album'];
			}
		}
		
		$nbrAlbums = count($tableauAlbums);
	}
	
	return $nbrAlbums;
}

function getTrackNumberForAlbum($connexion, $albumName)
{
	$commande_SQL	= "SELECT idPISTES FROM PISTES WHERE album='". $albumName ."'";
	$tableauPistes = array();
	$nbrPistes = 0;
	
	if($selectStatement = $connexion->query($commande_SQL))
	{
		$nbrLigne = $selectStatement->rowCount();
		
		while($ligne = $selectStatement->fetch(PDO::FETCH_ASSOC))
		{
			if (!in_array($ligne['idPISTES'], $tableauPistes))
			{
				$tableauPistes[] = $ligne['idPISTES'];
			}
		}
		
		$nbrPistes = count($tableauPistes);
	}
	
	return $nbrPistes;
}

function getTrackNumberForArtist($connexion, $artistName)
{
	$commande_SQL	= "SELECT idPISTES FROM PISTES WHERE artist='". $artistName ."'";
	$tableauPistes = array();
	$nbrPistes = 0;
	
	if($selectStatement = $connexion->query($commande_SQL))
	{
		$nbrLigne = $selectStatement->rowCount();
		
		while($ligne = $selectStatement->fetch(PDO::FETCH_ASSOC))
		{
			if (!in_array($ligne['idPISTES'], $tableauPistes))
			{
				$tableauPistes[] = $ligne['idPISTES'];
			}
		}
		
		$nbrPistes = count($tableauPistes);
	}
	
	return $nbrPistes;
}

function retrieveAlbums($connexion)
{
	$commande_SQL		= "SELECT album FROM PISTES";
	$tableauAlbums 	= array();
	$date = getdate();
	$dateStr = $date['mday'] . "/" . $date['mon'] . "/" . $date['year'];
	$increLigne = 0;
	
	echo '{"status_code":1, "fetched_at": "'. $dateStr .'","album": [';
	
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
		
		for($i = 0; $i < $nbrAlbum; $i++)
		{
			echo "{";
				echo '"album_name": "' . $tableauAlbums[$i] . '",';
				echo '"tracks_nbr": ' . getTrackNumberForAlbum($connexion, $tableauAlbums[$i])  . '';
			
			if($increLigne == ($nbrAlbum - 1 ))
				echo "}";
			else
				echo "},";
			
			$increLigne++;
		}
		
		echo "]}";
	}
}

/* Libération des résultats */
$connexion = null;

?>