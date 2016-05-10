$("#formChangerMotDePassePopup").submit(function(event) {
    event.preventDefault();
    var fullPage = document.getElementById("fullPage");
    var elementMotDePasseActuelField = $("#currentPassword-text");
    var elementNouveauMotDePasseField = $("#newPassword-text");
    var elementMotDePasseConfirmField = $("#confirmPassword-text");
    var elementPseudoNameField = $("#pseudoName-text");
    var elementMotDePasseActuelFieldDiv = elementMotDePasseActuelField.parent();
    var elementNouveauMotDePasseFieldDiv = elementNouveauMotDePasseField.parent();
    var elementMotDePasseConfirmFieldDiv = elementMotDePasseConfirmField.parent();
    var elementMessageChangerPassDiv = $("#messageInfoDivChangerPass");
    var elementMessageChangerPassLabel = $("#messageInfoChangerPassLabel");
    var elementChangerPassPopup = $("#popupChangerPass");
    var elementChangerPassButton = $("#changerPassButton");
    
    if (elementMotDePasseActuelField.val().length == 0 || elementNouveauMotDePasseField.val()
        .length == 0 || elementMotDePasseConfirmFieldDiv.val()
        .length == 0) {
        elementMessageChangerPassDiv.css("background-color", "#e74c3c");
        if (elementMotDePasseActuelField.val().length == 0 && elementNouveauMotDePasseField
            .val().length == 0 && elementMotDePasseConfirmField
            .val().length == 0) {
            elementMotDePasseActuelFieldDiv.addClass("animated shake");
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
        } else if (elementMotDePasseActuelField.val().length == 0) {
            elementMotDePasseActuelFieldDiv.addClass("animated shake");
            window.setTimeout(function() {
                elementMotDePasseActuelFieldDiv.removeClass(
                    'animated shake');
            }, 500);
        } else if (elementNouveauMotDePasseField.val().length == 0) {
            elementNouveauMotDePasseFieldDiv.addClass("animated shake");
            window.setTimeout(function() {
                elementNouveauMotDePasseFieldDiv.removeClass(
                    'animated shake');
            }, 500);
        } else if (elementMotDePasseConfirmField.val().length == 0) {
            elementMotDePasseConfirmFieldDiv.addClass("animated shake");
            window.setTimeout(function() {
                elementMotDePasseConfirmFieldDiv.removeClass(
                    'animated shake');
            }, 500);
        }
    }
    
    if(elementNouveauMotDePasseField.val().length < 5 || elementMotDePasseConfirmField.val().length < 5)
    {
	    elementMessageChangerPassDiv.css("display", "block");
	    elementMessageChangerPassLabel.text("Le mot de passe doit faire au moins 5 caractères");
	    elementMessageChangerPassDiv.addClass("animated bounceIn");
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
    
    if(elementNouveauMotDePasseField.val() != elementMotDePasseConfirmField.val())
    {
	    elementMessageChangerPassDiv.css("display", "block");
	    elementMessageChangerPassLabel.text("Les mots de passes sont différents");
	    elementMessageChangerPassDiv.addClass("animated bounceIn");
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
    
    if (elementMotDePasseActuelField.val().length > 0 && elementNouveauMotDePasseField.val()
        .length >= 5 && elementMotDePasseConfirmField.val()
        .length >= 5 && (elementNouveauMotDePasseField.val() == elementMotDePasseConfirmField.val())) {
        
        var $form = $(this),
        	pseudoValue = elementPseudoNameField.val(),
            actualPasswordValue = elementMotDePasseActuelField.val(),
            newPasswordValue = elementNouveauMotDePasseField.val(),
            confirmPasswordValue = elementMotDePasseConfirmField.val(),
            url = $form.attr("action");
        elementChangerPassButton.html(
            "<i class=\"fa fa-refresh fa-spin\"></i>");
            
        var posting = $.post(url, {
	        pseudoPost: pseudoValue,
            actualPasswordPost: md5(actualPasswordValue),
            newPasswordPost: md5(newPasswordValue),
            confirmPasswordPost: md5(confirmPasswordValue)
        });
        
        posting.done(function(data) {
            var JSONParsed = data;
            console.log(data);
            elementChangerPassButton.html("Changer mot de passe");
            elementMessageChangerPassDiv.addClass("animated bounceIn");
            window.setTimeout(function() {
                elementMessageChangerPassDiv.removeClass(
                    "animated bounceIn");
            }, 500);
            
            if (JSONParsed.status_code == 1) {
                elementMessageChangerPassDiv.css("display", "block");
                elementMessageChangerPassDiv.css("background-color",
                    "#16a085");
                elementMessageChangerPassLabel.text("Changement reussie !");
                window.setTimeout(function() {
                    pseudo = pseudoValue;
                    passwordHash = md5(newPasswordValue);
                    elementMessageChangerPassDiv.css("display", "none");
                    elementMotDePasseActuelField.val("");
                    elementNouveauMotDePasseField.val("");
                    elementMotDePasseConfirmField.val("");
                }, 1000);
            } else {
                elementMessageChangerPassDiv.css("background-color",
                    "#e74c3c");
                elementMessageChangerPassDiv.css("display", "block");
				
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
        });
    }
});

$("#formOublieMotDePassePopup").submit(function(event) {
    event.preventDefault();
    var fullPage = document.getElementById("fullPage");
    var elementMailField = $("#email-text");
    var elementMailFieldDiv = elementMailField.parent();
    var elementMessageOublieDiv = $("#messageInfoDivOubliePass");
    var elementMessageOublieLabel = $("#messageInfoOubliePassLabel");
    var elementOubliePopup = $("#popupMotDePasseOublie");
    var elementOublieButton = $("#oubliePassButton");
    
    if (elementMailField.val().length == 0) {
		elementMailFieldDiv.addClass("animated shake");
		window.setTimeout(function() {
			elementMailFieldDiv.removeClass(
				'animated shake');
		}, 500);
    }
	
    if (elementMailField.val().length > 0) {
        
        var $form = $(this),
        	mailValue = elementMailField.val(),
            url = $form.attr("action");
        elementOublieButton.html(
            "<i class=\"fa fa-refresh fa-spin\"></i>");
        
        var posting = $.get(url, {
	        mail: mailValue
        });
		
        posting.done(function(data) {
            var JSONParsed = JSON.parse(data);
			
            elementOublieButton.html("Valider");
            elementMessageOublieDiv.addClass("animated bounceIn");
            window.setTimeout(function() {
                elementMessageOublieDiv.removeClass(
                    "animated bounceIn");
            }, 500);
            
            if (JSONParsed.status_code == 1) {
                elementMessageOublieDiv.css("display", "block");
                elementMessageOublieDiv.css("background-color",
                    "#16a085");
                elementMessageOublieLabel.text("Un mail à été envoyé");
                window.setTimeout(function() {
                    elementMessageOublieDiv.css("display", "none");
                    elementMailField.val("");
					
					elementOubliePopup.popup("close");
                    blurAction(0, fullPage);
					
                }, 1000);
            } else {
                elementMessageOublieDiv.css("background-color",
                    "#e74c3c");
                elementMessageOublieDiv.css("display", "block");
				
				switch(JSONParsed.error_description)
                {
	            	case "undeclared variables":
	                    elementMessageChangerPassLabel.text("Variable(s) non déclaré(es)");
	                    break;
					case "connection to database failed":
	                    elementMessageChangerPassLabel.text("Connexion à la bdd impossible");
	                    break;
					case "mail not valid":
	                    elementMessageChangerPassLabel.text("Mail invalide");
	                    break;
					case "failed to execute select query":
	                    elementMessageChangerPassLabel.text("Impossible de vous identifier");
	                    break;
					case "mail not sent":
	                    elementMessageChangerPassLabel.text("Impossible d'envoyer le mail");
	                    break;
					default:
						elementMessageOublieLabel.text("Erreur");
						break;
				}
            }
        });
    }
});

function changePasswordAction() {
    var elementDivMenuPanel = $("#menuPanel");
    var elementDivChangerPass = $("#changerpassPanel");
    var elementBackNavBar = $("#backToMenu");
    
    elementBackNavBar.css("display", "block");
    elementDivMenuPanel.css("display", "none");
    elementDivChangerPass.css("display", "block");
}