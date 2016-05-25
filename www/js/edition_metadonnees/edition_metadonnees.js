/*
    Dimitri DESSUS
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audio Windows 2016 - Audiosa
    
	Fichier: edition_metadonnees.js
	Description: Fonctions permettant de modifier les métadonnées d'une musique
*/

// Fonction executée lors du chargement du popup d'édition
function loadEditMetatagPopup(idArrayMusic)
{
	// Récupération des éléments relatifs au popup d'édition
	var elementListview 		= $("#listview-editionMetadonnee");
	var elementTitreMusique 	= $("#titreMusiqueEdition");
	var elementArtisteMusique 	= $("#nomArtisteEdition");
	var elementAlbumMusique 	= $("#nomAlbumEdition");
	var elementCoverMusique 	= $("#imgCoverEditionMetadonnee");
	var elementPreviewPochette 	= $("#coverPreview");
	var popEditionMetadonnee 	= $('#popupEditionMetadonnee');
	
	var editionArray 	= []; 	// Déclaration tableau temporaire
	updateDataArray		= [];	// Tableau permettant de stocker les métadonnée à mettre à jour
	alterDataArray 		= [];	// Tableau permettant de stocker les métadonnée à mettre à jour et à ajouter dans la bdd
	currentMetatag 		= 0;	// Permet de placer les identifiants de chaque élement du formulaire
	idPisteEdit			= musicArray[idArrayMusic]["idPISTES"]; // Récupération de l'id de la musique à éditer
	md5PisteEdit		= musicArray[idArrayMusic]["md5"];		// Récupération du hash MD5 de la musique 
	
	// Génération de l'en-tête du popup
	elementTitreMusique.text(musicArray[idArrayMusic]["title"]);
	elementArtisteMusique.text(musicArray[idArrayMusic]["artist"]);
	elementAlbumMusique.text(musicArray[idArrayMusic]["album"]);
	elementCoverMusique.attr("src", "./img/covers/" + musicArray[idArrayMusic]["cover"] + "?"+ddate.getTime());
	elementPreviewPochette.attr("src", "./img/covers/" + musicArray[idArrayMusic]["cover"] + "?"+ddate.getTime());
	
	// On supprime les cellules présentes dans la listview
	$('#listview-editionMetadonnee li').remove();
	
	// On parcours les métadonnées de la piste
	for (var colonne in musicArray[idArrayMusic])
    {
	    var titreColonne = colonne; // Assignation du titre de la métadonnée
	    var valeurColonne = musicArray[idArrayMusic][colonne]; // Assignation de la valeur de la métadonnée
	    
		// Si le titre est différent des valeurs ci-dessous, on ajoute la métadonnée dans le tableau temporaire
	    if(titreColonne != "idPISTES" && titreColonne != "cover" && titreColonne != "idGENRES" && titreColonne != "image" && titreColonne != "md5")
		{			
			editionArray.push({
									colonneTitle: titreColonne,
									colonneValue: valeurColonne
            					});
		}
    }
    
    // Récupération des métadonnées à modifier dans le tableau
    // indexIDGenre = editionArray.findIndex(x => x.colonneTitle=="genre"); Ne marche pas sous Safari
    // indexNomGenre = editionArray.findIndex(x => x.colonneTitle=="nom"); Ne marche pas sous Safari
    indexIDGenre = editionArray.findIndex(function (x) {
		return x.colonneTitle == "genre";
	});
    indexNomGenre = editionArray.findIndex(function (x) {
		return x.colonneTitle == "nom";
	});
	
    // Changement titre metatag : 'nom' par 'genre'
    editionArray[indexNomGenre]['colonneTitle'] = "genre";
    // Echange de l'ID du genre par son nom
    editionArray[indexIDGenre] = editionArray[indexNomGenre];
    // Suppression du nom du genre, actuellement en doublon
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
	
	// Affichage du popup
	popEditionMetadonnee.popup('open', { transition: 'pop' }); 
}

