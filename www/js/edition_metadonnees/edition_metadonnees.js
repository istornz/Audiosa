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
	elementCoverMusique.attr("src", "./img/covers/" + musicArray[idArrayMusic]["cover"] + "?"+ddate.getTime());
	elementPreviewPochette.attr("src", "./img/covers/" + musicArray[idArrayMusic]["cover"] + "?"+ddate.getTime());
	
	$('#listview-editionMetadonnee li').remove();
	var editionArray = [];
    for (var colonne in musicArray[idArrayMusic])
    {
	    var titreColonne = colonne;
	    var valeurColonne = musicArray[idArrayMusic][colonne];
	    
	    if(titreColonne != "idPISTES" && titreColonne != "cover" && titreColonne != "idGENRES" && titreColonne != "image" && titreColonne != "md5")
		{			
			editionArray.push({
									colonneTitle: titreColonne,
									colonneValue: valeurColonne
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