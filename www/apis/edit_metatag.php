<?php

/*
    Dimitri DESSUS
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audio Windows 2016 - Audiosa
    
	Fichier: edit_metatag.php
	Description: API permettant d'éditer les métadonnées d'une musique
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
if(!isset($_POST['pseudoPost']) || !isset($_POST['passwordPost']) || !isset($_POST['idPISTES']) || !isset($_POST['updateData']) || !isset($_POST['alterData']))
{
	// Au moins un des arguments n'est pas définie
	write_error_to_log("API Édition métadonnées","Paramètres manquants, 'pseudoPost', 'passwordPost', 'idPISTES', 'updateData' et/ou 'alterData' ne sont pas renseignés");
	die('{"status_code":0,"error_description":"undeclared variables"}');
}

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
	write_error_to_log("API Édition métadonnées","Connexion à la base de données impossible : " . $e->getMessage());
	die('{"status_code":0, "error_description":"connection to database failed"}');
}

/************************/
//	   Verifications 	//
/************************/

// On génére la commande SQL nous permettant de vérifier si l'utilisateur est 
// bien authentifié (le mot de passe et le nom d'utilisateur doivent correspondre)
$selectStatement = $connexion->prepare('SELECT COUNT(*) FROM `utilisateur` WHERE utilisateur.username = :username AND utilisateur.password = :password LIMIT 1');
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
	write_error_to_log("API Édition métadonnées","Impossible d'exécuter la commande SQL (connexion) : " . $errorInfoArray[2]);
	die('{"status_code":0,"error_description":"unable to login"}');
}

/************************/
//  Edition metadonnee  //
/************************/

// Récupération des arguments
$idPISTES			= intVal($_POST['idPISTES']); // Identifiant de la musique concernée par l'édition
$arrayUpdateColumn 	= json_decode($_POST['updateData'], true); // Décodage de la string JSON 'updateData' en tableau (contient les métadonnées à mettre à jour)  
$arrayAlterColumn 	= json_decode($_POST['alterData'], true); // Décodage de la string JSON 'alterData' en tableau (contient les métadonnées à ajouter)  

// Déclaration d'un tableau global contenant premièrement les métadonnées à mettre à jour
$global_array 		= $arrayUpdateColumn;

// Si la variable "$_FILES['cover']" est définie, alors l'illustration de la musique est à modifier
if(isset($_FILES['cover']) && $_FILES['cover']['error'] == 0 && isset($_POST['md5']))
{
	// Récupération des informations concernant l'image
	$extensionFichier 	= pathinfo(htmlentities($_FILES['cover']['name']), PATHINFO_EXTENSION); // Extension de l'image
	$tailleFichier		= htmlentities($_FILES['cover']['size']); // Taille de l'image
	$mimetypeFichier	= htmlentities($_FILES['cover']['type']); // Mimetype du fichier (sa nature)
	$fileName			= $_POST['md5'] . "." . $extensionFichier; // Nom de l'illustration d'album
	$fullPath			= htmlentities(COVER_DIR . $fileName); // Définition du chemin ou l'image doit être déplacée
	
	// Vérification de l'extension en comparant avec le tableau des extensions autorisées
	if(!in_array($extensionFichier, $ALLOWED_EXTENSION_COVER))
	{
		// L'extension du fichier n'existe pas dans le tableau '$ALLOWED_EXTENSION_COVER'
		write_error_to_log("API Édition métadonnées","Extension non autorisée ('" . $extensionFichier . "')");
		die('{"status_code":0, "error_description":"extension not authorized"}');
	}
	
	// Vérification de la taille du fichier
	if($tailleFichier > $MAX_FILESIZE_COVER)
	{
		// Le fichier est trop gros, il ne peut pas être mis en ligne
		write_error_to_log("API Édition métadonnées","La taille du fichier ('" . $tailleFichier . "') est trop importante, maximum : '" . $MAX_FILESIZE_COVER . "')");
		die('{"status_code":0, "error_description":"file too big"}');
	}
	
	// Calcul taille de l'image
	if(getimagesize($_FILES['cover']['tmp_name']) == 0)
	{
		// La valeur retournée est FALSE, donc le fichier n'est pas une image
		write_error_to_log("API Édition métadonnées","La cover est invalide (le fichier n'est pas une image)");
		die('{"status_code":0, "error_description":"file is not a valid image file"}');
	}
	
	// Déplacement de l'image dans le dossier de stockage prévu à cet effet
	if(!move_uploaded_file($_FILES['cover']['tmp_name'], $fullPath))
	{
		// Déplacement de l'image impossible
		write_error_to_log("API Édition métadonnées","Impossible de déplacer le fichier au chemin : '" . $fullPath . "'");
		die('{"status_code":0, "error_description":"unable to move file"}');
	}
	
	// Ajout de la métadonnée "nom de l'image" dans le tableau global "$global_array"
	$global_array[] = array("column"=>"cover", "value"=>$fileName);
}