// Fonction permettant d'ajouter une nouvelle métadonnée non standard
function addCustomMetatag()
{
	var elementListview = $("#listview-editionMetadonnee");
	var elementMScroll	= elementListview.parents(".mCustomScrollbar");
	
	// Génération de la cellule en HTML
	var htmlContent = '<li class="cellMetadonnee"><div class="ui-input-text ui-body-s ui-corner-all ui-mini metadonnee_left metadonnee_field ui-shadow-inset"><input style="text-align:right;" data-theme="s" data-wrapper-class="metadonnee_left metadonnee_left" type="text" data-mini="true" name="custom_metatag_title_meta'+ customMetatag +'" id="custom_metatag_title_meta'+ customMetatag +'" oninput="metatagCheckArray(' + customMetatag + ', 1);"></div><div class="ui-input-text ui-body-s ui-corner-all ui-mini metadonnee_right ui-shadow-inset"><input data-theme="s" data-wrapper-class="metadonnee_right" type="text" data-mini="true" name="custom_metatag_content_meta'+ customMetatag +'" id="custom_metatag_content_meta'+ customMetatag +'" oninput="metatagCheckArray(' + customMetatag + ', 1);"></div></li>';
	
	// Ajout de la cellule au sein de la listview
	elementListview.append(htmlContent);
	elementListview.listview( "refresh" );
	elementMScroll.mCustomScrollbar("scrollTo", "bottom");
	customMetatag++;
}

// Fonction permettant d'ajouter les métadonnées dans un tableau spécifique
function metatagCheckArray(idMetatag, metatagStyle)
{
	// Déclarations des variables
	var elementTitleEdit	= $("#titreMusiqueEdition");
	var elementArtistEdit	= $("#nomArtisteEdition");
	var elementAlbumEdit	= $("#nomAlbumEdition");
	var elementMetatagTitle = '';
	var elementMetatagValue = '';
	var colonneTitle		= '';
	var colonneValue		= '';
	var tempArray 			= [];
	
	//Si 'metatagStyle' est égale à 0 alors la métadonnée est dejà présente dans la base de donnée
	if(metatagStyle == 0)
	{
		// On copie le contenu du tableau des métadonnées dejà présentes dans le tableau temporaire
		tempArray = updateDataArray;
		elementMetatagTitle = $("#metatag_title_meta" + idMetatag);
		elementMetatagValue = $("#metatag_content_meta" + idMetatag);
		// On récupère le titre de la métatonnée depuis la balise <span>, on le met en minuscule
		colonneTitle = elementMetatagTitle.text().toLowerCase();
	}
	else
	{
		// On copie le contenu du tableau des métadonnées non présentes dans le tableau temporaire
		tempArray = alterDataArray;
		elementMetatagTitle = $("#custom_metatag_title_meta" + idMetatag);
		elementMetatagValue = $("#custom_metatag_content_meta" + idMetatag);
		// On récupère le titre de la métatonnée depuis la balise input
		colonneTitle = elementMetatagTitle[0].value;
	}
	
	// On récupère la valeur de la métadonnée depuis la balise input
	colonneValue = elementMetatagValue[0].value;
	
	// On test le titre de la métadonnée pour modifier, en conséquence, l'en-tête
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
	
	// On vérifie si l'id de la metadonnée existe deja dans le tableau ou non; X étant une variable inconnue
	indexColumn = tempArray.findIndex(function (x) {
		return x.idMetatag == idMetatag;
	});
	
	if(indexColumn == -1)
	{
		//La clé 'idMetatag' est introuvable on va la créer
		tempArray.push({
							idMetatag: idMetatag,
							column: colonneTitle,
							value: colonneValue
						})
	}
	else
	{
		// La clé existe, on va donc mettre à jour les valeurs de l'objet présent dans le tableau
		tempArray[indexColumn]['column'] = colonneTitle;
		tempArray[indexColumn]['value'] = colonneValue;
	}
	
	//On assigne de nouveau le tableau concerné par le tableau modifié
	if(metatagStyle == 0)
		updateDataArray = tempArray;
	else
		alterDataArray = tempArray;
}

// Affichage de la section d'édition des métadonnées 
$("#radio_choice_detail_edition").on('change', function ()
{
	// Récupération des éléments relatifs au popup d'édition
	var elementDivDetail 	= $("#divlist-editionMetadonnee");
	var elementDivPochette 	= $("#divlist-editionPochette");
	var buttonEditLabel 	= $("#titleEditButton");
	var inputFormUpload 	= $("#uploadPochetteInput");
	var editButtonUpload 	= $("#editButtonMeta");
	
	// Modification de l'affichage
	elementDivDetail.css("display", "block");
	elementDivPochette.css("display", "none");
	buttonEditLabel.text("Ajouter une métadonnée");
	inputFormUpload.css("display", "none");
	editButtonUpload.attr("onclick", "addCustomMetatag();");
});

// Affichage de la section changement de la pochette 
$("#radio_choice_pochette_edition").on('change', function ()
{
	// Récupération des éléments relatifs au popup d'édition
	var elementDivDetail 	= $("#divlist-editionMetadonnee");
	var elementDivPochette 	= $("#divlist-editionPochette");
	var buttonEditLabel 	= $("#titleEditButton");
	var inputFormUpload 	= $("#uploadPochetteInput");
	var editButtonUpload 	= $("#editButtonMeta");
	
	// Modification de l'affichage
	elementDivDetail.css("display", "none");
	elementDivPochette.css("display", "block");
	buttonEditLabel.text("Modifier");
	inputFormUpload.css("display", "block");
	editButtonUpload.attr("onclick", "");
});

