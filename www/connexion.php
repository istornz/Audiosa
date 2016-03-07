<?php

$DB_HOST	 	= "localhost";
$DB_NAME	 	= "audio_db";
$USER_LOGIN 	= "db_reade_user";
$USER_PSW		= "VpuCdvqjwNU3ce5T";

// Create connection
$conn = new mysqli($DB_HOST, 
					$USER_LOGIN, 
					$USER_PSW);

// Check connection
if ($conn->connect_error)
{
    die('{"error":"Impossible de se connecter", "errorMessage":"' . $conn->connect_error . '"}"');
} 
echo "Connected successfully";

?>