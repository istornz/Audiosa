elementProgress			= null;
pseudo					= null;
passwordHash			= null;
stateLogLoading			= false;
stateIllustrerLoading	= false;
customMetatag			= 0;
currentMetatag			= 0;
idPisteEdit				= null;
md5PisteEdit			= null;

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

$(window).on('popupbeforeposition', 'div:jqmData(role="popup")', function() {
    var notDismissible = $(this).jqmData('dismissible') === false;
    if (notDismissible) {
        $('.ui-popup-screen').off();
    }
});

$(document).ready(function() {
    var fileInput = document.querySelector("#uploadForm");
    var fileData = $('#fileUpload').prop('files');
    var elementUploadLabel = document.getElementById("uploadLabel");
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
        elementUploadLabel.style.display = 'none';
        elementProgress.open();
    })
	
    elementProgress.onOpen(function() {
        var formData = new FormData();
        formData.append('pseudoPost', pseudo);
        formData.append('passwordPost', passwordHash);
        formData.append('file', $('#fileUpload')[0].files[0]);
        $.ajax({
            type: 'POST',
            url: './apis/upload.php',
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
					
					elementProgress.fail();
					switch(JSONParsed.error_description)
					{
						case "undeclared variables":
							elementUploadLabel.innerHTML = "Variable(s) non déclaré(es)";
							break;
						case "connection to database failed":
							elementUploadLabel.innerHTML = "Connexion à la bdd impossible";
							break;
						case "extension not authorized":
							elementUploadLabel.innerHTML = "Extension non autorisée";
							break;
						case "file already exist":
							elementUploadLabel.innerHTML = "Fichier déjà présent";
							break;
						case "file too big":
							elementUploadLabel.innerHTML = "Fichier trop volumineux";
							break;
						case "file is not a valid flac file":
							elementUploadLabel.innerHTML = "Fichier Flac non valide";
							break;
						case "failed to execute query":
							elementUploadLabel.innerHTML = "Impossible de se connecter";
							break;
						case "username and/or password does not match":
							elementUploadLabel.innerHTML = "Identifiant(s) incorrect(s)";
							break;
						case "unable to move file":
							elementUploadLabel.innerHTML = "Impossible de déplacer le fichier";
							break;
						default:
							elementUploadLabel.innerHTML = "Erreur";
							break;
					}
					
                    var timer = setInterval(
                        function() {
                            elementUploadLabel.innerHTML =
                                "Mettre en ligne";
                            clearInterval(timer);
                        }, 2700);
                } else {
                    elementUploadLabel.innerHTML =
                        "Mettre en ligne";
                }
            },
            error: function(data) {
                
                elementProgress.close();
            }
        });
    });
	
    elementProgress.onComplete(function() {
        elementProgress.close();
        elementUploadLabel.style.display = '';
    })
	
    elementProgress.onFail(function() {
        elementProgress.close();
        elementUploadLabel.style.display = '';
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

function loadEditMetatagPopup(idArrayMusic)
{
	var elementListview = $("#listview-editionMetadonnee");
	var elementTitreMusique = $("#titreMusiqueEdition");
	var elementArtisteMusique = $("#nomArtisteEdition");
	var elementAlbumMusique = $("#nomAlbumEdition");
	var elementCoverMusique = $("#imgCoverEditionMetadonnee");
	var elementPreviewPochette = $("#coverPreview");
	var popEditionMetadonnee = $('#popupEditionMetadonnee');
	
	updateDataArray	= [];
	alterDataArray 	= [];
	currentMetatag 	= 0;
	idPisteEdit		= musicArray[idArrayMusic]["idPISTES"];
	md5PisteEdit	= musicArray[idArrayMusic]["md5"];
	
	elementTitreMusique.text(musicArray[idArrayMusic]["title"]);
	elementArtisteMusique.text(musicArray[idArrayMusic]["artist"]);
	elementAlbumMusique.text(musicArray[idArrayMusic]["album"]);
	elementCoverMusique.attr("src", "./img/covers/" + musicArray[idArrayMusic]["cover"]);
	elementPreviewPochette.attr("src", "./img/covers/" + musicArray[idArrayMusic]["cover"]);
	
	$('#listview-editionMetadonnee li').remove();
	var editionArray = [];
    for (var colonne in musicArray[idArrayMusic])
    {
	    var colonneTitle = colonne;
	    var colonneValue = musicArray[idArrayMusic][colonne];
	    
	    if(colonneTitle != "idPISTES" && colonneTitle != "cover" && colonneTitle != "idGENRES" && colonneTitle != "image" && colonneTitle != "md5")
		{			
			editionArray.push({
									colonneTitle: colonneTitle,
									colonneValue: colonneValue
            					});
		}
    }
    
    // Récupération des métadonnées à modifier dans le tableau
    //indexIDGenre = editionArray.findIndex(x => x.colonneTitle=="genre"); Ne marche pas sous Safari
    //indexNomGenre = editionArray.findIndex(x => x.colonneTitle=="nom"); Ne marche pas sous Safari
    indexIDGenre = editionArray.findIndex(function (x) {
		return x.colonneTitle == "genre";
	});
    indexNomGenre = editionArray.findIndex(function (x) {
		return x.colonneTitle == "nom";
	});
	
    //Changement nom metatag 'nom' par 'genre'
    editionArray[indexNomGenre]['colonneTitle'] = "genre";
    //Swap de l'ID du genre par son nom
    editionArray[indexIDGenre] = editionArray[indexNomGenre];
    //Suppression du nom du genre, actuellement en doublon
    editionArray.splice(indexNomGenre, 1);
    
    //Application du tableau modifié
    for (i = 0; i < editionArray.length; i++)
    {
		// Assignation des métadonnées dans un tableau
		var htmlContent = '<li class="cellMetadonnee ui-li-static ui-body-inherit"><span name="metatag_title_meta'+ currentMetatag +'" id="metatag_title_meta'+ currentMetatag +'" class="metadonnee_left metadonnee_label" for="metatag_title_meta'+ currentMetatag +'">'+ firstLetterUppercase(editionArray[i]['colonneTitle']) +'</span><div class="ui-input-text ui-body-s ui-corner-all ui-mini metadonnee_right ui-shadow-inset"><input data-theme="s" data-wrapper-class="metadonnee_right" type="text" data-mini="true" name="metatag_content_meta'+ currentMetatag +'" id="metatag_content_meta'+ currentMetatag +'" value="'+ editionArray[i]['colonneValue'] +'" oninput="metatagCheckArray('+ currentMetatag +', 0);"></div></li>';
	    
    	elementListview.append(htmlContent);
    	currentMetatag++;
	}
	
	elementListview.listview( "refresh" );
	elementListview.append();
	
	popEditionMetadonnee.popup('open', { transition: 'pop' }); 
}

function addCustomMetatag()
{
	var elementListview = $("#listview-editionMetadonnee");
	var elementPLS = elementListview.parents(".mCustomScrollbar");
	
	var htmlContent = '<li class="cellMetadonnee"><div class="ui-input-text ui-body-s ui-corner-all ui-mini metadonnee_left metadonnee_field ui-shadow-inset"><input style="text-align:right;" data-theme="s" data-wrapper-class="metadonnee_left metadonnee_left" type="text" data-mini="true" name="custom_metatag_title_meta'+ customMetatag +'" id="custom_metatag_title_meta'+ customMetatag +'" oninput="metatagCheckArray(' + customMetatag + ', 1);"></div><div class="ui-input-text ui-body-s ui-corner-all ui-mini metadonnee_right ui-shadow-inset"><input data-theme="s" data-wrapper-class="metadonnee_right" type="text" data-mini="true" name="custom_metatag_content_meta'+ customMetatag +'" id="custom_metatag_content_meta'+ customMetatag +'" oninput="metatagCheckArray(' + customMetatag + ', 1);"></div></li>';
	
	elementListview.append(htmlContent);
	elementListview.listview( "refresh" );
	elementPLS.mCustomScrollbar("scrollTo", "bottom");
	customMetatag++;
}

function metatagCheckArray(idMetatag, metatagStyle)
{
	//Déclarations des variables
	var elementTitleEdit	= $("#titreMusiqueEdition");
	var elementArtistEdit	= $("#nomArtisteEdition");
	var elementAlbumEdit	= $("#nomAlbumEdition");
	var elementMetatagTitle = '';
	var elementMetatagValue = '';
	var colonneTitle		= '';
	var colonneValue		= '';
	var tempArray 			= [];
	
	//Si metatagStyle est égale à 0 alors la métadonnée est dejà présente dans la base de donnée
	if(metatagStyle == 0)
	{
		//On copie le contenu du tableau des métadonnées dejà présentes dans le tableau temporaire
		tempArray = updateDataArray;
		elementMetatagTitle = $("#metatag_title_meta" + idMetatag);
		elementMetatagValue = $("#metatag_content_meta" + idMetatag);
		//On récupère le titre de la métatonnée depuis la balise span, on le met en minuscule
		colonneTitle = elementMetatagTitle.text().toLowerCase();
	}
	else
	{
		//On copie le contenu du tableau des métadonnées non présentes dans le tableau temporaire
		tempArray = alterDataArray;
		elementMetatagTitle = $("#custom_metatag_title_meta" + idMetatag);
		elementMetatagValue = $("#custom_metatag_content_meta" + idMetatag);
		//On récupère le titre de la métatonnée depuis la balise input
		colonneTitle = elementMetatagTitle[0].value;
	}
	
	//On récupère la valeur de la métadonnée depuis la balise input
	colonneValue = elementMetatagValue[0].value;
	
	switch (colonneTitle) {
	    case "title":
	        elementTitleEdit.html(colonneValue);
	        break;
	    case "artist":
	        elementArtistEdit.html(colonneValue);
	        break;
	    case "album":
	        elementAlbumEdit.html(colonneValue);
	        break;
	}
	
	//On vérifie si l'id de la metadonnée existe deja dans le tableau ou non ou x est une variable inconnue
	//indexColumn = tempArray.findIndex(x => x.idMetatag==idMetatag); Ne marche pas sous Safari
	indexColumn = tempArray.findIndex(function (x) {
		return x.idMetatag == idMetatag;
	});
	
	if(indexColumn == -1)
	{
		//La clé idMetatag est introuvable on va la créer
		tempArray.push({
							idMetatag: idMetatag,
							column: colonneTitle,
							value: colonneValue
						})
	}
	else
	{
		//La clé existe, on va donc mettre à jour les valeurs de l'objet présent dans le tableau
		tempArray[indexColumn]['column'] = colonneTitle;
		tempArray[indexColumn]['value'] = colonneValue;
	}
	
	//On assigne de nouveau le tableau concerné par le tableau modifié
	if(metatagStyle == 0)
		updateDataArray = tempArray;
	else
		alterDataArray = tempArray;
}

function firstLetterUppercase(string)
{
    return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

$("#radio_choice_detail_edition").on('change', function ()
{
	var elementDivDetail = $("#divlist-editionMetadonnee");
	var elementDivPochette = $("#divlist-editionPochette");
	var buttonEditLabel = $("#titleEditButton");
	var inputFormUpload = $("#uploadPochetteInput");
	var editButtonUpload =  $("#editButtonMeta");
	
	elementDivDetail.css("display", "block");
	elementDivPochette.css("display", "none");
	buttonEditLabel.text("Ajouter une métadonnée");
	inputFormUpload.css("display", "none");
	editButtonUpload.attr("onclick", "addCustomMetatag();");
});

$("#radio_choice_pochette_edition").on('change', function ()
{
	var elementDivDetail = $("#divlist-editionMetadonnee");
	var elementDivPochette = $("#divlist-editionPochette");
	var buttonEditLabel = $("#titleEditButton");
	var inputFormUpload = $("#uploadPochetteInput");
	var editButtonUpload =  $("#editButtonMeta");
	
	elementDivDetail.css("display", "none");
	elementDivPochette.css("display", "block");
	buttonEditLabel.text("Modifier");
	inputFormUpload.css("display", "block");
	editButtonUpload.attr("onclick", "");
});

$("#uploadPochetteInput").on('change', function ()
{
	var elementCoverPreview 		= $("#coverPreview");
	var elementCoverPreviewHeader 	= $("#imgCoverEditionMetadonnee");
	var cover 						= this.files[0];
	var blobURLCover 				= window.URL.createObjectURL(this.files[0]);
	
	elementCoverPreview.attr("src", blobURLCover);
	elementCoverPreviewHeader.attr("src", blobURLCover);
	
	console.log("Changement pochette");
});

function launchRequestEditMetatag()
{
	/*
	console.log("-- MISE EN FORME JSON DES CHAMPS A MODIFIER (UPDATE) --");
    console.log(JSON.stringify(updateDataArray));
    
    console.log("-- MISE EN FORME JSON DES CHAMPS A CREER (ALTER) --");
    console.log(JSON.stringify(alterDataArray));
    */
    
    var JSONStringUpdate 			= JSON.stringify(updateDataArray);
    var JSONStringAlter 			= JSON.stringify(alterDataArray);
    var elementEditMetadonneePopup 	= $("#popupEditionMetadonnee");
    var elementMessageEditMetaDiv 	= $("#messageInfoDivEditionMetadonnees");
    var elementMessageEditMetaLabel = $("#messageInfoEditionMetadonneesLabel");
    var elementValiderButton		= $("#validerMetadonneesButton");
    
    var formData = new FormData;
    formData.append('pseudoPost', pseudo);
    formData.append('passwordPost', passwordHash);
    formData.append('idPISTES', idPisteEdit);
    formData.append('updateData', JSONStringUpdate);
    formData.append('alterData', JSONStringAlter);
    
    if($( '#uploadPochetteInput' )[0].files[0] != null)
    {
	    formData.append('cover', $( '#uploadPochetteInput' )[0].files[0] );
	    formData.append('md5',  md5PisteEdit);
    }
    
    elementValiderButton.removeClass( "ui-icon-check ui-btn-icon-notext" );
    elementValiderButton.html("<i class=\"fa fa-refresh fa-spin\"></i>");
    
    $.ajax({
        url: './apis/edit_metatag.php',
        type: 'POST',
        data: formData,
        async: true,
        success: function (data) {
            var JSONParsed = data;
            
            elementValiderButton.addClass( "ui-icon-check ui-btn-icon-notext" );
			elementValiderButton.html("");
            
            elementMessageEditMetaDiv.css("display", "block");
            elementMessageEditMetaDiv.addClass("animated bounceIn");
			window.setTimeout(function() {
                elementMessageEditMetaDiv.removeClass(
                    "animated bounceIn");
            }, 500);
            
            if (JSONParsed.status_code == 1)
            {
                elementMessageEditMetaDiv.css("background-color",
                    "#16a085");
                elementMessageEditMetaLabel.text("Changement reussie !");
                window.setTimeout(function() {
                    elementMessageEditMetaDiv.css("display", "none");
                    get_music("morceaux");
		            elementEditMetadonneePopup.popup("close");
	                blurAction(0, fullPage);
                }, 1000);
	        }
	        else
	        {
		        elementMessageEditMetaDiv.css("background-color",
                    "#e74c3c");
                    
                switch(JSONParsed.error_description)
                {
	            	case "undeclared variables":
	                    elementMessageEditMetaLabel.text("Variable(s) non déclaré(es)");
	                    break;
	                case "connection to database failed":
	                    elementMessageEditMetaLabel.text("Connexion à la bdd impossible");
	                    break;
	                case "username and/or password does not match":
	                    elementMessageEditMetaLabel.text("Identifiant(s) incorrect(s)");
	                    break;
	                case "unable to login":
	                    elementMessageEditMetaLabel.text("Impossible de se connecter");
	                    break;
	                case "extension not authorized":
	                    elementMessageEditMetaLabel.text("Extension non autorisée (cover)");
	                    break;
	                case "file too big":
	                    elementMessageEditMetaLabel.text("Fichier trop volumineux (cover)");
	                    break;
	                case "file is not a valid image file":
	                    elementMessageEditMetaLabel.text("La cover n'est pas une image valide");
	                    break;
	                case "unable to move file":
	                    elementMessageEditMetaLabel.text("Impossible de déplacer la cover");
	                    break;
	                case "failed to alter table":
	                    elementMessageEditMetaLabel.text("Impossible d'ajouter une métadonnée");
	                    break;
	                case "failed to select genre id":
	                    elementMessageEditMetaLabel.text("Impossible de récupérer l'identifiant du genre");
	                    break;
	                case "failed to update genre id":
	                    elementMessageEditMetaLabel.text("Impossible de mettre à jour l'identifiant du genre");
	                    break;
	                case "failed to insert genre":
	                    elementMessageEditMetaLabel.text("Impossible d'ajouter le genre");
	                    break;
	                case "failed to update metatag":
	                    elementMessageEditMetaLabel.text("Impossible de mettre à jour une métadonnée");
	                    break;
	                default :
	                    elementMessageEditMetaLabel.text("Une erreur est survenue");
	                    break; 	
                }
	        }
        },
        cache: false,
        contentType: false,
        processData: false,
        error: function(data) {
                elementValiderButton.addClass( "ui-icon-check ui-btn-icon-notext" );
				elementValiderButton.html("");
                console.log(data);
            }
    });
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
				cache: false,
				dataType : 'text',
				success : function(log_file_content, statut) {
					stateLogLoading = true;
					
					var arrayLogContent = log_file_content.split("\n");
					var htmlContent 	= "";
					for(i = 0; i < arrayLogContent.length; i++)
					{
						if(arrayLogContent[i].length > 0)
							htmlContent += '<li><a class="no-margin txt-left list-log" href="#">' + arrayLogContent[i] + '</a></li>';
						
					}
					
					elementListViewLog.append(htmlContent);
					elementListViewLog.listview( "refresh" );
					elementListViewLog.mCustomScrollbar({
						theme:"minimal"
					});
					
					elementVisualiserLogButton.html("Visualiser les logs");
					
					elementVisualiserLogButton.get(0).click();
	       },
	
	       error : function(resultat, statut, erreur){
		   		elementVisualiserLogButton.html("Visualiser les logs");
	       }

    	});
    }
});

