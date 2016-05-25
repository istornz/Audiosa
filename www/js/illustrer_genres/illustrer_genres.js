/*
    Dimitri DESSUS
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audio Windows 2016 - Audiosa
    
	Fichier: illustrer_genres.js
	Description: Fonctions permettant de changer l'image d'un genre
*/

// Génération du popup 'illustrer les genres'
$("#illustrerGenresButton").click(function() {
	
	// Récupération des éléments relatifs au formulaire
	var elementIllustrerGenresButton 	= $('#illustrerGenresButton');
	var elementListViewIllustrerGenres 	= $('#list_genres_illustration');
	
	// On verifie si le chargement du popup est terminé
	if(stateIllustrerLoading == true)
    {
		// Le chargement est terminé, on affiche le popup
	    stateIllustrerLoading = false;
		navigateToPopupID('#popupIllustrerGenres');
    }
	else
	{
		// Tableau permettant de stocker les genres modifiées
		tableauModificationCoverGenres = []; 
		
		// Génération de l'entête du popup (bannière)
		elementListViewIllustrerGenres.mCustomScrollbar('destroy');
		elementListViewIllustrerGenres.html('<br /><div id="messageInfoDivIllustrerGenres" class="ui-bar ui-bar-a" style="background-color: #e74c3c;display: none;margin-bottom: 18px;margin-left: 20px;margin-right: 20px;"><span id="messageInfoIllustrerGenresLabel" class="messageInfoLabel">Mot de passe incorrect !</span></div>');		
		
		// Envoi de la requête POST asynchrone
		$.ajax({
		method: "POST",
		url: "apis/load_playlist_choices.php",
		data: { type: "genres"}
		})
		.done(function( msg ) {
			// Chargement terminé
			stateIllustrerLoading = true;
			
			// Test de la valeur "status_code" présente dans la réponse JSON
			if(msg.status_code == 1)
			{
				// Pour chaque genre présent dans la bdd on génere une nouvelle division
				for(var indiceGenre=0; indiceGenre < msg.genres.length; indiceGenre++) {
					elementListViewIllustrerGenres.append('<div id="'+escapeHtml(msg.genres[indiceGenre].idGENRES)+'_genrec" style="background-image: url(\'img/covers_genres/'+ escapeHtml(msg.genres[indiceGenre].image) +'\') !important; background-position: 50% !important; background-size: cover !important; cursor: pointer !important;" data-title="'+escapeHtml(msg.genres[indiceGenre].nom)+'" class="categories categories_genres cat_genres upload"><input id="'+escapeHtml(msg.genres[indiceGenre].idGENRES)+'_inputGenres" type="file" name="upload" onchange="changeIllustrationGenres(\''+escapeHtml(msg.genres[indiceGenre].idGENRES)+'\');"/><div class="genre_title" style="margin-top: -39px !important;">'+escapeHtml(msg.genres[indiceGenre].nom)+'</div></div>');
				}
			}
			
			elementListViewIllustrerGenres.mCustomScrollbar({
				theme:"minimal"
			});
			
			elementIllustrerGenresButton.get(0).click();
		});
	}
});

// Fonction executée de la selection d'une nouvelle image pour un genre 
function changeIllustrationGenres(idGenres)
{
	// Récupération des élements relatifs au genre
	var elementDivGenres 		= $('#'+ idGenres +'_genrec');
	var elementInputGenres		= $('#'+ idGenres +'_inputGenres');
	var elementValiderGenres	= $('#valider_genres_illustrationButton');
	
	// Récupération de l'image sélectionnée
	var coverGenres				= elementInputGenres.get(0).files[0];
	var blobURLGenresCover		= window.URL.createObjectURL(coverGenres);
	
	// On affiche l'image au sein de la division correspondante
	elementDivGenres.css("background-image", 'url(' + blobURLGenresCover + ')');
	
	if(tableauModificationCoverGenres.indexOf(idGenres) == -1)
	{
		// Le genre n'a pas été modifié avant, on l'ajoute donc dans le tableau
		tableauModificationCoverGenres.push(idGenres);
	}
	
	// Affichage du bouton de validation si au moins 1 genre à été modifié
	if(tableauModificationCoverGenres.length > 0)
		elementValiderGenres.css("display", "block");
	else
		elementValiderGenres.css("display", "none");
}

