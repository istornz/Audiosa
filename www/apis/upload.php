<?php

/*
    Dimitri DESSUS
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audio Windows 2016 - Audiosa
    
	Fichier: upload.php
	Description: API permettant de mettre en ligne des musiques au format .flac
*/

// Spécification de l'en-tête HTTP en JSON
header('Content-Type: application/json');
// Importation des variables et fonctions globales
require("global_fonction.php");

/************************/
//	    Variables		//
/************************/

// Déclarations des variables utiles
$ALLOWED_EXTENSION 	= 'flac'; // Formats autorisés
$MAX_FILESIZE 		= 536870912; // Taille du fichier flac : 512Mb maximum

// Vérification des arguments
if(!isset($_POST['pseudoPost']) || !isset($_POST['passwordPost']))
{
	// Au moins un des arguments n'est pas défini
	write_error_to_log("API Importation","Paramètres manquants, 'pseudoPost' et/ou 'passwordPost' ne sont pas renseignés");
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
	write_error_to_log("API Importation","Connexion à la base de données impossible : " . $e->getMessage());
	die('{"status_code":0, "error_description":"connection to database failed"}');
}

/************************/
//	   Verifications 	//
/************************/

// On génére la commande SQL nous permettant de vérifier si l'utilisateur est 
// bien authentifié (le mot de passe et le nom d'utilisateur doivent correspondre)
$selectStatement = $connexion->prepare('SELECT COUNT(*) FROM utilisateur WHERE utilisateur.username = :username AND utilisateur.password = :password LIMIT 1');
$selectStatement->bindValue(':username', $_POST['pseudoPost'], PDO::PARAM_STR);
$selectStatement->bindValue(':password', $_POST['passwordPost'], PDO::PARAM_STR);

// Execution de la commande SQL
if($selectStatement->execute())
{
	// Calcul du nombre de colonne retournée
	$nbr_ligne = $selectStatement->fetchColumn();
	
	// Si aucune colonne n'est retournée, le mot de passe et/ou
	// le nom d'utilisateur ne correspondent pas
	if($nbr_ligne == 0)
	{
		die('{"status_code":0,"error_description":"username and/or password does not match"}');
	}
}
else
{
	// Une erreur est survenue lors de l'execution de la commande SQL
	$errorInfoArray = $selectStatement->errorInfo();
	write_error_to_log("API Importation","Impossible d'exécuter la commande SQL (connexion) : " . $errorInfoArray[2]);
	die('{"status_code":0,"error_description":"failed to execute query"}');
}

/************************/
//	       Upload     	//
/************************/

// Si la variable "$_FILES['file']" est définie et qu'il n'y a pas d'erreur,
// alors on procède à la mise en ligne
if(isset($_FILES['file']) && $_FILES['file']['error'] == 0)
{
	// Récupération des informations concernant le fichier
	$extensionFichier 	= pathinfo(htmlentities($_FILES['file']['name']), PATHINFO_EXTENSION); // Extension du fichier
	$tailleFichier		= htmlentities($_FILES['file']['size']); // Taille de la musique
	$mimetypeFichier	= htmlentities($_FILES['file']['type']); // Mimetype du fichier (sa nature)
	$fullPath			= htmlentities(UPLOAD_DIR . $_FILES['file']['name']); // Définition du chemin ou la musique doit être déplacée
	
	// Vérification de l'extension, l'extension autorisée est flac uniquement
	if($extensionFichier != $ALLOWED_EXTENSION)
	{
		// L'extension du fichier ne correspond pas à la valeur de '$ALLOWED_EXTENSION'
		write_error_to_log("API Importation","Extension non autorisée ('" . $extensionFichier . "')");
		die('{"status_code":0, "error_description":"extension not authorized"}');
	}
	
	// Vérification de la présence du fichier
	if(file_exists($fullPath))
	{
		// Le fichier est déjà présent, il est inutile de le déplacer à nouveau
		write_error_to_log("API Importation","Le fichier existe déjà (fichier : '" . $_FILES['file']['name'] . "')");
		die('{"status_code":0, "error_description":"file already exist"}');
	}
	
	// Vérification de la taille du fichier
	if($tailleFichier > $MAX_FILESIZE)
	{
		// Le fichier est trop gros, il ne peut pas être mis en ligne
		write_error_to_log("API Importation","La taille du fichier ('" . $tailleFichier . "') est trop importante, maximum : '" . $MAX_FILESIZE . "')");
		die('{"status_code":0, "error_description":"file too big"}');
	}
	
	// Vérification de la nature du fichier
	if(!($mimetypeFichier == "audio/flac") && !($mimetypeFichier == "audio/x-flac"))
	{
		// Le fichier mis en ligne n'est pas un fichier flac
		write_error_to_log("API Importation","Le mimetype du fichier est invalide (mimetype du fichier : '" . $mimetypeFichier . "')");
		die('{"status_code":0, "error_description":"file is not a valid flac file"}');
	}
	
	// Déplacement de la musique dans le dossier de stockage prévu à cet effet
	if(!move_uploaded_file($_FILES['file']['tmp_name'], $fullPath))
	{
		// Déplacement du fichier impossible
		write_error_to_log("API Importation","Impossible de déplacer le fichier au chemin : '" . $fullPath . "'");
		die('{"status_code":0, "error_description":"unable to move file"}');
	}
}
else
{
	// Une erreur est survenue lors de l'execution de la commande SQL
	write_error_to_log("API Importation","Une erreur est survenue lors de l'upload du fichier : '" . $_FILES['file']['name'] . "'");
	die('{"status_code":0, "error_description":"upload error"}');
}

// Si tout ce passe bien, on retourne un résultat positif via une string JSON
die ('{"status_code":1}');

?>