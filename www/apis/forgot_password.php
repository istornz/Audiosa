<?php

header('Content-Type: application/json');

include('conf.php');

/************************/
//		Variables		//
/************************/

if(!isset($_POST['mailPost']))
{
	die('{"status_code":0,"error_description":"undeclared variable"}');
}

/************************/
//		   MYSQL		//
/************************/

try 
{
    $connexion = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME", $DB_WRITER_LOGIN, $DB_WRITER_PSW);
	
	$mailQuoted	= $connexion->quote($_POST['mailPost']);
}
catch(PDOException $e)
{
	die('{"status_code":0, "error_description":"connection to database failed"}');
}

/****************************/
// 	     Demande pass    	//
/****************************/

$commande_SQL	= "SELECT COUNT(*) FROM UTILISATEUR WHERE UTILISATEUR.email=". $mailQuoted ." LIMIT 1";

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

?>