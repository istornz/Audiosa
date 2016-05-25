/*
    Dimitri DESSUS
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audio Windows 2016 - Audiosa
    
	Fichier: changer_mot_passe.js
	Description: Fonctions permettant de changer le mot de passe administrateur
*/

// Fonction executée lors de la validation du formulaire changement mot de passe
$("#formChangerMotDePassePopup").submit(function(event) {
	
	// Permet d'empêcher la soumission synchrone du formulaire
    event.preventDefault();
	
	// Récupération de la page
    var fullPage = document.getElementById("fullPage");
	
	// Récupération des éléments relatifs au formulaire
    var elementMotDePasseActuelField 		= $("#currentPassword-text");
    var elementNouveauMotDePasseField 		= $("#newPassword-text");
    var elementMotDePasseConfirmField 		= $("#confirmPassword-text");
    var elementPseudoNameField 				= $("#pseudoName-text");
    var elementMotDePasseActuelFieldDiv 	= elementMotDePasseActuelField.parent();
    var elementNouveauMotDePasseFieldDiv 	= elementNouveauMotDePasseField.parent();
    var elementMotDePasseConfirmFieldDiv 	= elementMotDePasseConfirmField.parent();
    var elementMessageChangerPassDiv 		= $("#messageInfoDivChangerPass");
    var elementMessageChangerPassLabel 		= $("#messageInfoChangerPassLabel");
    var elementChangerPassPopup 			= $("#popupChangerPass");
    var elementChangerPassButton 			= $("#changerPassButton");
    
	// Détection des valeurs vides 
    if (elementMotDePasseActuelField.val().length == 0 || elementNouveauMotDePasseField.val()
        .length == 0 || elementMotDePasseConfirmFieldDiv.val()
        .length == 0) {
		
		// Au moins une des valeurs est vide
		// Affichage de la bannière indiquant une erreur
        elementMessageChangerPassDiv.css("background-color", "#e74c3c");
		
		// Cas où toutes les valeurs sont vides
        if (elementMotDePasseActuelField.val().length == 0 && elementNouveauMotDePasseField
            .val().length == 0 && elementMotDePasseConfirmField
            .val().length == 0) {
				
			// Ajout des classes permettant de faire vibrer le champ textuel
            elementMotDePasseActuelFieldDiv.addClass("animated shake");
			
			// Mise en place d'un timer de 500ms permettant de supprimer les classes
			// correspondantes à l'animation
            window.setTimeout(function() {
                elementMotDePasseActuelFieldDiv.removeClass(
                    'animated shake');
            }, 500);
			
            elementNouveauMotDePasseFieldDiv.addClass("animated shake");
            window.setTimeout(function() {
                elementNouveauMotDePasseFieldDiv.removeClass(
                    'animated shake');
            }, 500);
			
            elementMotDePasseConfirmFieldDiv.addClass("animated shake");
            window.setTimeout(function() {
                elementMotDePasseConfirmFieldDiv.removeClass(
                    'animated shake');
            }, 500);
			
        } 
		else if (elementMotDePasseActuelField.val().length == 0) 
		{
			// Cas où le champ textuel "mot de passe actuel" est vide
            elementMotDePasseActuelFieldDiv.addClass("animated shake");
            window.setTimeout(function() {
                elementMotDePasseActuelFieldDiv.removeClass(
                    'animated shake');
            }, 500);
        } 
		else if (elementNouveauMotDePasseField.val().length == 0) 
		{
			// Cas où le champ textuel "nouveau mot de passe" est vide
            elementNouveauMotDePasseFieldDiv.addClass("animated shake");
            window.setTimeout(function() {
                elementNouveauMotDePasseFieldDiv.removeClass(
                    'animated shake');
            }, 500);
        } 
		else if (elementMotDePasseConfirmField.val().length == 0) 
		{
			// Cas où le champ textuel "confirmation mot de passe" est vide
            elementMotDePasseConfirmFieldDiv.addClass("animated shake");
            window.setTimeout(function() {
                elementMotDePasseConfirmFieldDiv.removeClass(
                    'animated shake');
            }, 500);
        }
    }
    
	// Vérification longueur du nouveau mot de passe
	// Celui-ci doit être de 5 caractères minimum
    if(elementNouveauMotDePasseField.val().length < 5 || elementMotDePasseConfirmField.val().length < 5)
    {
		// Le mot de passe est inférieur à 5 caractères
		
		// Affichage de la bannière indiquant une erreur
	    elementMessageChangerPassDiv.css("display", "block");
	    elementMessageChangerPassLabel.text("Le mot de passe doit faire au moins 5 caractères");
		
		// Ajout des classes permettant d'ajouter une animation à la bannière
	    elementMessageChangerPassDiv.addClass("animated bounceIn");
		
		// Mise en place d'un timer de 500ms permettant de supprimer les classes
		// correspondantes à l'animation
	    window.setTimeout(function() {
                elementMessageChangerPassDiv.removeClass(
                    "animated bounceIn");
            }, 500);
			
	    elementNouveauMotDePasseFieldDiv.addClass("animated shake");
            window.setTimeout(function() {
                elementNouveauMotDePasseFieldDiv.removeClass(
                    'animated shake');
            }, 500);
			
        elementMotDePasseConfirmFieldDiv.addClass("animated shake");
            window.setTimeout(function() {
                elementMotDePasseConfirmFieldDiv.removeClass(
                    'animated shake');
            }, 500);
    }
    
	// Vérification du cas où la confirmation est différente
	// du nouveau mot de passe
    if(elementNouveauMotDePasseField.val() != elementMotDePasseConfirmField.val())
    {
		// Les mots de passes ne correspondent pas
		
	    elementMessageChangerPassDiv.css("display", "block");
	    elementMessageChangerPassLabel.text("Les mots de passes sont différents");
	    
		// Animation bannière
		elementMessageChangerPassDiv.addClass("animated bounceIn");
	    window.setTimeout(function() {
                elementMessageChangerPassDiv.removeClass(
                    "animated bounceIn");
            }, 500);
	    
		// Animation des champs textuels
	    elementNouveauMotDePasseFieldDiv.addClass("animated shake");
            window.setTimeout(function() {
                elementNouveauMotDePasseFieldDiv.removeClass(
                    'animated shake');
            }, 500);
        
		elementMotDePasseConfirmFieldDiv.addClass("animated shake");
            window.setTimeout(function() {
                elementMotDePasseConfirmFieldDiv.removeClass(
                    'animated shake');
            }, 500);
    }
    
	// Cas où aucune erreur n'est détecté
    if (elementMotDePasseActuelField.val().length > 0 && elementNouveauMotDePasseField.val()
        .length >= 5 && elementMotDePasseConfirmField.val()
        .length >= 5 && (elementNouveauMotDePasseField.val() == elementMotDePasseConfirmField.val())) {
        
		// Les valeurs saisies sont valides,
		// On peut procéder à la soumission du formulaire
		
		// Animation de chargement
		elementChangerPassButton.html("<i class=\"fa fa-refresh fa-spin\"></i>");
        
		// Constitution du formulaire à soumettre
		var formData = new FormData;
		formData.append('pseudoPost', elementPseudoNameField.val());
		formData.append('actualPasswordPost', md5(elementMotDePasseActuelField.val()));
		formData.append('newPasswordPost', md5(elementNouveauMotDePasseField.val()));
		formData.append('confirmPasswordPost', md5(elementMotDePasseConfirmField.val()));
		
		// Envoi de la requête POST asynchrone
		$.ajax({
			url: './apis/changepass.php',
			type: 'POST',
			data: formData,
			async: true,
			success: function (data) {
				var JSONParsed = data; // Parse du JSON
            
				// Suppression de l'animation de chargement sur le bouton
				elementChangerPassButton.html("Changer mot de passe");
				
				// Afichage bannière
				elementMessageChangerPassDiv.addClass("animated bounceIn");
				window.setTimeout(function() {
					elementMessageChangerPassDiv.removeClass(
						"animated bounceIn");
				}, 500);
				
				// Test de la valeur "status_code" présente dans la réponse JSON
				if (JSONParsed.status_code == 1) 
				{
					// On change l'affichage de la bannière en vert car 
					// le changement à bien été effectué
					elementMessageChangerPassDiv.css("display", "block");
					elementMessageChangerPassDiv.css("background-color",
						"#16a085");
					elementMessageChangerPassLabel.text("Changement reussie !");
					
					// Mise en place d'un timer de 1s permettant de faire
					// disparaître le popup une fois le temps écoulé
					window.setTimeout(function() {
						passwordHash = md5(newPasswordValue); // Assignation du nouveau mot de passe
						
						// Disparition de la bannière
						elementMessageChangerPassDiv.css("display", "none");
						
						// Remise à zéro des champs textuels
						elementMotDePasseActuelField.val("");
						elementNouveauMotDePasseField.val("");
						elementMotDePasseConfirmField.val("");
					}, 1000);
				} 
				else 
				{
					// On change l'affichage de la bannière en rouge car 
					// une erreur est survenue lors du changement
					elementMessageChangerPassDiv.css("background-color",
						"#e74c3c");
					elementMessageChangerPassDiv.css("display", "block");
					
					// On test l'erreur retournée par le serveur
					// Puis on l'affiche aux yeux de l'utilisateur
					switch(JSONParsed.error_description)
					{
						case "undeclared variables":
							elementMessageChangerPassLabel.text("Variable(s) non déclaré(es)");
							break;
						case "connection to database failed":
							elementMessageChangerPassLabel.text("Connexion à la bdd impossible");
							break;
						case "username and/or password does not match":
							elementMessageChangerPassLabel.text("Mot de passe incorrect");
							break; 
						case "passwords don\'t match":
							elementMessageChangerPassLabel.text("Les mots de passes sont différents");
							break;
						case "failed to execute select query":
							elementMessageChangerPassLabel.text("Impossible de vous identifier");
							break;
						case "failed to execute update query":
							elementMessageChangerPassLabel.text("Impossible de mettre à jour le mot de passe");
							break;
						default:
							elementMessageChangerPassLabel.text("Erreur");
							break;
					}
				}
			},
			cache: false,
			contentType: false,
			processData: false,
			error: function(data) {
				console.log(data);
			}
		});
    }
});

