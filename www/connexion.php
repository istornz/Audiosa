<?php

$DB_HOST	 	= "localhost";
$DB_NAME	 	= "audio_db";
$USER_LOGIN 	= "db_reader_user";
$USER_PSW		= "VpuCdvqjwNU3ce5T";

try 
{
    $dbh = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME", $USER_LOGIN, $USER_PSW);
    echo "Connected to database";
}
catch(PDOException $e)
{
	die("error");
    echo $e->getMessage();
}

?>