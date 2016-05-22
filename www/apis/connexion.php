<?php

/*
    Dimitri DESSUS
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audio Windows 2016 - Audiosa
    
	Fichier: connexion.php
	Description: API permettant à l'utilisateur de se connecter au serveur
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
if(!isset($_POST['pseudoPost']) || !isset($_POST['passwordPost']))
{
	// Au moins un des arguments n'est pas définie
	write_error_to_log("API Connexion","Paramètres manquants, 'pseudoPost' et/ou 'passwordPost' ne sont pas renseignés");
	die('{"status_code":0,"error_description":"undeclared variables"}');
}

/************************/
//		   MYSQL		//
/************************/

try 
{
	// Connexion à la base de données avec l'utilisateur "db_reader_user"
    $connexion = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME", $DB_READER_USER_LOGIN, $DB_READER_USER_PSW);
}
catch(PDOException $e)
{
	// Une erreur est survenue lors de la connexion à la base de données
	write_error_to_log("API Connexion","Connexion à la base de données impossible : " . $e->getMessage());
	die('{"status_code":0, "error_description":"connection to database failed"}');
}
							
/************************/
//		   JSON			//
/************************/

// On génére la commande SQL nous permettant de vérifier si l'utilisateur est 
// bien authentifié (le mot de passe et le nom d'utilisateur doivent correspondre)
$selectStatement = $connexion->prepare('SELECT COUNT(*) FROM utilisateur WHERE utilisateur.username = :username AND utilisateur.password = :password LIMIT 1');
$selectStatement->bindValue(':username', $_POST['pseudoPost'], PDO::PARAM_STR);
$selectStatement->bindValue(':password', md5($_POST['passwordPost']), PDO::PARAM_STR);

// Execution de la commande SQL
if($selectStatement->execute())
{
	// Calcul du nombre de colonne retournée
	$nbr_ligne = $selectStatement->fetchColumn();
	
	// Si le nombre de colonne est suppérieur à 0, l'utilisateur est alors connecté
	if($nbr_ligne > 0)
	{
		// On assigne le pseudo et le mot de passe aux variables de session
		$_SESSION['pseudo'] 	= $_POST['pseudoPost'];
		$_SESSION['password'] 	= md5($_POST['passwordPost']);
		die('{"status_code":1}');
	}
	else
	{
		// Le mot de passe et/ou le nom d'utilisateur ne correspondent pas
		die('{"status_code":0,"error_description":"username and/or password does not match"}');
	}
}
else
{
	// Une erreur est survenue lors de l'execution de la commande SQL 
	$errorInfoArray = $selectStatement->errorInfo();
	write_error_to_log("API Connexion","Impossible d'exécuter la commande SQL (connexion) : " . $errorInfoArray[2]);
	die('{"status_code":0,"error_description":"failed to execute query"}');
}

?>