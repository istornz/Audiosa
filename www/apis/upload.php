<?php

header('Content-Type: application/json');

/************************/
//	    Variables		//
/************************/

include('conf.php');
$ALLOWED_EXTENSION 	= 'flac';
$MAX_FILESIZE 		= 536870912; // 512Mb max

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
	$passwordQuoted	= $connexion->quote($_POST['passwordPost']);
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

/************************/
//	       Upload     	//
/************************/

if(isset($_FILES['file']) && $_FILES['file']['error'] == 0)
{
	$extensionFichier 	= pathinfo(htmlentities($_FILES['file']['name']), PATHINFO_EXTENSION);
	$tailleFichier		= htmlentities($_FILES['file']['size']);
	$mimetypeFichier	= htmlentities($_FILES['file']['type']);
	$fullPath			= htmlentities('D:\uploaded\\' . $_FILES['file']['name']);
	
	if($extensionFichier != $ALLOWED_EXTENSION)
	{
		die('{"status_code":0, "error_description":"extension not authorized"}');
	}
	
	if(file_exists($fullPath))
	{
		die('{"status_code":0, "error_description":"file already exist"}');
	}
	
	if($tailleFichier > $MAX_FILESIZE)
	{
		die('{"status_code":0, "error_description":"file too big"}');
	}
	
	if(!($mimetypeFichier == "audio/flac") && !($mimetypeFichier == "audio/x-flac"))
	{
		die('{"status_code":0, "error_description":"file is not a valid flac file"}');
	}
	
	if(move_uploaded_file($_FILES['file']['tmp_name'], $fullPath))
	{
		die('{"status_code":1}');
	}
	else
	{
		die('{"status_code":0, "error_description":"unable to move file"}');
	}
	
}
else
{
	die('{"status_code":0, "error_description":"upload error"}');
}

/* Libération des résultats */
$connexion = null;

?>