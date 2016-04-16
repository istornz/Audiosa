<?php
error_reporting(E_ERROR | E_WARNING | E_PARSE);

header('Content-Type: application/json');

require("global_fonction.php");

/************************/
//	    Variables		//
/************************/

include('conf.php');

/************************/
//		   MYSQL		//
/************************/

try 
{
    $connexion = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME", $DB_READER_USER_LOGIN, $DB_READER_USER_PSW);
	
	$pseudoQuoted	= $connexion->quote($_POST['pseudoPost']);
	$passwordQuoted	= $connexion->quote($_POST['passwordPost']);
}
catch(PDOException $e)
{
	write_error_to_log("Génération choix playlist","Connection DB failed: ". $e->getMessage());
	die('{"status_code":0, "error_description":"connection to database failed"}');
}

	$date = getdate();
	$dateStr = $date['mday'] . "/" . $date['mon'] . "/" . $date['year'];
	echo '{"status_code":1, "fetched_at": "'. $dateStr .'","genres": ';
	
	/************************/
	//	    GENRES  	 	//
	/************************/

	$commande_SQL	= "SELECT nom FROM GENRES WHERE nom != 'NULL'";
	$query = $connexion->prepare($commande_SQL);
	$query->execute();
	
	while($result = $query->fetch(PDO::FETCH_ASSOC)) {
		$genresToUTF8Format[] = array_map("utf8_encode", $result);
	}
	
	echo json_encode($genresToUTF8Format);
		
	/************************/
	//	    ALBUMS  	 	//
	/************************/

	echo ',"albums": ';
	
	$commande_SQL	= "SELECT DISTINCT album FROM PISTES WHERE album != 'NULL'";
	$query = $connexion->prepare($commande_SQL);
	$query->execute();
	
	while($result = $query->fetch(PDO::FETCH_ASSOC)) {
	
		$commande_SQL	= "SELECT cover FROM PISTES WHERE album = ".$connexion->quote($result["album"])." LIMIT 1";
		$queryCover = $connexion->prepare($commande_SQL);
		$queryCover->execute();
	
		$cover = $queryCover->fetch(PDO::FETCH_ASSOC);

		$coverToUTF8Format[] = array_map("utf8_encode", $cover);
	
		$albumsToUTF8Format[] = array_map("utf8_encode", $result);
	}
	
	echo json_encode($albumsToUTF8Format);
	
	/************************/
	//	    ARTISTES  	 	//
	/************************/
	
	echo ',"artists": ';
	
	$commande_SQL	= "SELECT DISTINCT artist FROM PISTES WHERE artist != 'NULL' ";
	$query = $connexion->prepare($commande_SQL);
	$query->execute();
	
	while($result = $query->fetch(PDO::FETCH_ASSOC)) {
		$artistToUTF8Format[] = array_map("utf8_encode", $result);
	}
	
	echo json_encode($artistToUTF8Format);
	
	/************************/
	//	    ANNEES  	 	//
	/************************/
	
	echo ',"annees": ';
	
	$commande_SQL	= "SELECT DISTINCT date FROM PISTES WHERE date != 'NULL'";
	$query = $connexion->prepare($commande_SQL);
	$query->execute();
	
	while($result = $query->fetch(PDO::FETCH_ASSOC)) {
		$anneeToUTF8Format[] = array_map("utf8_encode", $result);
	}
	
	echo json_encode($anneeToUTF8Format);
	
	echo ',"coverAlbum": ';
	
	echo json_encode($coverToUTF8Format);
		
	echo "}";
?>