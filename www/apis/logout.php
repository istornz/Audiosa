<?php

/*
    Dimitri DESSUS
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audio Windows 2016 - Audiosa
    
	Fichier: logout.php
	Description: API permettant de détruire la session actuelle
*/

// Démarrage de la session
session_start();
// Spécification de l'en-tête HTTP en JSON
header('Content-Type: application/json');
// Destruction des variables de session
session_unset();
// Destruction de la session
session_destroy();

// On affiche le succès de l'opération
die ('{"status_code":1}');

?>