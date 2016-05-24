/*
    Dimitri DESSUS
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audio Windows 2016 - Audiosa
    
	Fichier: connexion.js
	Description: Fonctions permettant d'assurer la connexion en tant qu'administrateur
*/

// Fonction executée lors de la validation du formulaire de connexion
$("#formConnexionPopup").submit(function(event) {
    // Permet d'empêcher la soumission synchrone du formulaire
    event.preventDefault();
	
	// Récupération de la page
    var fullPage = document.getElementById("fullPage");
	
	// Récupération des éléments relatifs au formulaire
    var elementPseudoField		= $("#pseudo-text");
    var elementPaswordField		= $("#password-text");
    var elementPseudoFieldDiv	= elementPseudoField.parent();
    var elementPaswordFieldDiv	= elementPaswordField.parent();
    var elementMessageDiv 		= $("#messageInfoConnexionDiv");
    var elementMessageLabel 	= $("#messageInfoConnexionLabel");
    var elementConnexionPopup 	= $("#popupConnexion");
    var elementConnexionButton 	= $("#connexionButton");
    var elementPseudoForm 		= $("#pseudoName-text");
	
	// Détection des valeurs vides 
    if (elementPseudoField.val().length == 0 || elementPaswordField.val()
        .length == 0) {
			
		// Au moins une des valeurs est vide
		// Affichage de la bannière indiquant une erreur
        elementMessageDiv.css("background-color", "#e74c3c");
		
		// Cas où toutes les valeurs sont vides
        if (elementPseudoField.val().length == 0 && elementPaswordField
            .val().length == 0) {
				
			// Ajout des classes permettant de faire vibrer le champ textuel
			elementPseudoFieldDiv.addClass("animated shake");
			
			// Mise en place d'un timer de 500ms permettant de supprimer les classes
			// correspondantes à l'animation
            window.setTimeout(function() {
                elementPseudoFieldDiv.removeClass('animated shake');
            }, 500);
			
            elementPaswordFieldDiv.addClass("animated shake");
            window.setTimeout(function() {
                elementPaswordFieldDiv.removeClass('animated shake');
            }, 500);
			
        } 
		else if (elementPseudoField.val().length == 0) 
		{
			// Cas où le champ textuel "pseudo" est vide
            elementPseudoFieldDiv.addClass("animated shake");
            window.setTimeout(function() {
                elementPseudoFieldDiv.removeClass('animated shake');
            }, 500);
        } 
		else if (elementPaswordField.val().length == 0) 
		{
			// Cas où le champ textuel "mot de passe" est vide
            elementPaswordFieldDiv.addClass("animated shake");
            window.setTimeout(function() {
                elementPaswordFieldDiv.removeClass('animated shake');
            }, 500);
        }
    }
	
	// Cas où aucune erreur n'est détecté
    if (elementPseudoField.val().length > 0 && elementPaswordField.val()
        .length > 0) {
		
		// Les valeurs saisies sont valides,
		// On peut procéder à la soumission du formulaire
		
		// Constitution du formulaire à soumettre
        var $form = $(this),
            pseudoValue = elementPseudoField.val(),
            passwordValue = elementPaswordField.val(),
            url = $form.attr("action");
		
		// Animation de chargement
        elementConnexionButton.html("<i class=\"fa fa-refresh fa-spin\"></i>");
		
		// Envoi de la requête POST asynchrone
        var posting = $.post(url, {
            pseudoPost: pseudoValue,		// Nom d'utilisateur
            passwordPost: passwordValue		// Mot de passe
        });
		
		// Fonction executée quand la requête POST asynchrone
		// s'est achevée avec succès
        posting.done(function(data) {
            var JSONParsed = data; // Parse du JSON
			
			// Suppression de l'animation de chargement sur le bouton
            elementConnexionButton.html("Se connecter");
			
			// Afichage bannière
            elementMessageDiv.addClass("animated bounceIn");
            window.setTimeout(function() {
                elementMessageDiv.removeClass("animated bounceIn");
            }, 500);
			
			// Test de la valeur "status_code" présente dans la réponse JSON
            if (JSONParsed.status_code == 1) 
			{
				// On change l'affichage de la bannière en vert car 
				// le changement à bien été effectué
                elementMessageDiv.css("display", "block");
                elementMessageDiv.css("background-color","#16a085");
                elementMessageLabel.text("Connexion reussie !");
                
				// Mise en place d'un timer de 1s permettant de faire
				// disparaître le popup une fois le temps écoulé
				window.setTimeout(function() {
                    pseudo = pseudoValue;						// Assignation pseudo
                    passwordHash = md5(passwordValue);			// Assignation mot de passe
                    elementPseudoForm.attr("value", pseudo);	// On place le pseudo dans un input caché
                    
					// Disparition de la bannière
					elementMessageDiv.css("display", "none");	
                    
					// Remise à zéro des champs textuels
					elementPseudoField.val("");
                    elementPaswordField.val("");
					
					// Modification de l'affichage du site
                    userConnected();
					
					// Disparition du popup
                    elementConnexionPopup.popup("close");
                    blurAction(0, fullPage);
                }, 1000);
            } 
			else 
			{
				// On change l'affichage de la bannière en rouge car 
				// une erreur est survenue lors du changement
                elementMessageDiv.css("background-color", "#e74c3c");
                elementMessageDiv.css("display", "block");
				
				// On test l'erreur retournée par le serveur
				// Puis on l'affiche aux yeux de l'utilisateur
				switch(JSONParsed.error_description)
                {
	            	case "undeclared variables":
	                    elementMessageLabel.text("Variable(s) non déclaré(es)");
	                    break;
					case "connection to database failed":
	                    elementMessageLabel.text("Connexion à la bdd impossible");
	                    break;
					case "username and/or password does not match":
	                    elementMessageLabel.text("Identifiant(s) incorrect(s)");
	                    break;
					case "failed to execute query":
	                    elementMessageLabel.text("Impossible d'executer la requête");
	                    break;
					default :
	                    elementMessageLabel.text("Erreur");
	                    break;
				}
            }
        });
    }
});