// Si le tableau "$arrayAlterColumn" (contenant les métadonnées à ajouter dans la base de données) n'est pas vide
if(count($arrayAlterColumn) > 0)
{
	// Génération de la commande SQL permettant d'ajouter de nouvelles colonne.
	$commandeSQLAlter = "ALTER TABLE `pistes` ";
	
	// Pour chaque métadonnées dans le tableau "$arrayAlterColumn"
	for($i = 0; $i < count($arrayAlterColumn); $i++)
	{
		// Concaténation de la commande
		// Pour chaque colonne, on ajoute ici "ADD COLUMN 'NOM_DE_LA_METADONNEE' VARCHAR(160)"
		$commandeSQLAlter .= "ADD COLUMN `" . $arrayAlterColumn[$i]['column'] . "` " . DEFAULT_MYSQL_TYPE;
		
		if($i == count($arrayAlterColumn) - 1) // Vérification avant dernier element du tableau
			$commandeSQLAlter .= ";"; // On termine la commande SQL
		else
			$commandeSQLAlter .= ", "; // On continu l'ajout de nouvelle colonne
	}
	
	$alterStatement = $connexion->prepare(utf8_decode($commandeSQLAlter));
	
	// Execution de la commande SQL
	if(!$alterStatement->execute())
	{
		// Une erreur est survenue lors de l'execution de la commande SQL
		$errorInfoArray = $alterStatement->errorInfo();
		write_error_to_log("API Édition métadonnées","Impossible d'exécuter la commande SQL (alter) : " . $errorInfoArray[2]);
		
		die('{"status_code":0,"error_description":"failed to alter table"}');	
	}
	
	// Fusion des tableaux "$arrayUpdateColumn" et "$arrayAlterColumn"
	// On stock le resultat de la fusion dans le tableau global "$global_array"
	$global_array = array_merge($arrayUpdateColumn, $arrayAlterColumn);
}

