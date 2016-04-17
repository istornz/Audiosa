<?php

session_start();
header('Content-Type: application/json');

require("global_fonction.php");

/************************/
//		Variables		//
/************************/

if(!isset($_POST['pseudoPost']) || !isset($_POST['passwordPost']))
{
	write_error_to_log("API Connexion","Paramètres manquants, 'pseudoPost' et/ou 'passwordPost' ne sont pas renseignés");
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
	write_error_to_log("API Connexion","Connexion à la base de données impossible : " . $e->getMessage());
	die('{"status_code":0, "error_description":"connection to database failed"}');
}
							
/************************/
//		   JSON			//
/************************/

$selectStatement = $connexion->prepare('SELECT COUNT(*) FROM utilisateur WHERE utilisateur.username = :username AND utilisateur.password = :password LIMIT 1');
$selectStatement->bindValue(':username', $_POST['pseudoPost'], PDO::PARAM_STR);
$selectStatement->bindValue(':password', md5($_POST['passwordPost']), PDO::PARAM_STR);

if($selectStatement->execute())
{
	$nbr_ligne = $selectStatement->fetchColumn();
	
	if($nbr_ligne > 0)
	{
		$_SESSION['pseudo'] 	= $_POST['pseudoPost'];
		$_SESSION['password'] 	= md5($_POST['passwordPost']);
		die('{"status_code":1}');
	}
	else
	{
		die('{"status_code":0,"error_description":"username and/or password does not match"}');
	}
}
else
{
	$errorInfoArray = $selectStatement->errorInfo();
	write_error_to_log("API Connexion","Impossible d'exécuter la commande SQL (connexion) : " . $errorInfoArray[2]);
	die('{"status_code":0,"error_description":"failed to execute query"}');
}

/* Libération des résultats */
$connexion = null;

?>