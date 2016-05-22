<?php

/*
    Dimitri DESSUS
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audio Windows 2016 - Audiosa
    
	Fichier: changepass.php
	Description: API permettant de changer le mot de passe du compte administrateur
*/

// Démarrage de la session
session_start();
// Spécification de l'en-tête HTTP en JSON
header('Content-Type: application/json');
// Importation des variables et fonctions globales
require("global_fonction.php");

/************************/
//		Variables		//
/************************/

// Vérification des arguments
if(!isset($_POST['pseudoPost']) || !isset($_POST['actualPasswordPost']) || !isset($_POST['newPasswordPost']) || !isset($_POST['confirmPasswordPost']))
{
	// Au moins un des arguments n'est pas définie
	write_error_to_log("API Changement mot de passe","Paramètres manquants, 'pseudoPost', 'actualPasswordPost', 'newPasswordPost' et/ou 'confirmPasswordPost'  ne sont pas renseignés");
	die('{"status_code":0,"error_description":"undeclared variables"}');
}

// Le nouveau mot de passe doit être égal à la confirmation 
if($_POST['newPasswordPost'] != $_POST['confirmPasswordPost'])
{
	// Les mots de passe sont différents
	die('{"status_code":0,"error_description":"passwords don\'t match"}');
}

/************************/
//		   MYSQL		//
/************************/

try 
{
	// Connexion à la base de données avec l'utilisateur "db_writer_music"
    $connexion = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME", $DB_WRITER_LOGIN, $DB_WRITER_PSW);
    
	// On vérifie si l'argument "newPasswordPost" est un hash MD5
    if(isValidMd5($_POST['newPasswordPost']))
	{
		// L'argument est bien un hash MD5
		$newPassword = $_POST['newPasswordPost'];
	}
	else
	{
		// L'argument n'est pas un hash MD5, on le calcul alors
		$newPassword = md5($_POST['newPasswordPost']);
	}
}
catch(PDOException $e)
{
	// Une erreur est survenue lors de la connexion à la base de données
	write_error_to_log("API Changement mot de passe","Connexion à la base de données impossible : " . $e->getMessage());
	die('{"status_code":0, "error_description":"connection to database failed"}');
}

/****************************/
// Verification utilisateur //
/****************************/

// On génére la commande SQL nous permettant de vérifier si l'utilisateur est 
// bien authentifié (le mot de passe et le nom d'utilisateur doivent correspondre)
$selectStatement = $connexion->prepare('SELECT COUNT(*) FROM utilisateur WHERE utilisateur.username = :username AND utilisateur.password = :password LIMIT 1');
$selectStatement->bindValue(':username', $_POST['pseudoPost'], PDO::PARAM_STR);
$selectStatement->bindValue(':password', $_POST['actualPasswordPost'], PDO::PARAM_STR);

// Execution de la commande SQL
if($selectStatement->execute())
{
	// Calcul du nombre de colonne retournée
	$nbr_ligne = $selectStatement->fetchColumn();
	
	// Si aucune colonne n'est retournée, le mot de passe et/ou
	// le nom d'utilisateur ne correspondent pas
	if($nbr_ligne <= 0)
	{
		die('{"status_code":0,"error_description":"username and/or password does not match"}');
	}
}
else
{
	// Une erreur est survenue lors de l'execution de la commande SQL
	$errorInfoArray = $selectStatement->errorInfo();
	write_error_to_log("API Changement mot de passe","Impossible d'exécuter la commande SQL (vérification utilisateur) : " . $errorInfoArray[2]);
	die('{"status_code":0,"error_description":"failed to execute select query"}');
}

/************************/
//    Changement Pass   //
/************************/

// On génére la commande SQL permettant de mettre à jour le mot de passe
$selectStatement = $connexion->prepare('UPDATE utilisateur SET utilisateur.password = :newpassword WHERE utilisateur.username = :username AND utilisateur.password = :password');
$selectStatement->bindValue(':newpassword', $newPassword, PDO::PARAM_STR);
$selectStatement->bindValue(':username', $_POST['pseudoPost'], PDO::PARAM_STR);
$selectStatement->bindValue(':password', $_POST['actualPasswordPost'], PDO::PARAM_STR);

// Execution de la commande SQL
if($selectStatement->execute())
{
	// La commande n'a renvoyée aucune erreur
	// On assigne le nouveau mot de passe à la variable de session
	$_SESSION['password'] 	= $newPassword;
	die ('{"status_code":1}');
}
else
{
	// Une erreur est survenue lors de l'execution de la commande SQL
	$errorInfoArray = $selectStatement->errorInfo();
	write_error_to_log("API Changement mot de passe","Impossible d'exécuter la commande SQL (changement mot de passe) : " . $errorInfoArray[2]);
	die('{"status_code":0,"error_description":"failed to execute update query"}');
}

// Cette fonction permet de vérifier si une string est un hash MD5
function isValidMd5($md5 ='')
{
	// En appliquant un masque REGEX à la string md5,
	// on retourne le resultat de la fonction
    return preg_match('/^[a-f0-9]{32}$/', $md5);
}

?>