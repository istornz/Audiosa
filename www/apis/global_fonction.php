<?php

require("conf.php");

//write_error_to_log("API concernée","Erreur à log");

function write_error_to_log($titre, $error) {
	
	$fileopen=(fopen(ERROR_LOG_FILE,'a'));
	
	fwrite($fileopen, "[".date("d/m/Y H:i:s")."]\t[$titre]\t$error\r\n");
	
	fclose($fileopen);
}
?>