// Fonction permettant de modifier l'apparence du site quand l'utilisateur est connecté
function userConnected() {
    var elementConnectButton 		= $("#image_utilisateur");
    var elementImportButton 		= $("#import_button");
	var elementNewPlaylistButton 	= $("#button_new_playlist");
	var classEditMusic 				= $(".edit_music_container");
	
    elementConnectButton.attr("src", "img/menuIcon.png");
    elementConnectButton.parent().attr("href", "#popupMenu");
    elementImportButton.css("display", "block");
	elementNewPlaylistButton.css("display", "block");
	classEditMusic.css("display", "block");
}

// Fonction permettant de modifier l'apparence du site quand l'utilisateur est déconnecté
function userDisconnected() {
    var elementConnectButton 		= $("#image_utilisateur");
    var elementImportButton 		= $("#import_button");
	var elementNewPlaylistButton 	= $("#button_new_playlist");
	var classEditMusic 				= $(".edit_music_container");
	
    elementConnectButton.attr("src", "img/user.png");
    elementConnectButton.parent().attr("href", "#popupConnexion");
    elementImportButton.css("display", "none");
	elementNewPlaylistButton.css("display", "none");
	classEditMusic.css("display", "none");
}

// Fonction permettant à l'utilisateur de se déconnecter du site
function disconnect() {
    var elementMenuPopup = $("#popupMenu");
	
	// Envoi requête asynchrone GET vers le script de déconnexion
    $.ajax({
        url: "apis/logout.php"
    });
	
	// Mise en place d'un timer de 500ms
    window.setTimeout(function() {
		
		// On modifie l'affichage du site
        userDisconnected();
		
        elementMenuPopup.popup("close");
        blurAction(0, fullPage);
    }, 500);
}