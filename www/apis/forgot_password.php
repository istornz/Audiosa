<?php

header('Content-Type: text/html');

include('conf.php');

/************************/
//		Variables		//
/************************/

if(!isset($_GET['mail']))
{
	die('{"status_code":0,"error_description":"undeclared variable"}');
}

if(!filter_var( $_GET['mail'], FILTER_VALIDATE_EMAIL ))
{
	die('{"status_code":0,"error_description":"mail not valid"}');
}

/************************/
//		   MYSQL		//
/************************/

try 
{
    $connexion = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME", $DB_WRITER_LOGIN, $DB_WRITER_PSW);
	
	$mailQuoted	= $connexion->quote($_GET['mail']);
}
catch(PDOException $e)
{
	die('{"status_code":0, "error_description":"connection to database failed"}');
}

/****************************/
// 	     Demande pass    	//
/****************************/

$commande_SQL	= "SELECT * FROM UTILISATEUR WHERE UTILISATEUR.email=". $mailQuoted ." LIMIT 1";

if($selectStatement = $connexion->query($commande_SQL))
{
	$ligne = $selectStatement->fetch(PDO::FETCH_ASSOC);
	$nbr_ligne = count($ligne);
	
	if($nbr_ligne == 1)
	{
		die('{"status_code":0,"error_description":"no user with this email"}');
	}
	
	$passwordHash = $ligne['password'];
	
	if(!isset($_GET['hashpass']))
	{
		//Envoyer mail
		$resetLinkURL = "http://172.16.126.70/apis/forgot_password.php?hashpass=" . $passwordHash . "&mail=" . $_GET['mail'];
		$to  = $_GET['mail'];
		$titre = "Rénitialisation mot de passe Audiosa";
		$corps  = '<p>Vous avez demandé le changement de votre mot de passe sur Audiosa</p>';
		$corps  .= '<p>Veuillez clicker sur le lien ci-dessous : </p>';
		$corps  .= '<a href="'. $resetLinkURL .'" target="_blank">Go to this page</a>';
		$headers = "From: Audiosa\r\n";
		$headers .= "Reply-To: ". strip_tags($_GET['mail']) . "\r\n";
		$headers .= "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
		
		if(mail($to, $titre, $corps, $headers))
			die('{"status_code":1}');
		else
			die('{"status_code":0,"error_description":"mail not sent"}');
		
	}
	
	if($passwordHash != $_GET['hashpass'])
	{
		die('{"status_code":0,"error_description":"unable to login"}');
	}
	
	echo '<form id="formChangerMotDePassePopup" method="POST" action="changepass.php">
			<input type="hidden" name="pseudoPost" id="pseudoName-text" value="'. $ligne['username'] .'">
			<input type="hidden" name="actualPasswordPost" id="pseudoName-text" value="'. $_GET['hashpass'] .'">
			<input placeholder="Nouveau mot de passe" name="newPasswordPost" id="newPassword-text" value="" type="text">
			<input placeholder="Confirmation" name="confirmPasswordPost" id="confirmPassword-text" value="" type="text">
			<br/>
			<input type="submit" value="Changer le mot de passe"/>
		</form>';
}
else
{
	die('{"status_code":0,"error_description":"failed to execute select query"}');
}

?>