$("#illustrerGenresButton").click(function() {
	
	var elementIllustrerGenresButton 	= $('#illustrerGenresButton');
	var elementListViewIllustrerGenres 	= $('#list_genres_illustration');
	
	if(stateIllustrerLoading == true)
    {
	    stateIllustrerLoading = false;
		navigateToPopupID('#popupIllustrerGenres');
    }
	else
	{
		tableauModificationCoverGenres = [];
		
		elementListViewIllustrerGenres.mCustomScrollbar('destroy');
		elementListViewIllustrerGenres.html('<br /><div id="messageInfoDivIllustrerGenres" class="ui-bar ui-bar-a" style="background-color: #e74c3c;display: none;margin-bottom: 18px;margin-left: 20px;margin-right: 20px;"><span id="messageInfoIllustrerGenresLabel" class="messageInfoLabel">Mot de passe incorrect !</span></div>');		
		
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
					elementListViewIllustrerGenres.append('<div id="'+escapeHtml(msg.genres[indiceGenre].idGENRES)+'_genrec" style="background-image: url(\'img/covers_genres/'+ escapeHtml(msg.genres[indiceGenre].image) +'\') !important; background-position: 50% !important; background-size: cover !important; cursor: pointer !important;" data-title="'+escapeHtml(msg.genres[indiceGenre].nom)+'" class="categories categories_genres cat_genres upload"><input id="'+escapeHtml(msg.genres[indiceGenre].idGENRES)+'_inputGenres" type="file" name="upload" onchange="changeIllustrationGenres(\''+escapeHtml(msg.genres[indiceGenre].idGENRES)+'\');"/><div class="genre_title" style="margin-top: -39px !important;">'+escapeHtml(msg.genres[indiceGenre].nom)+'</div></div>');
					
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
	var elementValiderGenres	= $('#valider_genres_illustrationButton');
	var coverGenres				= elementInputGenres.get(0).files[0];
	var blobURLGenresCover		= window.URL.createObjectURL(coverGenres);
	
	elementDivGenres.css("background-image", 'url(' + blobURLGenresCover + ')');
	
	if(tableauModificationCoverGenres.indexOf(idGenres) == -1)
	{
		tableauModificationCoverGenres.push(idGenres);
	}
	
	if(tableauModificationCoverGenres.length > 0)
	{
		elementValiderGenres.css("display", "block");
	}
	else
	{
		elementValiderGenres.css("display", "none");
	}
}

function valider_genres_illustration()
{
	var JSONStringImageArray				= JSON.stringify(tableauModificationCoverGenres);
	var elementIllustrationGenresPopup		= $("#popupIllustrerGenres");
	var elementValiderGenres				= $('#valider_genres_illustrationButton');
	var elementMessageIllustrerGenresDiv 	= $("#messageInfoDivIllustrerGenres");
    var elementMessageIllustrerGenresLabel 	= $("#messageInfoIllustrerGenresLabel");
	
	var formData = new FormData;
    formData.append('pseudoPost', pseudo);
    formData.append('passwordPost', passwordHash);
    formData.append('imageGenrePost', JSONStringImageArray);
	
	elementValiderGenres.removeClass( "ui-icon-check ui-btn-icon-notext" );
    elementValiderGenres.html("<i class=\"fa fa-refresh fa-spin\"></i>");
	
	for(i = 0; i < tableauModificationCoverGenres.length; i++)
	{
		var elementInputGenres = $('#'+ tableauModificationCoverGenres[i] +'_inputGenres');
		formData.append(tableauModificationCoverGenres[i], elementInputGenres.get(0).files[0] );
	}
	
	$.ajax({
        url: './apis/edit_genres_cover.php',
        type: 'POST',
        data: formData,
        async: true,
        success: function (data) {
            var JSONParsed = data;
			
			elementValiderGenres.html("");
			elementValiderGenres.addClass( "ui-icon-check ui-btn-icon-notext" );
            
            elementMessageIllustrerGenresDiv.css("display", "block");
            elementMessageIllustrerGenresDiv.addClass("animated bounceIn");
			window.setTimeout(function() {
                elementMessageIllustrerGenresDiv.removeClass(
                    "animated bounceIn");
            }, 500);
			
			elementValiderGenres.html("");
            
            if (JSONParsed.status_code == 1)
            {
                elementMessageIllustrerGenresDiv.css("background-color",
                    "#16a085");
                elementMessageIllustrerGenresLabel.text("Changement reussie !");
                window.setTimeout(function() {
                    elementMessageIllustrerGenresDiv.css("display", "none");
		            elementIllustrationGenresPopup.popup("close");
	                blurAction(0, fullPage);
                }, 1000);
	        }
	        else
	        {
		        elementMessageIllustrerGenresDiv.css("background-color",
                    "#e74c3c");
                
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
                console.log(data);
				}
    });
}