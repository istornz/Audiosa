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
    $connexion = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME", $DB_READER_LOGIN, $DB_READER_PSW);
	
	$pseudoQuoted	= $connexion->quote($_POST['pseudoPost']);
	$passwordQuoted	= $connexion->quote($_POST['passwordPost']);
}
catch(PDOException $e)
{
	die('{"status_code":0, "error_description":"connection to database failed"}');
}
							
/************************/
//		   JSON			//
/************************/

$commande_SQL	= "SELECT COUNT(*) FROM UTILISATEUR WHERE UTILISATEUR.username=". $pseudoQuoted ." AND UTILISATEUR.password='". md5($_POST['passwordPost']) ."' LIMIT 1";

if($selectStatement = $connexion->query($commande_SQL))
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