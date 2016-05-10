$("#formConnexionPopup").submit(function(event) {
    event.preventDefault();
    var fullPage = document.getElementById("fullPage");
    var elementPseudoField = $("#pseudo-text");
    var elementPaswordField = $("#password-text");
    var elementPseudoFieldDiv = elementPseudoField.parent();
    var elementPaswordFieldDiv = elementPaswordField.parent();
    var elementMessageDiv = $("#messageInfoConnexionDiv");
    var elementMessageLabel = $("#messageInfoConnexionLabel");
    var elementConnexionPopup = $("#popupConnexion");
    var elementConnexionButton = $("#connexionButton");
    var elementPseudoForm = $("#pseudoName-text");
    if (elementPseudoField.val().length == 0 || elementPaswordField.val()
        .length == 0) {
        elementMessageDiv.css("background-color", "#e74c3c");
        if (elementPseudoField.val().length == 0 && elementPaswordField
            .val().length == 0) {
            elementPseudoFieldDiv.addClass("animated shake");
            window.setTimeout(function() {
                elementPseudoFieldDiv.removeClass('animated shake');
            }, 500);
            elementPaswordFieldDiv.addClass("animated shake");
            window.setTimeout(function() {
                elementPaswordFieldDiv.removeClass('animated shake');
            }, 500);
        } else if (elementPseudoField.val().length == 0) {
            elementPseudoFieldDiv.addClass("animated shake");
            window.setTimeout(function() {
                elementPseudoFieldDiv.removeClass('animated shake');
            }, 500);
        } else if (elementPaswordField.val().length == 0) {
            elementPaswordFieldDiv.addClass("animated shake");
            window.setTimeout(function() {
                elementPaswordFieldDiv.removeClass('animated shake');
            }, 500);
        }
    }
    if (elementPseudoField.val().length > 0 && elementPaswordField.val()
        .length > 0) {
        var $form = $(this),
            pseudoValue = elementPseudoField.val(),
            passwordValue = elementPaswordField.val(),
            url = $form.attr("action");
        elementConnexionButton.html(
            "<i class=\"fa fa-refresh fa-spin\"></i>");
        var posting = $.post(url, {
            pseudoPost: pseudoValue,
            passwordPost: passwordValue
        });
        posting.done(function(data) {
            var JSONParsed = data;
            elementConnexionButton.html("Se connecter");
            elementMessageDiv.addClass("animated bounceIn");
            window.setTimeout(function() {
                elementMessageDiv.removeClass("animated bounceIn");
            }, 500);
            if (JSONParsed.status_code == 1) {
                elementMessageDiv.css("display", "block");
                elementMessageDiv.css("background-color","#16a085");
                elementMessageLabel.text("Connexion reussie !");
                window.setTimeout(function() {
                    pseudo = pseudoValue;
                    passwordHash = md5(passwordValue);
                    elementPseudoForm.attr("value", pseudo);
                    elementMessageDiv.css("display", "none");
                    elementPseudoField.val("");
                    elementPaswordField.val("");
                    userConnected();
                    elementConnexionPopup.popup("close");
                    blurAction(0, fullPage);
                }, 1000);
            } else {
                elementMessageDiv.css("background-color", "#e74c3c");
                elementMessageDiv.css("display", "block");
				
				switch(JSONParsed.error_description)
                {
	            	case "undeclared variables":
					{
	                    elementMessageLabel.text("Variable(s) non déclaré(es)");
						elementMessageDiv.addClass("animated shake");
						window.setTimeout(function() {
							elementMessageDiv.addClass("animated bounceIn");
						}, 500);
						elementPseudoFieldDiv.addClass("animated shake");
						elementPaswordFieldDiv.addClass("animated shake");
						window.setTimeout(function() {
							elementPseudoFieldDiv.addClass("animated shake");
							elementPaswordFieldDiv.removeClass('animated shake');
						}, 500);
	                    break;
					}
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

function userConnected() {
    var elementConnectButton = $("#image_utilisateur");
    var elementImportButton = $("#import_button");
	var elementNewPlaylistButton = $("#button_new_playlist");
	var classEditMusic = $(".edit_music_container");
    elementConnectButton.attr("src", "img/menuIcon.png");
    elementConnectButton.parent().attr("href", "#popupMenu");
    elementImportButton.css("display", "block");
	elementNewPlaylistButton.css("display", "block");
	classEditMusic.css("display", "block");
}

function userDisconnected() {
    var elementConnectButton = $("#image_utilisateur");
    var elementImportButton = $("#import_button");
	var elementNewPlaylistButton = $("#button_new_playlist");
	var classEditMusic = $(".edit_music_container");
    elementConnectButton.attr("src", "img/user.png");
    elementConnectButton.parent().attr("href", "#popupConnexion");
    elementImportButton.css("display", "none");
	elementNewPlaylistButton.css("display", "none");
	classEditMusic.css("display", "none");
}

function disconnect() {
    var elementMenuPopup = $("#popupMenu");
    $.ajax({
        url: "apis/logout.php"
    });
    window.setTimeout(function() {
        userDisconnected();
        elementMenuPopup.popup("close");
        blurAction(0, fullPage);
    }, 500);
}