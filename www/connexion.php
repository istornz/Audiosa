<?php

$DB_HOST	 	= "localhost";
$DB_NAME	 	= "audio_db";
$USER_LOGIN 	= "db_reader_user";
$USER_PSW		= "VpuCdvqjwNU3ce5T";

try {
    $dbh = new PDO('mysql:host=localhost;dbname=test', $USER_LOGIN, $USER_PSW);
    foreach($dbh->query('SELECT * from UTILISATEURS') as $row) {
        print_r($row);
    }
    $dbh = null;
} catch (PDOException $e) {
    print "Erreur !: " . $e->getMessage() . "<br/>";
    die();
}

?>