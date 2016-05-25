/*
    Dimitri DESSUS
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audio Windows 2016 - Audiosa
    
	Fichier: visualiser_logs.js
	Description: Fonction permettant de récupérer les logs du serveur
*/

$("#visualiserLogButton").click(function()
{
	// Récupération des éléments relatifs au popup de visualisation
	var elementListViewLog 			= $('#listview-log');
	var elementVisualiserLogButton 	= $('#visualiserLogButton');
	
	// On verifie si le chargement du popup est terminé
    if(stateLogLoading == true)
    {
		// Le chargement est terminé, on affiche le popup
	    stateLogLoading = false;
		navigateToPopupID('#popupVisualiserLogs');
    }
    else
    {
		// Suppression de toutes les cellules
		$('#listview-log li').remove();
	    
		// Mise en place de l'animation de chargement
	    elementVisualiserLogButton.html("<i class=\"fa fa-refresh fa-spin\"></i>");
	    
		// Envoi de la requête GET asynchrone
		$.ajax({
				url : 'error.log',
				type : 'GET',
				async : true,
				cache: false,
				dataType : 'text',
				success : function(log_file_content, statut) {
					// Chargement terminé
					stateLogLoading = true;
					
					// Création d'un tableau contenant tous les enregistrements
					var arrayLogContent = log_file_content.split("\n");
					var htmlContent 	= "";
					
					for(i = 0; i < arrayLogContent.length; i++)
					{
						// Génération des cellules pour chaque enregistrement
						if(arrayLogContent[i].length > 0)
							htmlContent += '<li><a class="no-margin txt-left list-log" href="#">' + arrayLogContent[i] + '</a></li>';
						
					}
					
					// Mise à jour de la listview
					elementListViewLog.append(htmlContent);
					elementListViewLog.mCustomScrollbar( "destroy" );
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