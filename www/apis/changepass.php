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
}
catch(PDOException $e)
{
	die('{"status_code":0, "error_description":"connection to database failed"}');
}

/****************************/
// Verification utilisateur //
/****************************/

$selectStatement = $connexion->prepare('SELECT COUNT(*) FROM UTILISATEUR WHERE UTILISATEUR.username = :username AND UTILISATEUR.password = :password LIMIT 1');
$selectStatement->bindValue(':username', $_POST['pseudoPost'], PDO::PARAM_STR);
$selectStatement->bindValue(':password', $_POST['actualPasswordPost'], PDO::PARAM_STR);

if($selectStatement->execute())
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

$selectStatement = $connexion->prepare('UPDATE UTILISATEUR SET UTILISATEUR.password = :newpassword WHERE UTILISATEUR.username = :username AND UTILISATEUR.password = :password');
$selectStatement->bindValue(':newpassword', $_POST['newPasswordPost'], PDO::PARAM_STR);
$selectStatement->bindValue(':username', $_POST['pseudoPost'], PDO::PARAM_STR);
$selectStatement->bindValue(':password', $_POST['actualPasswordPost'], PDO::PARAM_STR);

if($selectStatement->execute())
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