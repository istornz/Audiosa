<?php

/*
    Dimitri DESSUS
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audio Windows 2016 - Audiosa
    
	Fichier: forgot_password.php
	Description: API permettant de modifier le mot de passe en cas d'oublie
*/

// Spécification de l'en-tête HTTP en HTML
header('Content-Type: text/html');
// Importation des variables et fonctions globales
require("global_fonction.php");

/************************/
//		Variables		//
/************************/

// Vérification de l'argument "mail"
if(!isset($_GET['mail']))
{
	// L'argument n'est pas défini
	write_error_to_log("API Mot de passe oublié","Paramètre manquant, 'mail' n'est pas renseigné");
	die('{"status_code":0,"error_description":"undeclared variable"}');
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
	write_error_to_log("API Mot de passe oublié","Connexion à la base de données impossible : " . $e->getMessage());
	die('{"status_code":0, "error_description":"connection to database failed"}');
}

/****************************/
// 	     Demande pass    	//
/****************************/

// Génération de la commande SQL permettant de vérifier si l'adresse email correspond à un utilisateur
$selectStatement = $connexion->prepare('SELECT * FROM utilisateur WHERE utilisateur.email = :mail LIMIT 1');
$selectStatement->bindValue(':mail', $_GET['mail'], PDO::PARAM_STR);

// Execution de la commande SQL
if($selectStatement->execute())
{
	// Récupération de la ligne
	$ligne = $selectStatement->fetch(PDO::FETCH_ASSOC);
	
	// Calcul du nombre de ligne retournée
	// array_filter() permet de supprimer les élements vides du tableau "$ligne"
	$nbr_ligne = count(array_filter($ligne));
	
	if($nbr_ligne == 0)
	{
		// Aucune ligne retournée, l'adresse mail ne correspond donc avec aucun utilisateur
		die('{"status_code":0,"error_description":"no user with this email"}');
	}
	
	// Récupération du mot de passe (hash MD5)
	$passwordHash = $ligne['password'];
	
	if(!isset($_GET['hashpass']))
	{
		// L'argument "hashpass" n'est pas définie, l'utilisateur demande donc qu'on lui envoie un mail
		// On constitue le lien de réinitialisation contenant le mot de passe MD5 et l'adresse mail du compte
		$resetLinkURL 	= "http://172.16.126.170/apis/forgot_password.php?hashpass=" . $passwordHash . "&mail=" . $_GET['mail'];
		
		// Destinataire du mail
		$to  			= $_GET['mail'];
		
		$titre 			= "Réinitialisation mot de passe Audiosa";
		
		// Concaténation du corps
		$corps 			= '<p>Vous avez demandé le changement de votre mot de passe sur Audiosa</p>';
		$corps  		.= '<p>Veuillez cliquer sur le lien ci-dessous : </p>';
		$corps  		.= '<a href="'. $resetLinkURL .'" target="_blank">Réinitialiser le mot de passe</a>';
		
		// Concaténation de l'en-tête du mail
		// Cette partie est invisible, elle sera lue par le logiciel de messagerie
		$headers 		= "From: Audiosa\r\n";
		$headers 		.= "Reply-To: ". strip_tags($_GET['mail']) . "\r\n";
		$headers 		.= "MIME-Version: 1.0\r\n";
		$headers 		.= "Content-Type: text/html; charset=ISO-8859-1\r\n";
		
		// Envoie du mail
		// Le mail est ensuite traité et envoyé via le logiciel "fake sendmail"
		if(mail($to, $titre, $corps, $headers))
		{
			// Le mail à bien été envoyé
			die('{"status_code":1}');
		}
		else
		{
			// Une erreur est survenue lors de l'envoie du mail
			write_error_to_log("API Mot de passe oublié","Impossible d'envoyer l'email de réinitialisation");
			die('{"status_code":0,"error_description":"mail not sent"}');
		}
	}
	
	// Comparaison du hash récupéré précedement (base de données) avec l'argument récupéré en GET ("hashpass")
	if($passwordHash != $_GET['hashpass'])
	{
		// Les 2 hash MD5 ne correspondent pas
		die('{"status_code":0,"error_description":"unable to login"}');
	}
	
	// Affichage d'un formulaire HTML permettant à l'utilisateur de changer son mot de passe
	echo '<form id="formChangerMotDePassePopup" method="POST" action="changepass.php">
			<input type="hidden" name="pseudoPost" id="pseudoName-text" value="'. $ligne['username'] .'">
			<input type="hidden" name="actualPasswordPost" id="pseudoName-text" value="'. $_GET['hashpass'] .'">
			<input placeholder="Nouveau mot de passe" name="newPasswordPost" id="newPassword-text" type="text">
			<input placeholder="Confirmation" name="confirmPasswordPost" id="confirmPassword-text" type="password">
			<br/><br/>
			<input type="submit" value="Changer le mot de passe" />
		</form>';
}
else
{
	// Une erreur est survenue lors de l'execution de la commande SQL
	$errorInfoArray = $selectStatement->errorInfo();
	write_error_to_log("API Mot de passe oublié","Impossible d'exécuter la commande SQL (selection password) : " . $errorInfoArray[2]);
	die('{"status_code":0,"error_description":"failed to execute select query"}');
}

?>