// Fonction permettant d'envoyer les modifications apportées au serveur
function valider_genres_illustration()
{
	// Conversion tableau JavaScript en chaîne JSON
	var JSONStringImageArray				= JSON.stringify(tableauModificationCoverGenres);
	
	// Récupération des elements relatifs au formulaire
	var elementIllustrationGenresPopup		= $("#popupIllustrerGenres");
	var elementValiderGenres				= $('#valider_genres_illustrationButton');
	var elementMessageIllustrerGenresDiv 	= $("#messageInfoDivIllustrerGenres");
    var elementMessageIllustrerGenresLabel 	= $("#messageInfoIllustrerGenresLabel");
	
	// Constitution du formulaire à soumettre
	var formData = new FormData;
    formData.append('pseudoPost', pseudo);
    formData.append('passwordPost', passwordHash);
    formData.append('imageGenrePost', JSONStringImageArray);
	
	// Mise en place de l'animation de chargement
	elementValiderGenres.removeClass( "ui-icon-check ui-btn-icon-notext" );
    elementValiderGenres.html("<i class=\"fa fa-refresh fa-spin\"></i>");
	
	for(i = 0; i < tableauModificationCoverGenres.length; i++)
	{
		// Récupération de chaque image modifiée
		var elementInputGenres = $('#'+ tableauModificationCoverGenres[i] +'_inputGenres');
		formData.append(tableauModificationCoverGenres[i], elementInputGenres.get(0).files[0] );
	}
	
	// Envoi de la requête POST asynchrone
	$.ajax({
        url: './apis/edit_genres_cover.php',
        type: 'POST',
        data: formData,
        async: true,
        success: function (data) {
            var JSONParsed = data; // Parse du JSON
			
			// Suppression de l'animation de chargement sur le bouton
			elementValiderGenres.html("");
			elementValiderGenres.addClass( "ui-icon-check ui-btn-icon-notext" );
            
			// Afichage bannière
            elementMessageIllustrerGenresDiv.css("display", "block");
            elementMessageIllustrerGenresDiv.addClass("animated bounceIn");
			window.setTimeout(function() {
                elementMessageIllustrerGenresDiv.removeClass(
                    "animated bounceIn");
            }, 500);
            
			// Test de la valeur "status_code" présente dans la réponse JSON
            if (JSONParsed.status_code == 1)
            {
				// On change l'affichage de la bannière en vert car 
				// le changement à bien été effectué
                elementMessageIllustrerGenresDiv.css("background-color",
                    "#16a085");
                elementMessageIllustrerGenresLabel.text("Changement reussie !");
				
				// Mise en place d'un timer de 1s permettant de faire
				// disparaître le popup une fois le temps écoulé
                window.setTimeout(function() {
                    elementMessageIllustrerGenresDiv.css("display", "none");
		            elementIllustrationGenresPopup.popup("close");
	                blurAction(0, fullPage);
                }, 1000);
	        }
	        else
	        {
				// On change l'affichage de la bannière en rouge car 
				// une erreur est survenue lors du changement
		        elementMessageIllustrerGenresDiv.css("background-color",
                    "#e74c3c");
                
				// On test l'erreur retournée par le serveur
				// Puis on l'affiche aux yeux de l'utilisateur
                switch(JSONParsed.error_description)
                {
	            	case "undeclared variables":
	                    elementMessageIllustrerGenresLabel.text("Variable(s) non déclaré(es)");
	                    break;
	                case "connection to database failed":
	                    elementMessageIllustrerGenresLabel.text("Connexion à la bdd impossible");
	                    break;
	                case "username and/or password does not match":
	                    elementMessageIllustrerGenresLabel.text("Identifiant(s) incorrect(s)");
	                    break;
	                case "unable to login":
	                    elementMessageIllustrerGenresLabel.text("Impossible de se connecter");
	                    break;
                }
	        }
        },
        cache: false,
        contentType: false,
        processData: false,
        error: function(data) {
            elementValiderGenres.html("");
			elementValiderGenres.addClass( "ui-icon-check ui-btn-icon-notext" );
		}
    });
}