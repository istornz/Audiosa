<?php

header('Content-Type: application/json');
require("global_fonction.php");

/************************/
//	    Variables		//
/************************/

$ALLOWED_EXTENSION 	= 'flac';
$MAX_FILESIZE 		= 536870912; // 512Mb max

if(!isset($_POST['pseudoPost']) || !isset($_POST['passwordPost']))
{
	write_error_to_log("API Importation","Paramètres manquants, 'pseudoPost' et/ou 'passwordPost' ne sont pas renseignés");
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
	write_error_to_log("API Importation","Connexion à la base de données impossible : " . $e->getMessage());
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
//	       Upload     	//
/************************/

if(isset($_FILES['file']) && $_FILES['file']['error'] == 0)
{
	$extensionFichier 	= pathinfo(htmlentities($_FILES['file']['name']), PATHINFO_EXTENSION);
	$tailleFichier		= htmlentities($_FILES['file']['size']);
	$mimetypeFichier	= htmlentities($_FILES['file']['type']);
	$fullPath			= htmlentities(UPLOAD_DIR . $_FILES['file']['name']);
	
	if($extensionFichier != $ALLOWED_EXTENSION)
	{
		write_error_to_log("API Importation","Extension non autorisée ('" . $extensionFichier . "')");
		die('{"status_code":0, "error_description":"extension not authorized"}');
	}
	
	if(file_exists($fullPath))
	{
		write_error_to_log("API Importation","Le fichier existe déjà (fichier : '" . $_FILES['file']['name'] . "')");
		die('{"status_code":0, "error_description":"file already exist"}');
	}
	
	if($tailleFichier > $MAX_FILESIZE)
	{
		write_error_to_log("API Importation","La taille du fichier ('" . $tailleFichier . "') est trop importante, maximum : '" . $MAX_FILESIZE . "')");
		die('{"status_code":0, "error_description":"file too big"}');
	}
	
	if(!($mimetypeFichier == "audio/flac") && !($mimetypeFichier == "audio/x-flac"))
	{
		write_error_to_log("API Importation","Le mimetype du fichier est invalide (mimetype du fichier : '" . $mimetypeFichier . "')");
		die('{"status_code":0, "error_description":"file is not a valid flac file"}');
	}
	
	if(move_uploaded_file($_FILES['file']['tmp_name'], $fullPath))
	{
		die('{"status_code":1}');
	}
	else
	{
		write_error_to_log("API Importation","Impossible de déplacer le fichier au chemin : '" . $fullPath . "'");
		die('{"status_code":0, "error_description":"unable to move file"}');
	}
	
}
else
{
	write_error_to_log("API Importation","Une erreur est survenue lors de l'upload du fichier : '" . $_FILES['file']['name'] . "'");
	die('{"status_code":0, "error_description":"upload error"}');
}

?>