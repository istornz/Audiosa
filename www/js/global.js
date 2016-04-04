elementProgress = null;
pseudo = null;
passwordHash = null;
stateLogLoading = false;

function blurAction(state, div) {
    if (state == 1) div.className = "fullPageBlurred";
    else div.className = "";
}

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
                elementPseudoFieldDiv.removeClass(
                    'animated shake');
            }, 500);
            elementPaswordFieldDiv.addClass("animated shake");
            window.setTimeout(function() {
                elementPaswordFieldDiv.removeClass(
                    'animated shake');
            }, 500);
        } else if (elementPseudoField.val().length == 0) {
            elementPseudoFieldDiv.addClass("animated shake");
            window.setTimeout(function() {
                elementPseudoFieldDiv.removeClass(
                    'animated shake');
            }, 500);
        } else if (elementPaswordField.val().length == 0) {
            elementPaswordFieldDiv.addClass("animated shake");
            window.setTimeout(function() {
                elementPaswordFieldDiv.removeClass(
                    'animated shake');
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
                elementMessageDiv.removeClass(
                    "animated bounceIn");
            }, 500);
            if (JSONParsed.status_code == 1) {
                elementMessageDiv.css("display", "block");
                elementMessageDiv.css("background-color",
                    "#16a085");
                elementMessageLabel.text("Connexion reussie !");
                window.setTimeout(function() {
                    pseudo = pseudoValue;
                    passwordHash = md5(passwordValue);
                    elementPseudoForm.attr("value", pseudo);
                    elementMessageDiv.css("display",
                        "none");
                    elementPseudoField.val("");
                    elementPaswordField.val("");
                    userConnected();
                    elementConnexionPopup.popup("close");
                    blurAction(0, fullPage);
                }, 1000);
            } else {
                elementMessageDiv.css("background-color",
                    "#e74c3c");
                elementMessageDiv.css("display", "block");
                if (JSONParsed.error_description ==
                    "undeclared variables") {
                    elementMessageLabel.text(
                        "Variable(s) non déclaré(es)");
                    elementMessageDiv.addClass("animated shake");
                    window.setTimeout(function() {
                        elementMessageDiv.addClass(
                            "animated bounceIn");
                    }, 500);
                    elementPseudoFieldDiv.addClass(
                        "animated shake");
                    elementPaswordFieldDiv.addClass(
                        "animated shake");
                    window.setTimeout(function() {
                        elementPseudoFieldDiv.addClass(
                            "animated shake");
                        elementPaswordFieldDiv.removeClass(
                            'animated shake');
                    }, 500);
                } else if (JSONParsed.error_description ==
                    "connection to database failed") {
                    elementMessageLabel.text(
                        "Connexion à la bdd impossible");
                } else if (JSONParsed.error_description ==
                    "username and/or password does not match") {
                    elementMessageLabel.text(
                        "Identifiant(s) incorrect(s)");
                } else if (JSONParsed.error_description ==
                    "failed to execute query") {
                    elementMessageLabel.text(
                        "Impossible d'executer la requête");
                } else {
                    elementMessageLabel.text("Erreur");
                }
            }
        });
    }
});

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
                if (JSONParsed.error_description == "undeclared variables") {
                    elementMessageChangerPassLabel.text("Variable(s) non déclaré(es)");
                } else if (JSONParsed.error_description ==
                    "connection to database failed") {
                    elementMessageChangerPassLabel.text(
                        "Connexion à la bdd impossible");
                } else if (JSONParsed.error_description ==
                    "username and/or password does not match") {
                    elementMessageChangerPassLabel.text(
                        "Mot de passe incorrect");
                } else if (JSONParsed.error_description ==
                    "passwords don\'t match") {
                    elementMessageChangerPassLabel.text(
                        "Les mots de passes sont différents");
                } else if (JSONParsed.error_description ==
                    "failed to execute select query") {
                    elementMessageChangerPassLabel.text(
                        "Impossible de vous identifier");
                } else if (JSONParsed.error_description ==
                    "failed to execute update query") {
                    elementMessageChangerPassLabel.text(
                        "Impossible de mettre à jour le mot de passe");
                } else {
                    elementMessageChangerPassLabel.text("Erreur");
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
				console.log(JSONParsed.error_description);
                if (JSONParsed.error_description == "undeclared variables") {
                    elementMessageOublieLabel.text("Variable(s) non déclaré(es)");
                } else if (JSONParsed.error_description ==
                    "connection to database failed") {
                    elementMessageOublieLabel.text(
                        "Connexion à la bdd impossible");
                } else if (JSONParsed.error_description ==
                    "mail not valid") {
                    elementMessageOublieLabel.text(
                        "Mail invalide");
                } else if (JSONParsed.error_description ==
                    "no user with this email") {
                    elementMessageOublieLabel.text(
                        "Adresse email inexistante");
                } else if (JSONParsed.error_description ==
                    "failed to execute select query") {
                    elementMessageOublieLabel.text(
                        "Impossible de vous identifier");
                } else if (JSONParsed.error_description ==
                    "mail not sent") {
                    elementMessageOublieLabel.text(
                        "Impossible d'envoyer le mail");
                } else {
                    elementMessageOublieLabel.text("Erreur");
                }
            }
        });
    }
});

function userConnected() {
    var elementConnectButton = $("#image_utilisateur");
    var elementImportButton = $("#import_button");
    elementConnectButton.attr("src", "img/menuIcon.png");
    elementConnectButton.parent().attr("href", "#popupMenu");
    elementImportButton.css("display", "block");
}

