<?php

header('Content-Type: application/json');

/************************/
//	    Variables		//
/************************/

require("global_fonction.php");
$ALLOWED_EXTENSION_COVER	= array('gif', 'png', 'jpg', 'jpeg'); 
$MAX_FILESIZE_COVER 		= 3145728; // 3Mb max

if(!isset($_POST['pseudoPost']) || !isset($_POST['passwordPost']) || !isset($_POST['idPISTES']) || !isset($_POST['updateData']) || !isset($_POST['alterData']))
{
	write_error_to_log("API Édition métadonnées","Paramètres manquants, 'pseudoPost', 'passwordPost', 'idPISTES', 'updateData' et/ou 'alterData' ne sont pas renseignés");
	die('{"status_code":0,"error_description":"undeclared variables"}');
}

/************************/
//		   MYSQL		//
/************************/

try
{
    $connexion = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME", $DB_WRITER_LOGIN, $DB_WRITER_PSW);
}
catch(PDOException $e)
{
	write_error_to_log("API Édition métadonnées","Connexion à la base de données impossible : " . $e->getMessage());
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
	$errorInfoArray = $selectStatement->errorInfo();
	write_error_to_log("API Édition métadonnées","Impossible d'exécuter la commande SQL (connexion) : " . $errorInfoArray[2]);
	die('{"status_code":0,"error_description":"unable to login"}');
}

/************************/
//  Edition metadonnee  //
/************************/

$idPISTES			= intVal($_POST['idPISTES']);
$arrayUpdateColumn 	= json_decode($_POST['updateData'], true);
$arrayAlterColumn 	= json_decode($_POST['alterData'], true);

$global_array 		= $arrayUpdateColumn;

if(isset($_FILES['cover']) && $_FILES['cover']['error'] == 0 && isset($_POST['md5']))
{
	$extensionFichier 	= pathinfo(htmlentities($_FILES['cover']['name']), PATHINFO_EXTENSION);
	$tailleFichier		= htmlentities($_FILES['cover']['size']);
	$mimetypeFichier	= htmlentities($_FILES['cover']['type']);
	$md5Fichier			= $_POST['md5'];
	$fileName			= $_POST['md5'] . "." . $extensionFichier;
	$fullPath			= htmlentities('../img/covers/' . $fileName);
	
	if(!in_array($extensionFichier, $ALLOWED_EXTENSION_COVER))
	{
		write_error_to_log("API Édition métadonnées","Extension non autorisée ('" . $extensionFichier . "')");
		die('{"status_code":0, "error_description":"extension not authorized"}');
	}
	
	if($tailleFichier > $MAX_FILESIZE_COVER)
	{
		write_error_to_log("API Édition métadonnées","La taille du fichier ('" . $tailleFichier . "') est trop importante, maximum : '" . $MAX_FILESIZE_COVER . "')");
		die('{"status_code":0, "error_description":"file too big"}');
	}
	
	if(getimagesize($_FILES['cover']['tmp_name']) == 0)
	{
		write_error_to_log("API Édition métadonnées","La cover est invalide (le fichier n'est pas une image)");
		die('{"status_code":0, "error_description":"file is not a valid image file"}');
	}
	
	if(!move_uploaded_file($_FILES['cover']['tmp_name'], $fullPath))
	{
		write_error_to_log("API Édition métadonnées","Impossible de déplacer le fichier au chemin : '" . $fullPath . "'");
		die('{"status_code":0, "error_description":"unable to move file"}');
	}
	
	array_push ($global_array, array("column"=>"cover", "value"=>$fileName));
	
}

if(count($arrayAlterColumn) > 0)
{
	$commandeSQLAlter = "ALTER TABLE pistes ";
	for($i = 0; $i < count($arrayAlterColumn); $i++)
	{
		$commandeSQLAlter .= "ADD COLUMN " . $arrayAlterColumn[$i]['column'] . " " . DEFAULT_MYSQL_TYPE;
		
		if($i == count($arrayAlterColumn) - 1) // Avant dernier element
			$commandeSQLAlter .= ";";
		else
			$commandeSQLAlter .= ", ";
	}
	
	$alterStatement = $connexion->prepare($commandeSQLAlter);
	
	if(!$alterStatement->execute())
	{
		$errorInfoArray = $selectStatement->errorInfo();
		write_error_to_log("API Édition métadonnées","Impossible d'exécuter la commande SQL (alter) : " . $errorInfoArray[2]);
		
		die('{"status_code":0,"error_description":"failed to alter table' . $connexion->errorInfo() . '"}');	
	}
	
	$global_array = array_merge($arrayUpdateColumn, $arrayAlterColumn);
}

if(count($global_array) > 0)
{
	$commandeSQLUpdate = "UPDATE pistes SET ";
	for($i = 0; $i < count($global_array); $i++)
	{
		$commandeSQLUpdate .= $global_array[$i]['column'] . " = '" . $global_array[$i]['value'] . "'";
		
		if($i == count($global_array) - 1) // Avant dernier element
			$commandeSQLUpdate .= " WHERE pistes.idPISTES=". $idPISTES .";";
		else
			$commandeSQLUpdate .= ", ";
	}
	
	$updateStatement = $connexion->prepare($commandeSQLUpdate);
	
	if(!$updateStatement->execute())
	{
		write_error_to_log("API Édition métadonnées","Impossible d'exécuter la commande SQL (update) : " . $errorInfoArray[2]);
		die('{"status_code":0,"error_description":"failed to update metatag"}');
	}
}

echo '{"status_code":1}';

?>