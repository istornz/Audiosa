<?php

$ALLOWED_EXTENSION 	= 'flac';
$MAX_FILESIZE 		= 536870912; // 512Mb max

if(isset($_FILES['file']) && $_FILES['file']['error'] == 0)
{
	$extensionFichier 	= pathinfo(htmlentities($_FILES['file']['name']), PATHINFO_EXTENSION);
	$tailleFichier		= htmlentities($_FILES['file']['size']);
	$mimetypeFichier	= htmlentities($_FILES['file']['type']);
	$fullPath			= htmlentities('uploaded/' . $_FILES['file']['name']);
	
	if($extensionFichier != $ALLOWED_EXTENSION)
	{
		die('{"status":"error", "errorDescribe":"extension not authorized"}');
	}
	
	if(file_exists($fullPath))
	{
		die('{"status":"error", "errorDescribe":"file already exist"}');
	}
	
	if($tailleFichier > $MAX_FILESIZE)
	{
		echo '{"status":"error", "errorDescribe":"file too big"}';
		exit;
	}
	
	if($mimetypeFichier != "audio/flac")
	{
		die('{"status":"error", "errorDescribe":"file is not a valid flac file"}');
	}
	
	if(move_uploaded_file($_FILES['file']['tmp_name'], $fullPath))
	{
		die('{"status":"success"}');
	}
	
}
else
{
	die('{"status":"error", "errorDescribe":"upload error"}');
}

?>