// Si le tableau "$global_array" (contenant les toutes les métadonnées) n'est pas vide
if(count($global_array) > 0)
{
	// Génération de la commande SQL permettant de modifier les métadonnées.
	$commandeSQLUpdate = "UPDATE `pistes` SET ";
	
	// Pour chaque métadonnées dans le tableau "$global_array"
	for($i = 0; $i < count($global_array); $i++)
	{
		// On verifie si le titre de la métadonnée est égale à "genre".
		// Si tel est le cas alors cela signifie que le genre à été modifié par l'utilisateur,
		// il faut donc ajouter dans la table "genres" le nouveau genre ou alors récupérer son identifiant.
		if($global_array[$i]['column'] == "genre")
		{
			// Génération de la commande SQL permettant d'ajouter le genre dans la base de données UNIQUEMENT si celui-ci n'est pas présent
			$commandeSQLInsert = "INSERT INTO `genres` (nom) SELECT ". $connexion->quote($global_array[$i]['value']) . " FROM `genres` WHERE NOT EXISTS (SELECT `idGENRES` FROM `genres` WHERE nom=". $connexion->quote($global_array[$i]['value']) . ") LIMIT 1";
			$insertStatement = $connexion->prepare(utf8_decode($commandeSQLInsert));
			
			// Execution de la commande SQL
			if($insertStatement->execute())
			{
				// Détermination du nombre de ligne affectée par la commande précèdente
				$ligne_affecte = $insertStatement->rowCount();
				
				if($ligne_affecte == 1)
				{
					// Le genre à été ajouté dans la base de données
					// On récupère ainsi l'identifiant de la dernière ligne insérée
					$idGENRES = $connexion->lastInsertId();
				}
				else
				{
					// Le genre existe déjà dans la base, on récupère son identifiant via une autre commande SQL
					$commandeSQLSelect = "SELECT `idGENRES` FROM `genres` WHERE nom=". $connexion->quote($global_array[$i]['value']) ." LIMIT 1";
					$selectStatement = $connexion->prepare(utf8_decode($commandeSQLSelect));
					
					// Execution de la commande SQL
					if($selectStatement->execute())
					{
						// Récupération de l'identifiant du genre
						$ligne = $selectStatement->fetch(PDO::FETCH_ASSOC);
						$idGENRES = $ligne['idGENRES'];
					}
					else
					{
						// Une erreur est survenue lors de l'execution de la commande SQL
						write_error_to_log("API Édition métadonnées","Impossible d'exécuter la commande SQL (select genre id) : " . $errorInfoArray[2]);
						die('{"status_code":0,"error_description":"failed to select genre id"}');
					}
				}
				
				// Génération de la commande SQL permettant de mettre à jour l'identifiant du genre pour la piste éditée
				$commandeSQLUpdateGenre = "UPDATE `pistes` SET `genre`=". $idGENRES ." WHERE idPISTES=". $idPISTES;
				$updateGenreStatement = $connexion->prepare($commandeSQLUpdateGenre);
				
				// Execution de la commande SQL
				if(!$updateGenreStatement->execute())
				{
					// Une erreur est survenue lors de l'execution de la commande SQL
					write_error_to_log("API Édition métadonnées","Impossible d'exécuter la commande SQL (update genre id) : " . $errorInfoArray[2]);
					die('{"status_code":0,"error_description":"failed to update genre id"}');
				}
				
			}
			else
			{
				// Une erreur est survenue lors de l'execution de la commande SQL
				write_error_to_log("API Édition métadonnées","Impossible d'exécuter la commande SQL (insert genre) : " . $errorInfoArray[2]);
				die('{"status_code":0,"error_description":"failed to insert genre"}');
			}
		}
		else
		{
			// Pour toute les autres métadonnées différentes de "genre"
			
			// Concaténation de la string "$commandeSQLUpdate" (début de la commande déclarée plus haut)
			// On ajoute toutes les métadonnées à mettre à jour
			$commandeSQLUpdate .= "`" . $global_array[$i]['column'] . "` = " . $connexion->quote($global_array[$i]['value']);
		
			if($i == count($global_array) - 1) // Avant dernier element du tableau "$global_array"
			{
				// Conclusion de la commande SQL
				$commandeSQLUpdate .= " WHERE idPISTES=". $idPISTES .";";
				$updateStatement = $connexion->prepare(utf8_decode($commandeSQLUpdate));
				
				// Execution de la commande SQL
				if(!$updateStatement->execute())
				{
					// Une erreur est survenue lors de l'execution de la commande SQL
					$errorInfoArray = $updateStatement->errorInfo();
					write_error_to_log("API Édition métadonnées","Impossible d'exécuter la commande SQL (update) : " . $errorInfoArray[2] . $commandeSQLUpdate);
					die('{"status_code":0,"error_description":"failed to update metatag"}');
				}
			}
			else
			{
				// Le parcours du tableau n'est pas terminé, on ajoute donc une ","
				// permettant ainsi d'ajouter de nouvelle métadonnée
				$commandeSQLUpdate .= ", ";
			}
		}
	}
}

// Si tout ce passe bien, on retourne un résultat positif via une string JSON
die ('{"status_code":1}');

?>