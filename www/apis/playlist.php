<?php
error_reporting(E_ERROR | E_WARNING | E_PARSE);

header('Content-Type: application/json');

/************************/
//	    Variables		//
/************************/

include('conf.php');

$genres = json_decode($_POST['genres']);
$albums = json_decode($_POST['albums']);
$annees = json_decode($_POST['annees']);
$artists = json_decode($_POST['artists']);

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
    $connexion = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME", $DB_READER_LOGIN, $DB_READER_PSW);
	
	$pseudoQuoted	= $connexion->quote($_POST['pseudoPost']);
//	$passwordQuoted	= $connexion->quote($_POST['passwordPost']);
}
catch(PDOException $e)
{
	die('{"status_code":0, "error_description":"connection to database failed"}');
}

/************************/
//	   Verifications 	//
/************************/

$commande_SQL	= "SELECT COUNT(*) FROM UTILISATEUR WHERE UTILISATEUR.username=". $pseudoQuoted ." AND UTILISATEUR.password='". $_POST['passwordPost'] ."' LIMIT 1";

if($selectStatement = $connexion->query($commande_SQL))
{
	$nbr_ligne = $selectStatement->fetchColumn();
	
	if($nbr_ligne == 0)
	{
		die('{"status_code":0,"error_description":"username and/or password does not match"}');
	}
}
else
{
	die('{"status_code":0,"error_description":"failed to execute query"}');
}

/************************************************/
//	    Recuperation des id des genres  	 	//
/************************************************/

for($igenres = 0; $igenres < count($genres); $igenres++) {
	$commande_SQL	= "SELECT idGENRES FROM GENRES WHERE GENRES.nom=". $connexion->quote($genres[$igenres]);
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
	$commande_SQL	= "SELECT idPISTES FROM PISTES WHERE PISTES.genre=". $connexion->quote($_genres[$igenres]) ." ORDER BY RAND() LIMIT ".$piste_limite;
	$query = $connexion->prepare($commande_SQL);
	$query->execute();
	
	while($result = $query->fetch(PDO::FETCH_ASSOC)) {
		array_push($_playlist,$result["idPISTES"]);
	}
}

/***************************************************/
//  Recuperation des pistes fonction de l'artiste  //
/***************************************************/

for($iartist = 0; $iartist < count($artists); $iartist++) {
	$piste_limite = rand(2,4);
	$commande_SQL	= "SELECT idPISTES FROM PISTES WHERE PISTES.artist=". $connexion->quote($artists[$iartist]) ." ORDER BY RAND() LIMIT ".$piste_limite;
	$query = $connexion->prepare($commande_SQL);
	$query->execute();
	
	while($result = $query->fetch(PDO::FETCH_ASSOC)) {
		array_push($_playlist,$result["idPISTES"]);
	}
}


/***************************************************/
//  Recuperation des pistes fonction de l'album    //
/***************************************************/

for($ialbum = 0; $ialbum < count($albums); $ialbum++) {
	$piste_limite = rand(2,4);
	$commande_SQL	= "SELECT idPISTES FROM PISTES WHERE PISTES.artist=". $connexion->quote($albums[$ialbum]) ." ORDER BY RAND() LIMIT ".$piste_limite;
	$query = $connexion->prepare($commande_SQL);
	$query->execute();
	
	while($result = $query->fetch(PDO::FETCH_ASSOC)) {
		array_push($_playlist,$result["idPISTES"]);
	}
}

/***************************************************/
//  Recuperation des pistes fonction de l'année    //
/***************************************************/

for($iannee = 0; $iannee < count($annees); $iannee++) {
	$piste_limite = rand(2,4); 
	$commande_SQL	= "SELECT idPISTES FROM PISTES WHERE PISTES.date <". $connexion->quote($albums[$iannee]) ." ORDER BY RAND() LIMIT ".$piste_limite;
	$query = $connexion->prepare($commande_SQL);
	$query->execute();
	
	while($result = $query->fetch(PDO::FETCH_ASSOC)) {
		array_push($_playlist,$result["idPISTES"]);
	}
}

echo json_encode($_playlist);

?>
