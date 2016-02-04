<?php

// Extenion autorisé : .FLAC uniquement
$extensionAutorise = 'flac';
$MAX_FILESIZE = 6920600;

if(isset($_FILES['file']) && $_FILES['file']['error'] == 0)
{
	$extensionFichier 	= htmlentities($_FILES['file']['name']);
	$tailleFichier		= htmlentities($_FILES['file']['size']);
	$mimetypeFichier	= htmlentities($_FILES['file']['type']);
	$fullPath			= htmlentities('uploaded/' + $_FILES['file']['name']);
	
	if($extensionFichier != $extensionAutorise)
	{
		echo '{"status":"error: extension not authorized"}';
		exit;
	}
	
	if(file_exists($fullPath))
	{
		echo '{"status":"error: file already exist"}';
		exit;
	}
	/*
	if($tailleFichier > $MAX_FILESIZE)
	{
		echo '{"status":"error: file too big"}';
		exit;
	}
	*/
	if($mimetype != "audio/flac")
	{
		echo '{"status":"error: file is not a valid flac file"}';
		exit;
	}
	
	if(move_uploaded_file($_FILES['file']['tmp_name'], $fullPath)){
		echo '{"status":"success"}';
		exit;
	}
}

echo '{"status":"error: upload error"}';
exit;