// Fonction executée lors de la selection d'une image
$("#uploadPochetteInput").on('change', function ()
{
	var elementCoverPreview 		= $("#coverPreview");
	var elementCoverPreviewHeader 	= $("#imgCoverEditionMetadonnee");
	
	// Récupération de l'image
	var cover			= this.files[0]; // Premier fichier de l'element 'input'
	var blobURLCover	= window.URL.createObjectURL(this.files[0]); // Création objet URL
	
	// Affichage de l'image
	elementCoverPreview.attr("src", blobURLCover);
	elementCoverPreviewHeader.attr("src", blobURLCover);
});

// Fonction permettant d'envoyer la requête POST asynchrone
function launchRequestEditMetatag()
{
	// Conversion tableaux JavaScript en chaîne JSON
    var JSONStringUpdate 			= JSON.stringify(updateDataArray);
    var JSONStringAlter 			= JSON.stringify(alterDataArray);
	
	// Récupération des elements relatifs au formulaire
    var elementEditMetadonneePopup 	= $("#popupEditionMetadonnee");
    var elementMessageEditMetaDiv 	= $("#messageInfoDivEditionMetadonnees");
    var elementMessageEditMetaLabel = $("#messageInfoEditionMetadonneesLabel");
    var elementValiderButton		= $("#validerMetadonneesButton");
    
	// Création et génération du formulaire
    var formData = new FormData;
    formData.append('pseudoPost', pseudo); 			 // Pseudo de l'utilisateur
    formData.append('passwordPost', passwordHash);	 // Hash MD5 du mot de passe
    formData.append('idPISTES', idPisteEdit);		 // Identifiant de la musique éditée
    formData.append('updateData', JSONStringUpdate); // Les metadonnées à mettre à jour
    formData.append('alterData', JSONStringAlter);	 // Les metadonnées à ajouter/mettre à jour
    
	// On vérifie si la pochette a été modifiée
    if($( '#uploadPochetteInput' )[0].files[0] != null)
    {
		// La pochette a subie une modification
		// On ajoute la pochette et le hash MD5 du fichier dans le formulaire
	    formData.append('cover', $( '#uploadPochetteInput' )[0].files[0] );
	    formData.append('md5',  md5PisteEdit);
    }
    
	// Mise en place de l'animation de chargement
    elementValiderButton.removeClass( "ui-icon-check ui-btn-icon-notext" );
    elementValiderButton.html("<i class=\"fa fa-refresh fa-spin\"></i>");
    
	// Envoi de la requête POST asynchrone
    $.ajax({
        url: './apis/edit_metatag.php',
        type: 'POST',
        data: formData,
        async: true,
        success: function (data) {
            var JSONParsed = data; // Parse du JSON
            
			// Suppression de l'animation de chargement sur le bouton
            elementValiderButton.addClass( "ui-icon-check ui-btn-icon-notext" );
			elementValiderButton.html("");
            
			// Afichage bannière
            elementMessageEditMetaDiv.css("display", "block");
            elementMessageEditMetaDiv.addClass("animated bounceIn");
			window.setTimeout(function() {
                elementMessageEditMetaDiv.removeClass(
                    "animated bounceIn");
            }, 500);
            
			// Test de la valeur "status_code" présente dans la réponse JSON
            if (JSONParsed.status_code == 1)
            {
				// On change l'affichage de la bannière en vert car 
				// le changement à bien été effectué
                elementMessageEditMetaDiv.css("background-color",
                    "#16a085");
                elementMessageEditMetaLabel.text("Changement reussie !");
                
				// Mise en place d'un timer de 1s permettant de faire
				// disparaître le popup une fois le temps écoulé
				window.setTimeout(function() {
                    elementMessageEditMetaDiv.css("display", "none");
                    
					// On recharge les morceaux
					get_music("morceaux");
					
		            elementEditMetadonneePopup.popup("close");
	                blurAction(0, fullPage);
                }, 1000);
	        }
	        else
	        {
				// On change l'affichage de la bannière en rouge car 
				// une erreur est survenue lors du changement
		        elementMessageEditMetaDiv.css("background-color", "#e74c3c");
                
				// On test l'erreur retournée par le serveur
				// Puis on l'affiche aux yeux de l'utilisateur
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
            }
    });
}