// Fonction executée lors de la validation du formulaire oublie mot de passe
$("#formOublieMotDePassePopup").submit(function(event) {
	
	// Permet d'empêcher la soumission synchrone du formulaire
    event.preventDefault();
	
	// Récupération de la page
    var fullPage = document.getElementById("fullPage");
	
	// Récupération des éléments relatifs au formulaire
    var elementMailField 			= $("#email-text");
    var elementMailFieldDiv 		= elementMailField.parent();
    var elementMessageOublieDiv 	= $("#messageInfoDivOubliePass");
    var elementMessageOublieLabel 	= $("#messageInfoOubliePassLabel");
    var elementOubliePopup 			= $("#popupMotDePasseOublie");
    var elementOublieButton 		= $("#oubliePassButton");
    
	// Vérification taille mail
    if (elementMailField.val().length == 0) {
		elementMailFieldDiv.addClass("animated shake");
		window.setTimeout(function() {
			elementMailFieldDiv.removeClass(
				'animated shake');
		}, 500);
    }
	
	// Vérification si les éléments du formulaire sont valides 
    if (elementMailField.val().length > 0) {
        
		// Constitution du formulaire
        var $form = $(this),
        	mailValue = elementMailField.val(),
            url = $form.attr("action");
        elementOublieButton.html(
            "<i class=\"fa fa-refresh fa-spin\"></i>");
        
		// Envoi de la requête GET asynchrone
        var posting = $.get(url, {
	        mail: mailValue // Valeur du mail
        });
		
		// Fonction executée quand la requête GET asynchrone
		// s'est soldé par un succès
        posting.done(function(data) {
            var JSONParsed = JSON.parse(data); // Parse du JSON
			
			// Suppression de l'animation de chargement sur le bouton
            elementOublieButton.html("Valider");
			
			// Afichage bannière
            elementMessageOublieDiv.addClass("animated bounceIn");
            window.setTimeout(function() {
                elementMessageOublieDiv.removeClass(
                    "animated bounceIn");
            }, 500);
            
			// Test de la valeur "status_code" présente dans la réponse JSON
            if (JSONParsed.status_code == 1) {
				
				// On change l'affichage de la bannière en vert car 
				// le changement à bien été effectué
                elementMessageOublieDiv.css("display", "block");
                elementMessageOublieDiv.css("background-color", "#16a085");
                elementMessageOublieLabel.text("Un mail à été envoyé");
                
				// Mise en place d'un timer de 1s permettant de faire
				// disparaître le popup une fois le temps écoulé
				window.setTimeout(function() {
					// Disparition de la bannière
                    elementMessageOublieDiv.css("display", "none");
                    
					// Remise à zéro du champ textuel
					elementMailField.val("");
					
					elementOubliePopup.popup("close");
                    blurAction(0, fullPage);
					
                }, 1000);
            } 
			else 
			{
				// On change l'affichage de la bannière en rouge car 
				// une erreur est survenue lors du changement
                elementMessageOublieDiv.css("background-color",
                    "#e74c3c");
                elementMessageOublieDiv.css("display", "block");
				
				// On test l'erreur retournée par le serveur
				// Puis on l'affiche aux yeux de l'utilisateur
				switch(JSONParsed.error_description)
                {
	            	case "undeclared variables":
	                    elementMessageOublieLabel.text("Variable(s) non déclaré(es)");
	                    break;
					case "connection to database failed":
	                    elementMessageOublieLabel.text("Connexion à la bdd impossible");
	                    break;
					case "mail not valid":
	                    elementMessageOublieLabel.text("Mail invalide");
	                    break;
					case "failed to execute select query":
	                    elementMessageOublieLabel.text("Impossible de vous identifier");
	                    break;
					case "mail not sent":
	                    elementMessageOublieLabel.text("Impossible d'envoyer le mail");
	                    break;
					case "no user with this email":
	                    elementMessageOublieLabel.text("Aucune adresse mail correspondante");
	                    break;
					default:
						elementMessageOublieLabel.text("Erreur");
						break;
				}
            }
        });
    }
});

// Fonction executée 
function changePasswordAction() {
    var elementDivMenuPanel = $("#menuPanel");
    var elementDivChangerPass = $("#changerpassPanel");
    var elementBackNavBar = $("#backToMenu");
    
    elementBackNavBar.css("display", "block");
    elementDivMenuPanel.css("display", "none");
    elementDivChangerPass.css("display", "block");
}