<?php

header('Content-Type: application/json');

/************************/
//	    Variables		//
/************************/

include('conf.php');
$ALLOWED_EXTENSION_COVER 	= array('gif', 'png', 'jpg', 'jpeg'); 
$MAX_FILESIZE_COVER 		= 3145728; // 3Mb max

if(!isset($_POST['pseudoPost']) || !isset($_POST['passwordPost']))
{
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
	die('{"status_code":0,"error_description":"unable to login"}');
}

/************************/
//  Edition metadonnee  //
/************************/

if(!isset($_POST['updateData']) || !isset($_POST['updateData']))
{
	die('{"status_code":0,"error_description":"undeclared variable"}');
}

$idPISTES			= intVal($_POST['idPISTES']);
$arrayUpdateColumn 	= json_decode($_POST['updateData'], true);
$arrayAlterColumn 	= json_decode($_POST['alterData'], true);

//print_r( $_POST );
//print_r( $_FILES );

if(isset($_FILES['cover']) && $_FILES['cover']['error'] == 0)
{
	$extensionFichier 	= pathinfo(htmlentities($_FILES['cover']['name']), PATHINFO_EXTENSION);
	$tailleFichier		= htmlentities($_FILES['cover']['size']);
	$mimetypeFichier	= htmlentities($_FILES['cover']['type']);
	$fullPath			= htmlentities('../img/covers/' . $_FILES['cover']['name']);
	
	if(!in_array($extensionFichier, $ALLOWED_EXTENSION_COVER))
	{
		die('{"status_code":0, "error_description":"extension not authorized"}');
	}
	
	if(file_exists($fullPath))
	{
		die('{"status_code":0, "error_description":"file already exist"}');
	}
	
	if($tailleFichier > $MAX_FILESIZE_COVER)
	{
		die('{"status_code":0, "error_description":"file too big"}');
	}
	
	if(getimagesize($_FILES['cover']['tmp_name']) == 0)
	{
		die('{"status_code":0, "error_description":"file is not a valid image file"}');
	}
	
	if(move_uploaded_file($_FILES['cover']['tmp_name'], $fullPath))
	{
		die('{"status_code":1}');
	}
	else
	{
		die('{"status_code":0, "error_description":"unable to move file"}');
	}
	
}

$commandeSQLAlter = "ALTER TABLE pistes";
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
	die('{"status_code":0,"error_description":"failed to alter table"}');	
}

$global_array = array_merge($arrayUpdateColumn, $arrayAlterColumn);

$commandeSQLUpdate = "UPDATE pistes SET ";
for($i = 0; $i < count($global_array); $i++)
{
	$commandeSQLUpdate .= $global_array[$i]['column'] . " = '" . $global_array[$i]['value'] . "'";
	
	if($i == count($global_array) - 1) // Avant dernier element
		$commandeSQLUpdate .= ";";
	else
		$commandeSQLUpdate .= ", ";
}

$updateStatement = $connexion->prepare($commandeSQLUpdate);

if(!$updateStatement->execute())
{
	die('{"status_code":0,"error_description":"failed to update metatag"}');
}

echo '{"status_code":1}';

?>