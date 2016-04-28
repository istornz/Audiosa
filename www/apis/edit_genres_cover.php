<?php

header('Content-Type: application/json');
require("global_fonction.php");

/************************/
//	    Variables		//
/************************/

$ALLOWED_EXTENSION_COVER	= array('gif', 'png', 'jpg', 'jpeg'); 
$MAX_FILESIZE_COVER 		= 3145728; // 3Mb max

if(!isset($_POST['pseudoPost']) || !isset($_POST['passwordPost']) || !isset($_POST['imageGenrePost']))
{
	write_error_to_log("API Illustration Genres","Paramètres manquants, 'pseudoPost', 'passwordPost' et/ou 'imageGenrePost' ne sont pas renseignés");
	die('{"status_code":0,"error_description":"undeclared variables"}');
}

$tableauImageGenre = json_decode($_POST['imageGenrePost']);

/************************/
//		   MYSQL		//
/************************/

try
{
    $connexion = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME", $DB_WRITER_LOGIN, $DB_WRITER_PSW);
}
catch(PDOException $e)
{
	write_error_to_log("API Illustration Genres","Connexion à la base de données impossible : " . $e->getMessage());
	die('{"status_code":0, "error_description":"connection to database failed"}');
}

/************************/
//	   Verifications 	//
/************************/

$selectStatement = $connexion->prepare('SELECT COUNT(*) FROM utilisateur WHERE utilisateur.username = :username AND utilisateur.password = :password LIMIT 1');
$selectStatement->bindValue(':username', $_POST['pseudoPost'], PDO::PARAM_STR);
$selectStatement->bindValue(':password', $_POST['passwordPost'], PDO::PARAM_STR);

if($selectStatement->execute())
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

/************************/
//	      Upload     	//
/************************/

for($i = 0; $i < count($tableauImageGenre); $i++)
{
	$extensionFichier 	= pathinfo(htmlentities($_FILES[$tableauImageGenre[$i]]['name']), PATHINFO_EXTENSION);
	$tailleFichier		= htmlentities($_FILES[$tableauImageGenre[$i]]['size']);
	$mimetypeFichier	= htmlentities($_FILES[$tableauImageGenre[$i]]['type']);
	$fileName			= $_FILES[$tableauImageGenre[$i]]['name'];
	$fullPath			= htmlentities(COVER_GENRES_DIR . $fileName);
	
	if(!in_array($extensionFichier, $ALLOWED_EXTENSION_COVER))
	{
		write_error_to_log("API Illustration Genres","Extension non autorisée ('" . $extensionFichier . "')");
		die('{"status_code":0, "error_description":"extension not authorized"}');
	}
	
	if($tailleFichier > $MAX_FILESIZE_COVER)
	{
		write_error_to_log("API Illustration Genres","La taille du fichier ('" . $tailleFichier . "') est trop importante, maximum : '" . $MAX_FILESIZE_COVER . "')");
		die('{"status_code":0, "error_description":"file too big"}');
	}
	
	if(getimagesize($_FILES[$tableauImageGenre[$i]]['tmp_name']) == 0)
	{
		write_error_to_log("API Illustration Genres","La cover est invalide (le fichier n'est pas une image)");
		die('{"status_code":0, "error_description":"file is not a valid image file"}');
	}
	
	if(!move_uploaded_file($_FILES[$tableauImageGenre[$i]]['tmp_name'], $fullPath))
	{
		write_error_to_log("API Illustration Genres","Impossible de déplacer le fichier au chemin : '" . $fullPath . "'");
		die('{"status_code":0, "error_description":"unable to move file"}');
	}
	
	/************************/
	//	      MYSQL      	//
	/************************/
	
	$commandeSQLUpdate = "UPDATE `genres` SET `image` = '" . $_FILES[$tableauImageGenre[$i]]['name'] . "' WHERE idGENRES=". $tableauImageGenre[$i] .";";
	$updateStatement = $connexion->prepare(utf8_decode($commandeSQLUpdate));
	write_error_to_log("API Illustration Genres", $commandeSQLUpdate);
	if(!$updateStatement->execute())
	{
		$errorInfoArray = $updateStatement->errorInfo();
		write_error_to_log("API Illustration Genres","Impossible d'exécuter la commande SQL (update) : " . $errorInfoArray[2] . $commandeSQLUpdate);
		die('{"status_code":0,"error_description":"failed to update image name"}');
	}
}

die ('{"status_code":1}');

?>