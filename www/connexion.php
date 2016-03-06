<?php

header('Content-Type: application/json');

$DB_HOST	 	= "localhost";
$DB_NAME	 	= "audio_db";
$USER_LOGIN 	= "db_reader_user";
$USER_PSW		= "VpuCdvqjwNU3ce5T";

/************************/
//		Variables		//
/************************/

if(!(isset($_POST['pseudo']) && isset($_POST['password'])))
{
	die('{"status_code":0,"status_describe":"user are not logged"}');
}

$pseudo		= mysql_real_escape_string($_POST['pseudo']);
$password	= mysql_real_escape_string($_POST['password']);

/************************/
//		   MYSQL		//
/************************/

$connexion = mysqli_connect($DB_HOST,
							$USER_LOGIN,
							$USER_PSW,
							$DB_NAME) or die('{"status_code":0,"status_describe":"connection to database failed"}'); 
							
/************************/
//		   JSON			//
/************************/

$commande_SQL 	= "SELECT username FROM UTILISATEURS WHERE UTILISATEURS.username='". $pseudo ."' AND UTILISATEURS.password='". md5($password) ."' LIMIT 1";
if($resultat = mysqli_query($connexion, $commande_SQL))
{
	$nbr_ligne = mysqli_num_rows($resultat);
	if($nbr_ligne > 0)
	{
		echo '{"status_code":1}';
	}
	else
	{
		$errorlog = "username and/or password doesn't match";
		echo '{"status_code":0,"error_description":"'. $errorlog .'"}';
	}
}
else
{
	$errorlog = "connection to database failed";
	echo '{"status_code":0,"status_describe":"'. $errorlog .'"}';
}

/* Libération des résultats */
mysqli_free_result($resultat);

mysqli_close ($connexion);

/*
try 
{
    $dbh = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME", $USER_LOGIN, $USER_PSW);
    die('{"success":"1"}');
}
catch(PDOException $e)
{
	die('{"success":"0", "errorMessage":"' . $e->getMessage() . '"}');
}
*/

?>