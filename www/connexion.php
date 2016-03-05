<?php

header('Content-Type: application/json');

$DB_HOST	 	= "localhost";
$DB_NAME	 	= "audio_db";
$USER_LOGIN 	= "db_reader_user";
$USER_PSW		= "VpuCdvqjwNU3ce5T";

try 
{
    $dbh = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME", $USER_LOGIN, $USER_PSW);
    die('{"success":"1"}');
}
catch(PDOException $e)
{
	die('{"success":"0", "errorMessage":"' . $e->getMessage() . '"}');
}

?>