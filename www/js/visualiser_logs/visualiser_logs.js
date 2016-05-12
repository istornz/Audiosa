$("#visualiserLogButton").click(function()
{
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