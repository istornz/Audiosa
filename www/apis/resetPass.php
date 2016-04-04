<?php

header('Content-Type: application/json');

include('conf.php');

/************************/
//		Variables		//
/************************/

if(!isset($_POST['pseudoPost']) || !isset($_POST['actualPasswordPost']) || !isset($_POST['newPasswordPost']) || !isset($_POST['confirmPasswordPost']))
{
	die('{"status_code":0,"error_description":"undeclared variables"}');
}

if($_POST['newPasswordPost'] != $_POST['confirmPasswordPost'])
{
	die('{"status_code":0,"error_description":"passwords don\'t match"}');
}

/************************/
//		   MYSQL		//
/************************/

try 
{
    $connexion = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME", $DB_WRITER_LOGIN, $DB_WRITER_PSW);
	
	$pseudoQuoted	= $connexion->quote($_POST['pseudoPost']);
	$passwordQuoted	= $connexion->quote($_POST['actualPasswordPost']);
	$newPasswordQuoted	= $connexion->quote($_POST['newPasswordPost']);
}
catch(PDOException $e)
{
	die('{"status_code":0, "error_description":"connection to database failed"}');
}

/****************************/
// Verification utilisateur //
/****************************/

$commande_SQL	= "SELECT COUNT(*) FROM UTILISATEUR WHERE UTILISATEUR.username=". $pseudoQuoted ." AND UTILISATEUR.password=". $passwordQuoted ." LIMIT 1";

if($selectStatement = $connexion->query($commande_SQL))
{
	$nbr_ligne = $selectStatement->fetchColumn();
	
	if($nbr_ligne <= 0)
	{
		die('{"status_code":0,"error_description":"username and/or password does not match"}');
	}
}
else
{
	die('{"status_code":0,"error_description":"failed to execute select query"}');
}

/************************/
//    Changement Pass   //
/************************/

$commande_SQL	= "UPDATE UTILISATEUR SET UTILISATEUR.password = ". $newPasswordQuoted ." WHERE UTILISATEUR.username=". $pseudoQuoted ." AND UTILISATEUR.password=". $passwordQuoted ."";

if($connexion->query($commande_SQL))
{
	$_SESSION['pseudo'] 	= $_POST['pseudoPost'];
	$_SESSION['password'] 	= $_POST['newPasswordPost'];
	die ('{"status_code":1}');
}
else
{
	die('{"status_code":0,"error_description":"failed to execute update query"}');
}


?>