function userDisconnected() {
    var elementConnectButton = $("#image_utilisateur");
    var elementImportButton = $("#import_button");
    elementConnectButton.attr("src", "img/user.png");
    elementConnectButton.parent().attr("href", "#popupConnexion");
    elementImportButton.css("display", "none");
}
$(window).on('popupbeforeposition', 'div:jqmData(role="popup")', function() {
    var notDismissible = $(this).jqmData('dismissible') === false;
    if (notDismissible) {
        $('.ui-popup-screen').off();
    }
});
$(document).ready(function() {
    var fileInput = document.querySelector("#uploadForm");
    var fileData = $('#fileUpload').prop('files');
    var elementLabel = document.getElementById("uploadLabel");
    elementProgress = new ElasticProgress(document.querySelectorAll(
        '.uploadAnimation')[0], {
        align: "center",
        fontFamily: "roboto",
        colorFg: "#FFFFFF",
        colorBg: "#27ae60",
        bleedTop: 110,
        bleedBottom: 40,
        buttonSize: 100,
        labelTilt: 70,
        arrowDirection: "up"
    });
    elementProgress.onClick(function() {
        elementLabel.style.display = 'none';
        elementProgress.open();
    })
    elementProgress.onOpen(function() {
        var formData = new FormData();
        formData.append('pseudoPost', pseudo);
        formData.append('passwordPost', passwordHash);
        formData.append('file', $('input[type=file]')[0].files[
            0]);
        $.ajax({
            type: 'POST',
            url: 'apis/upload.php',
            data: formData,
            xhr: function() {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener(
                        'progress', progress,
                        false);
                }
                return myXhr;
            },
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
                var JSONParsed = data;
                if (JSONParsed.status_code == 0) {
                    if (JSONParsed.error_description ==
                        "extension not authorized") {
                        elementLabel.innerHTML =
                            "Extension non autorisée";
                    } else if (JSONParsed.error_description ==
                        "file already exist") {
                        elementLabel.innerHTML =
                            "Fichier déjà présent";
                    } else if (JSONParsed.error_description ==
                        "file too big") {
                        elementLabel.innerHTML =
                            "Fichier trop volumineux";
                    } else if (JSONParsed.error_description ==
                        "file is not a valid flac file"
                    ) {
                        elementLabel.innerHTML =
                            "Fichier Flac non valide";
                    } else if (JSONParsed.error_description ==
                        "undeclared variables") {
                        elementLabel.innerHTML =
                            "Variables non déclarés";
                    } else if (JSONParsed.error_description ==
                        "connection to database failed"
                    ) {
                        elementLabel.innerHTML =
                            "Connexion bdd impossible";
                    } else if (JSONParsed.error_description ==
                        "failed to execute query") {
                        elementLabel.innerHTML =
                            "Impossible de se connecter";
                    } else if (JSONParsed.error_description ==
                        "username and/or password does not match"
                    ) {
                        elementLabel.innerHTML =
                            "Identifiant(s) incorrect(s)";
                    } else if (JSONParsed.error_description ==
                        "unable to move file") {
                        elementLabel.innerHTML =
                            "Impossible de déplacer le fichier";
                    } else {
                        elementLabel.innerHTML =
                            "Erreur, veuillez réessayer";
                    }
                    elementProgress.fail();
                    var timer = setInterval(
                        function() {
                            elementLabel.innerHTML =
                                "Mettre en ligne";
                            clearInterval(timer);
                        }, 2700);
                } else {
                    elementLabel.innerHTML =
                        "Mettre en ligne";
                }
            },
            error: function(data) {
                console.log(data);
                elementProgress.close();
            }
        });
    });
    elementProgress.onComplete(function() {
        elementProgress.close();
        elementLabel.style.display = '';
    })
    elementProgress.onFail(function() {
        elementProgress.close();
        elementLabel.style.display = '';
    })
});

function progress(e) {
    if (e.lengthComputable && elementProgress) {
        var max = e.total;
        var current = e.loaded;
        var Percentage = current / max;
        elementProgress.setValue(Percentage);
        if (Percentage >= 1) {
            // process completed  
        }
    }
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

function changePasswordAction() {
    var elementDivMenuPanel = $("#menuPanel");
    var elementDivChangerPass = $("#changerpassPanel");
    var elementBackNavBar = $("#backToMenu");
    
    elementBackNavBar.css("display", "block");
    elementDivMenuPanel.css("display", "none");
    elementDivChangerPass.css("display", "block");
}

function navigateToPopupID(page)
{
    $.mobile.changePage(page, 'pop', true, true);
}

$("#visualiserLogButton").click(function(){
	
	var elementListViewLog = $('#listview-log');
	var elementVisualiserLogButton = $('#visualiserLogButton');
	
    if(stateLogLoading == true)
    {
	    stateLogLoading = false;
		navigateToPopupID('#popupVisualiserLogs');
    }
    else
    {
		$('#listview-log li').remove();
	    
	    elementVisualiserLogButton.html("<i class=\"fa fa-refresh fa-spin\"></i>");
	    $.ajax({
				url : 'error.log',
				type : 'GET',
				dataType : 'text',
				success : function(log_file_content, statut) {
					stateLogLoading = true;
					
					var arrayLogContent = log_file_content.split("\n");
					var htmlContent = "";
					for(i = 0; i < arrayLogContent.length; i++)
					{
						htmlContent += '<li><a class="no-margin txt-left list-log" href="#">' + arrayLogContent[i] + '</a></li>';
					}
					
					elementListViewLog.append(htmlContent);
					elementListViewLog.listview( "refresh" );
					elementListViewLog.mCustomScrollbar({
					theme:"minimal"
				});
					
					elementVisualiserLogButton.html("Visualiser les logs");
					
					$('#visualiserLogButton').get(0).click();
	       },
	
	       error : function(resultat, statut, erreur){
		   		elementVisualiserLogButton.html("Visualiser les logs");
	       }

    	});
    }
    
    
   
});
