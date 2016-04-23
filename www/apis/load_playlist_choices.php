<?php
error_reporting(E_ERROR | E_WARNING | E_PARSE);

header('Content-Type: application/json');

require("global_fonction.php");

/************************/
//	    Variables		//
/************************/

include('conf.php');

$type = $_POST["type"];

if($type != "albums" && $type != "artistes" && $type != "annees" && $type != "genres")
{
	die('{"status_code":0, "error_description": "bad type"}');
}

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
	echo '{"status_code":1, "fetched_at": "'. $dateStr .'"';
	
if($type == "genres") {
 
 	echo ',"genres": ';

	/************************/
	//	    GENRES  	 	//
	/************************/

	$commande_SQL	= "SELECT * FROM genres WHERE nom != 'NULL'";
	$query = $connexion->prepare($commande_SQL);
	$query->execute();
	
	while($result = $query->fetch(PDO::FETCH_ASSOC)) {
		$genresToUTF8Format[] = array_map("utf8_encode", $result);
	}
	
	echo json_encode($genresToUTF8Format);
} 
else if($type == "albums")
{

	/************************/
	//	    ALBUMS  	 	//
	/************************/

	echo ',"albums": ';
	
	$commande_SQL	= "SELECT idPISTES,album FROM pistes WHERE album != 'NULL' GROUP BY album";
	$query = $connexion->prepare($commande_SQL);
	$query->execute();
	
	while($result = $query->fetch(PDO::FETCH_ASSOC)) {
	
		$commande_SQL	= "SELECT cover FROM pistes WHERE album = ".$connexion->quote($result["album"])." LIMIT 1";
		$queryCover = $connexion->prepare($commande_SQL);
		$queryCover->execute();
	
		$cover = $queryCover->fetch(PDO::FETCH_ASSOC);

		$coverToUTF8Format[] = array_map("utf8_encode", $cover);
	
		$albumsToUTF8Format[] = array_map("utf8_encode", $result);
	}
	
	echo json_encode($albumsToUTF8Format);
	
	echo ',"coverAlbum": ';
	
	echo json_encode($coverToUTF8Format);
}
else if ($type == "artistes")
{
	
	/************************/
	//	    ARTISTES  	 	//
	/************************/
	
	echo ',"artistes": ';
	
	$commande_SQL	= "SELECT DISTINCT idPISTES,artist FROM pistes WHERE artist != 'NULL' GROUP BY artist";
	$query = $connexion->prepare($commande_SQL);
	$query->execute();
	
	while($result = $query->fetch(PDO::FETCH_ASSOC)) {
		$artistToUTF8Format[] = array_map("utf8_encode", $result);
	}
	
	echo json_encode($artistToUTF8Format);
	
}
else if($type == "annees")
{
	/************************/
	//	    ANNEES  	 	//
	/************************/
	
	echo ',"annees": ';
	
	$commande_SQL	= "SELECT idPISTES,date FROM pistes WHERE date != 'NULL' GROUP BY date";
	$query = $connexion->prepare($commande_SQL);
	$query->execute();
	
	while($result = $query->fetch(PDO::FETCH_ASSOC)) {
		$anneeToUTF8Format[] = array_map("utf8_encode", $result);
	}
	
	echo json_encode($anneeToUTF8Format);
	
}
		
	echo "}";
?>