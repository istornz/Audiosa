<?php

header('Content-Type: application/json');

require("global_fonction.php");

/************************/
//		Variables		//
/************************/

if(!isset($_POST['pseudoPost']) || !isset($_POST['actualPasswordPost']) || !isset($_POST['newPasswordPost']) || !isset($_POST['confirmPasswordPost']))
{
	write_error_to_log("API Changement mot de passe","Paramètres manquants, 'pseudoPost', 'actualPasswordPost', 'newPasswordPost' et/ou 'confirmPasswordPost'  ne sont pas renseignés");
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
    
    if(isValidMd5($_POST['newPasswordPost']))
	{
		$newPassword = $_POST['newPasswordPost'];
	}
	else
	{
		$newPassword = md5($_POST['newPasswordPost']);
	}
}
catch(PDOException $e)
{
	write_error_to_log("API Changement mot de passe","Connexion à la base de données impossible : " . $e->getMessage());
	die('{"status_code":0, "error_description":"connection to database failed"}');
}

/****************************/
// Verification utilisateur //
/****************************/

$selectStatement = $connexion->prepare('SELECT COUNT(*) FROM utilisateur WHERE utilisateur.username = :username AND utilisateur.password = :password LIMIT 1');
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
	$errorInfoArray = $selectStatement->errorInfo();
	write_error_to_log("API Changement mot de passe","Impossible d'exécuter la commande SQL (vérification utilisateur) : " . $errorInfoArray[2]);
	die('{"status_code":0,"error_description":"failed to execute select query"}');
}

/************************/
//    Changement Pass   //
/************************/

$selectStatement = $connexion->prepare('UPDATE utilisateur SET utilisateur.password = :newpassword WHERE utilisateur.username = :username AND utilisateur.password = :password');
$selectStatement->bindValue(':newpassword', $newPassword, PDO::PARAM_STR);
$selectStatement->bindValue(':username', $_POST['pseudoPost'], PDO::PARAM_STR);
$selectStatement->bindValue(':password', $_POST['actualPasswordPost'], PDO::PARAM_STR);

if($selectStatement->execute())
{
	$_SESSION['pseudo'] 	= $_POST['pseudoPost'];
	$_SESSION['password'] 	= $newPassword;
	die ('{"status_code":1}');
}
else
{
	$errorInfoArray = $selectStatement->errorInfo();
	write_error_to_log("API Changement mot de passe","Impossible d'exécuter la commande SQL (changement mot de passe) : " . $errorInfoArray[2]);
	die('{"status_code":0,"error_description":"failed to execute update query"}');
}

function isValidMd5($md5 ='')
{
    return preg_match('/^[a-f0-9]{32}$/', $md5);
}

?>