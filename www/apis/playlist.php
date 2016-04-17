<?php
error_reporting(E_ERROR | E_WARNING | E_PARSE);

header('Content-Type: application/json');

require("global_fonction.php");

/************************/
//	    Variables		//
/************************/

include('conf.php');

$genres = json_decode($_POST['genres']);
$annees = json_decode($_POST['annees']);
$artists = json_decode($_POST['artists']);
$playlist_name = json_decode($_POST['playlist_name']);

$_genres = array();
$_annees = array();
$_playlist = array();

if(!isset($_POST['pseudoPost']) || !isset($_POST['passwordPost']))
{
	die('{"status_code":0,"error_description":"undeclared variables"}');
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
	write_error_to_log("Création playlist","Connection DB failed: ". $e->getMessage());
	die('{"status_code":0, "error_description":"connection to database failed"}');
}

try 
{
    $connexionWrite = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME", $DB_WRITER_LOGIN, $DB_WRITER_PSW);
}
catch(PDOException $e)
{
	write_error_to_log("Création playlist","Connection DB failed: ". $e->getMessage());
	die('{"status_code":0, "error_description":"connection to database failed"}');
}

/************************/
//	   Verifications 	//
/************************/
try {

$commande_SQL	= "SELECT COUNT(*) FROM utilisateur WHERE utilisateur.username=". $pseudoQuoted ." AND utilisateur.password= ". $passwordQuoted ." LIMIT 1";

$selectStatement = $connexion->query($commande_SQL);

$nbr_ligne = $selectStatement->fetchColumn();

if($nbr_ligne == 0)
{
	die('{"status_code":0,"error_description":"username and/or password does not match"}');
}

/************************************************/
//	    Recuperation des id des genres  	 	//
/************************************************/

for($igenres = 0; $igenres < count($genres); $igenres++) {
	$commande_SQL	= "SELECT idGENRES FROM genres WHERE genres.nom=". $connexion->quote($genres[$igenres]);
	$query = $connexion->prepare($commande_SQL);
	$query->execute();
	
	$result = $query->fetch(PDO::FETCH_ASSOC);
		
	array_push($_genres,$result["idGENRES"]);
}

/************************************************/
//  Recuperation des pistes fonction des genres	//
/************************************************/

for($igenres = 0; $igenres < count($_genres); $igenres++) {
	$piste_limite = rand(2,4);
	$commande_SQL	= "SELECT idPISTES FROM pistes WHERE pistes.genre=". $connexion->quote($_genres[$igenres]) ." ORDER BY RAND() LIMIT ".$piste_limite;
	$query = $connexion->prepare($commande_SQL);
	$query->execute();
	
	while($result = $query->fetch(PDO::FETCH_ASSOC)) {
		if (!in_array($result["idPISTES"], $_playlist)) {
			array_push($_playlist,$result["idPISTES"]);
		}
	}
}


/***************************************************/
//  Recuperation des pistes fonction de l'artiste  //
/***************************************************/

for($iartist = 0; $iartist < count($artists); $iartist++) {
	$piste_limite = rand(2,4);
	$commande_SQL	= "SELECT idPISTES FROM pistes WHERE pistes.artist=". $connexion->quote($artists[$iartist]) ." ORDER BY RAND() LIMIT ".$piste_limite;
	$query = $connexion->prepare($commande_SQL);
	$query->execute();
	
	while($result = $query->fetch(PDO::FETCH_ASSOC)) {
		if (!in_array($result["idPISTES"], $_playlist)) {
			array_push($_playlist,$result["idPISTES"]);
		}	
	}
}


/***************************************************/
//  Recuperation des pistes fonction de l'album    //
/***************************************************/

for($ialbum = 0; $ialbum < count($albums); $ialbum++) {
	$piste_limite = rand(2,4);
	$commande_SQL	= "SELECT idPISTES FROM pistes WHERE pistes.artist=". $connexion->quote($albums[$ialbum]) ." ORDER BY RAND() LIMIT ".$piste_limite;
	$query = $connexion->prepare($commande_SQL);
	$query->execute();
	
	while($result = $query->fetch(PDO::FETCH_ASSOC)) {
		if (!in_array($result["idPISTES"], $_playlist)) {
			array_push($_playlist,$result["idPISTES"]);
		}
	}
}


/***************************************************/
//  Recuperation des pistes fonction de l'année    //
/***************************************************/



for($iannee = 0; $iannee < count($annees); $iannee++) {
	$piste_limite = rand(2,4); 
	$commande_SQL	= "SELECT idPISTES FROM pistes WHERE pistes.date >= ". $connexion->quote($albums[$iannee]) ." AND pistes.date < ". $connexion->quote($albums[$iannee]+10) ." ORDER BY RAND() LIMIT ".$piste_limite;
	$query = $connexion->prepare($commande_SQL);
	$query->execute();
	
	while($result = $query->fetch(PDO::FETCH_ASSOC)) {
		if (!in_array($result["idPISTES"], $_playlist)) {
			array_push($_playlist,$result["idPISTES"]);
		}
	}
} 

if(count($_playlist) == 0)
{
	die('{"status_code":0,"error_description":"Music list is empty"}');
}


/************************************/
//  	Creation de la playlist     //
/************************************/

	$commande_SQL	= "INSERT INTO playlists VALUES ('',". $connexionWrite->quote($playlist_name) .", 0)";
	$query = $connexionWrite->prepare($commande_SQL);
	$query->execute();

	
	
/************************************/
//  	ID de la playlist           //
/************************************/

	$commande_SQL	= "SELECT idPLAYLIST FROM playlists WHERE playlists.name = ". $connexion->quote($playlist_name) ." ORDER BY idPLAYLIST DESC LIMIT 1";
	$query = $connexion->prepare($commande_SQL);
	$query->execute();
			
	while($result = $query->fetch(PDO::FETCH_ASSOC)) {
			$playlist_id = $result["idPLAYLIST"];
	}

	
/************************************/
//  	Insertion des musiques      //
/************************************/


for($ipiste = 0; $ipiste < count($_playlist	); $ipiste++) {

	$commande_SQL	= "INSERT INTO contenu_playlists VALUES ( '', ". $playlist_id .", ". $_playlist[$ipiste] ." )";
	$query = $connexionWrite->prepare($commande_SQL);
	$query->execute();
}

$commande_SQL	= "UPDATE playlists SET items_count = '".count($_playlist)."' WHERE idPLAYLIST = '$playlist_id' ";
$query = $connexionWrite->prepare($commande_SQL);
$query->execute();

} catch (Exception $err) {
	die('{"status_code":0,"error_description":"Failed to execute query"}');
	write_error_to_log("Création playlist", $err->getMessage());
}


echo json_encode('{"status_code":1}');

?>
