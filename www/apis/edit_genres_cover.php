<?php

/*
    Dimitri DESSUS
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audio Windows 2016 - Audiosa
    
	Fichier: edit_genres_cover.php
	Description: API permettant de modifier l'illustration des genres
*/

// Spécification de l'en-tête HTTP en JSON
header('Content-Type: application/json');
// Importation des variables et fonctions globales
require("global_fonction.php");

/************************/
//	    Variables		//
/************************/

// Déclarations des variables utiles
$ALLOWED_EXTENSION_COVER	= array('gif', 'png', 'jpg', 'jpeg'); // Formats autorisés
$MAX_FILESIZE_COVER 		= 3145728; // Taille de l'image : 3Mb maximum

// Vérification des arguments
if(!isset($_POST['pseudoPost']) || !isset($_POST['passwordPost']) || !isset($_POST['imageGenrePost']))
{
	// Au moins un des arguments n'est pas défini
	write_error_to_log("API Illustration Genres","Paramètres manquants, 'pseudoPost', 'passwordPost' et/ou 'imageGenrePost' ne sont pas renseignés");
	die('{"status_code":0,"error_description":"undeclared variables"}');
}

// Décodage de la string JSON 'imageGenrePost' en tableau 
$tableauImageGenre = json_decode($_POST['imageGenrePost']);

/************************/
//		   MYSQL		//
/************************/

try
{
	// Connexion à la base de données avec l'utilisateur "db_writer_music"
    $connexion = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME", $DB_WRITER_LOGIN, $DB_WRITER_PSW);
}
catch(PDOException $e)
{
	// Une erreur est survenue lors de la connexion à la base de données
	write_error_to_log("API Illustration Genres","Connexion à la base de données impossible : " . $e->getMessage());
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
	write_error_to_log("API Illustration Genres","Impossible d'exécuter la commande SQL (vérification utilisateur) : " . $errorInfoArray[2]);
	die('{"status_code":0,"error_description":"failed to execute query"}');
}

/************************/
//	      Upload     	//
/************************/

// Pour chaque élément dans le tableau '$tableauImageGenre'
// (pour chaque genres à modifier)
for($i = 0; $i < count($tableauImageGenre); $i++)
{
	// Récupération des informations concernant l'image
	$extensionFichier 	= pathinfo(htmlentities($_FILES[$tableauImageGenre[$i]]['name']), PATHINFO_EXTENSION); // Extension de l'image
	$tailleFichier		= htmlentities($_FILES[$tableauImageGenre[$i]]['size']); // Taille de l'image
	$mimetypeFichier	= htmlentities($_FILES[$tableauImageGenre[$i]]['type']); // Mimetype du fichier (sa nature)
	$fileName			= $_FILES[$tableauImageGenre[$i]]['name']; // Nom du fichier
	$fullPath			= htmlentities(COVER_GENRES_DIR . $fileName); // Définition du chemin ou l'image doit être déplacée
	
	// Vérification de l'extension en comparant avec le tableau des extensions autorisées
	if(!in_array($extensionFichier, $ALLOWED_EXTENSION_COVER))
	{
		// L'extension du fichier n'existe pas dans le tableau '$ALLOWED_EXTENSION_COVER'
		write_error_to_log("API Illustration Genres","Extension non autorisée ('" . $extensionFichier . "')");
		die('{"status_code":0, "error_description":"extension not authorized"}');
	}
	
	// Vérification de la taille du fichier
	if($tailleFichier > $MAX_FILESIZE_COVER)
	{
		// Le fichier est trop gros, il ne peut pas être mis en ligne
		write_error_to_log("API Illustration Genres","La taille du fichier ('" . $tailleFichier . "') est trop importante, maximum : '" . $MAX_FILESIZE_COVER . "')");
		die('{"status_code":0, "error_description":"file too big"}');
	}
	
	// Calcul taille de l'image
	if(getimagesize($_FILES[$tableauImageGenre[$i]]['tmp_name']) == 0)
	{
		// La valeur retournée est FALSE, donc le fichier n'est pas une image
		write_error_to_log("API Illustration Genres","La cover est invalide (le fichier n'est pas une image)");
		die('{"status_code":0, "error_description":"file is not a valid image file"}');
	}
	
	// Déplacement de l'image dans le dossier de stockage prévu à cet effet
	if(!move_uploaded_file($_FILES[$tableauImageGenre[$i]]['tmp_name'], $fullPath))
	{
		// Déplacement de l'image impossible
		write_error_to_log("API Illustration Genres","Impossible de déplacer le fichier au chemin : '" . $fullPath . "'");
		die('{"status_code":0, "error_description":"unable to move file"}');
	}
	
	/************************/
	//	      MYSQL      	//
	/************************/
	
	// On génére la commande SQL permettant de mettre à jour le nom de l'image dans la base de données
	$commandeSQLUpdate = "UPDATE `genres` SET `image` = '" . $_FILES[$tableauImageGenre[$i]]['name'] . "' WHERE idGENRES=". $tableauImageGenre[$i] .";";
	$updateStatement = $connexion->prepare(utf8_decode($commandeSQLUpdate));
	
	// Execution de la commande SQL
	if(!$updateStatement->execute())
	{
		// Une erreur est survenue lors de l'execution de la commande SQL
		$errorInfoArray = $updateStatement->errorInfo();
		write_error_to_log("API Illustration Genres","Impossible d'exécuter la commande SQL (update) : " . $errorInfoArray[2] . $commandeSQLUpdate);
		die('{"status_code":0,"error_description":"failed to update image name"}');
	}
}

// Si tout ce passe bien, on retourne un résultat positif via une string JSON
die ('{"status_code":1}');

?>