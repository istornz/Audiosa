<?php

header('Content-Type: application/json');

$ALLOWED_EXTENSION 	= 'flac';
$MAX_FILESIZE 		= 536870912; // 512Mb max

if(isset($_FILES['file']) && $_FILES['file']['error'] == 0)
{
	$extensionFichier 	= pathinfo(htmlentities($_FILES['file']['name']), PATHINFO_EXTENSION);
	$tailleFichier		= htmlentities($_FILES['file']['size']);
	$mimetypeFichier	= htmlentities($_FILES['file']['type']);
	$fullPath			= htmlentities('D:\uploaded\\' . $_FILES['file']['name']);
	
	if($extensionFichier != $ALLOWED_EXTENSION)
	{
		die('{"status_code":0, "error_description":"extension not authorized"}');
	}
	
	if(file_exists($fullPath))
	{
		die('{"status_code":0, "error_description":"file already exist"}');
	}
	
	if($tailleFichier > $MAX_FILESIZE)
	{
		echo '{"status_code":0, "error_description":"file too big"}';
		exit;
	}
	
	if(!($mimetypeFichier == "audio/flac") && !($mimetypeFichier == "audio/x-flac"))
	{
		die('{"status_code":0, "error_description":"file is not a valid flac file"}');
	}
	
	if(move_uploaded_file($_FILES['file']['tmp_name'], $fullPath))
	{
		die('{"status_code":1}');
	}
	
}
else
{
	die('{"status_code":0, "error_description":"upload error"}');
}

?>