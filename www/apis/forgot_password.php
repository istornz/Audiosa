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

$commande_SQL	= "SELECT * FROM UTILISATEUR WHERE UTILISATEUR.email=". $mailQuoted ." LIMIT 1";

if($selectStatement = $connexion->query($commande_SQL))
{
	$nbr_ligne = $selectStatement->fetchColumn();
	$ligne = $selectStatement->fetch(PDO::FETCH_ASSOC);
	
	if($nbr_ligne <= 0)
	{
		die('{"status_code":0,"error_description":"no user with this email"}');
	}
	
	$passwordHash = $ligne['password'];
	
	if(!isset($_POST['hashpassMail']))
	{
		//Envoyer mail
		
		// Plusieurs destinataires
     $to  = 'iphoneretro@me.com'; // notez la virgule
	 $headers = "From: someone@your-website.com";
	 $test = mail($to,"PLS","SARCE",$headers);
		
		if($test)
		{
			die('{"status_code":0,"error_description":"OK"}');
		}
		else
		{
			die('{"status_code":0,"error_description":"PLS"}');
		}
		
	}
	
	if($passwordHash != $_POST['hashpassMail'])
	{
		die('{"status_code":0,"error_description":"unable to login"}');
	}
	
	// FORM DE CHANGEMENT
	
}
else
{
	die('{"status_code":0,"error_description":"failed to execute select query"}');
}

?>