$("#illustrerGenresButton").click(function(){
	
	var elementIllustrerGenresButton 	= $('#illustrerGenresButton');
	var elementListViewIllustrerGenres 	= $('#list_genres_illustration');
	
	if(stateIllustrerLoading == true)
    {
	    stateIllustrerLoading = false;
		navigateToPopupID('#popupIllustrerGenres');
    }
	else
	{
		elementListViewIllustrerGenres.mCustomScrollbar('destroy');
		elementListViewIllustrerGenres.html("<br />");		
		
		$.ajax({
		method: "POST",
		url: "apis/load_playlist_choices.php",
		data: { type: "genres"}
		})
		.done(function( msg ) {
				stateIllustrerLoading = true;
				
				if(msg.status_code != 1)
				{
					console.log("UNE ERREUR EST SURVENUE");
					//GESTION DES ERREURS
					
					return false;
				}
				
				for(var indiceGenre=0; indiceGenre < msg.genres.length; indiceGenre++) {
					elementListViewIllustrerGenres.append('<div id="'+escapeHtml(msg.genres[indiceGenre].idGENRES)+'_genrec" style="background-image: url(\'img/covers_genres/'+ escapeHtml(msg.genres[indiceGenre].image) +'\') !important;" data-title="'+escapeHtml(msg.genres[indiceGenre].nom)+'" class="categories categories_genres cat_genres upload"><input id="'+escapeHtml(msg.genres[indiceGenre].idGENRES)+'_inputGenres" type="file" name="upload" onchange="changeIllustrationGenres(\''+escapeHtml(msg.genres[indiceGenre].idGENRES)+'\');"/><div class="genre_title" style="margin-top: -39px !important;">'+escapeHtml(msg.genres[indiceGenre].nom)+'</div></div>');
					
				}
				
				elementListViewIllustrerGenres.mCustomScrollbar({
						theme:"minimal"
					});
				
				elementIllustrerGenresButton.get(0).click();
		});
	}

	
});

function changeIllustrationGenres(idGenres)
{
	var elementDivGenres 		= $('#'+ idGenres +'_genrec');
	var elementInputGenres		= $('#'+ idGenres +'_inputGenres');
	var coverGenres				= elementInputGenres.get(0).files[0];
	var blobURLGenresCover		= window.URL.createObjectURL(coverGenres);
	
	elementDivGenres.css("background-image", 'url(' + blobURLGenresCover + ')');
	
	console.log("Changement genres cover");
	console.log(blobURLGenresCover);
}