/*
    Dimitri DESSUS et Rayane MOHAMED BEN-ALI
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audio Windows 2016 - Audiosa
    
	Fichier: global.js
	Description: Fonctions/variables globales nécessaires au bon fonctionnement des scripts
*/

elementProgress			= null;
pseudo					= null;
passwordHash			= null;
stateLogLoading			= false;
stateIllustrerLoading	= false;
customMetatag			= 0;
currentMetatag			= 0;
idPisteEdit				= null;
md5PisteEdit			= null;
soundDisplayed			= false;
ddate					= new Date();

// Permet de flouter l'arrière plan du site
function blurAction(state, div) {
    if (state == 1) div.className = "fullPageBlurred";
    else div.className = "";
}

// Désactivation de l'interraction pour l'arrière plan
$(window).on('popupbeforeposition', 'div:jqmData(role="popup")', function() {
    var notDismissible = $(this).jqmData('dismissible') === false;
    if (notDismissible) {
        $('.ui-popup-screen').off();
    }
});

// Permet de naviguer entre plusieurs popup
function navigateToPopupID(page)
{
    $.mobile.changePage(page, 'pop', true, true);
}

// Permet de mettre la première lettre en majuscule et le reste en minuscule
function firstLetterUppercase(string)
{
    return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}