<?php

session_start();
header('Content-Type: application/json');

include('conf.php');

/************************/
//		Variables		//
/************************/

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
}
catch(PDOException $e)
{
	die('{"status_code":0, "error_description":"connection to database failed"}');
}
							
/************************/
//		   JSON			//
/************************/

$selectStatement = $connexion->prepare('SELECT COUNT(*) FROM UTILISATEUR WHERE UTILISATEUR.username = :username AND UTILISATEUR.password = :password LIMIT 1');
$selectStatement->bindValue(':username', $_POST['pseudoPost'], PDO::PARAM_STR);
$selectStatement->bindValue(':password', md5($_POST['passwordPost']), PDO::PARAM_STR);

if($selectStatement->execute())
{
	$nbr_ligne = $selectStatement->fetchColumn();
	
	if($nbr_ligne > 0)
	{
		$_SESSION['pseudo'] 	= $_POST['pseudoPost'];
		$_SESSION['password'] 	= md5($_POST['passwordPost']);
		echo '{"status_code":1}';
	}
	else
	{
		echo '{"status_code":0,"error_description":"username and/or password does not match"}';
	}
}
else
{
	echo '{"status_code":0,"error_description":"failed to execute query"}';
}

/* Libération des résultats */
$connexion = null;

?>