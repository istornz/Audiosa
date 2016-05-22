<?php

/*
    Dimitri DESSUS et Rayane MOHAMED BEN-ALI
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audio Windows 2016 - Audiosa
    
	Fichier: conf.php
	Description: Fichier PHP contenant les variables globales
*/

$DB_HOST	 	= "localhost";
$DB_NAME	 	= "audio_db";

$DB_READER_USER_LOGIN 	= "db_reader_user";
$DB_READER_USER_PSW		= "VpuCdvqjwNU3ce5T";

$DB_READER_MUSIC_LOGIN 	= "db_reader_music";
$DB_READER_MUSIC_PSW	= "qsZuJe6hruAm9nBs";

$DB_WRITER_LOGIN 	= "db_writer_music";
$DB_WRITER_PSW		= "5VHKUmhKrsSspmjs";

define("ERROR_LOG_FILE", "../error.log");
define("DEFAULT_MYSQL_TYPE", "VARCHAR(150)");
define("UPLOAD_DIR", "D:\\uploaded\\");
define("COVER_DIR", "D:\\covers\\");
define("COVER_GENRES_DIR", "D:\\covers_genres\\");

?>