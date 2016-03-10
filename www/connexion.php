<?php

header('Content-Type: application/json');

$DB_HOST	 	= "localhost";
$DB_NAME	 	= "audio_db";
$USER_LOGIN 	= "db_reader_user";
$USER_PSW		= "VpuCdvqjwNU3ce5T";

/************************/
//		Variables		//
/************************/

if(!(isset($_POST['pseudoPost']) && isset($_POST['passwordPost'])))
{
	die('{"status_code":0,"error_description":"empty field"}');
}

/************************/
//		   MYSQL		//
/************************/

try 
{
    $connexion = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME", $USER_LOGIN, $USER_PSW);
	
	$pseudo		= $connexion->quote($_POST['pseudoPost']);
	$password	= $connexion->quote($_POST['passwordPost']);
}
catch(PDOException $e)
{
	die('{"status_code":0, "error_description":"connection to database failed"}');
}
							
/************************/
//		   JSON			//
/************************/

$commande_SQL 	= "SELECT COUNT(*) FROM UTILISATEUR WHERE UTILISATEUR.username='". $pseudo ."' AND UTILISATEUR.password='". md5($password) ."' LIMIT 1";

if($selectStatement = $connexion->query($commande_SQL))
{
	$nbr_ligne = $selectStatement->fetchColumn();
	if($nbr_ligne > 0)
	{
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