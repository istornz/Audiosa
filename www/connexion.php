<?php

$DB_HOST	 	= "localhost";
$DB_NAME	 	= "audio_db";
$USER_LOGIN 	= "db_reader_user";
$USER_PSW		= "VpuCdvqjwNU3ce5T";

$link = mysql_connect($DB_HOST, $USER_LOGIN, $USER_PSW);
if (!$link) {
    die('Connexion impossible : ' . mysql_error());
}
echo 'Connecté correctement';
mysql_close($link);

?>