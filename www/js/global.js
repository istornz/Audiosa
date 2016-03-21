elementProgress = null;

function blurAction(state, div)
{
	if(state == 1)
	{
		div.className = "fullPageBlurred";
	}
	else
	{
		div.className = "";
	}
}

$( "#formConnexionPopup" ).submit(function( event ) 
{
  event.preventDefault();
  var elementPseudoField 	= $( "#pseudo-text" );
  var elementPaswordField 	= $( "#password-text" );
  
  var elementPseudoFieldDiv		= elementPseudoField.parent();
  var elementPaswordFieldDiv	= elementPaswordField.parent();
  
  var elementMessageDiv			= $( "#messageInfoDiv" );
  var elementMessageLabel		= $( "#messageInfoLabel" );
  var elementConnexionButton	= $( "#connexionButton" );
  
  if(elementPseudoField.val().length == 0 || elementPaswordField.val().length == 0)
  {
	  elementMessageDiv.css("background-color", "#e74c3c");
	  if(elementPseudoField.val().length == 0 && elementPaswordField.val().length == 0)
	  {
		elementMessageDiv.css("display", "block");
		elementMessageLabel.text("Les deux champs sont necessaires");
		
		elementPseudoFieldDiv.addClass( "animated shake" );
		window.setTimeout( function(){
			elementPseudoFieldDiv.removeClass('animated shake');
		}, 500);
		
		elementPaswordFieldDiv.addClass( "animated shake" );
		window.setTimeout( function(){
			elementPaswordFieldDiv.removeClass('animated shake');
		}, 500);
	  }
	  else if(elementPseudoField.val().length == 0)
	  {
		elementMessageDiv.css("display", "block");
		elementMessageLabel.text("Pseudo vide");
		elementPseudoFieldDiv.addClass( "animated shake" );
		window.setTimeout( function(){
			elementPseudoFieldDiv.removeClass('animated shake');
		}, 500);
	  }
	  else if(elementPaswordField.val().length == 0)
	  {
		elementMessageDiv.css("display", "block");
		elementMessageLabel.text("Mot de passe vide");
		elementPaswordFieldDiv.addClass( "animated shake" );
		window.setTimeout( function(){
			elementPaswordFieldDiv.removeClass('animated shake');
		}, 500);
	  }
  }
  
  if(elementPseudoField.val().length > 0 && elementPaswordField.val().length > 0)
  {
	var $form = $( this ),
		pseudoValue = elementPseudoField.val(),
		passwordValue = elementPaswordField.val(),
		url = $form.attr( "action" );
	
	elementConnexionButton.html("<i class=\"fa fa-refresh fa-spin\"></i>");
	
	var posting = $.post( url, { pseudoPost: pseudoValue, passwordPost:passwordValue } );
	
	posting.done(function( data ) {
		var JSONParsed = data;
		
		elementConnexionButton.html("Se connecter");
		elementMessageDiv.addClass( "animated bounceIn" );
		window.setTimeout( function(){
			elementMessageDiv.removeClass( "animated bounceIn" );
		}, 500);
		
		if(JSONParsed.status_code == 1)
		{
			elementMessageDiv.css("display", "block");
			elementMessageDiv.css("background-color", "#2ecc71");
			elementMessageLabel.text("Connexion reussie !");
		}
		else
		{
			elementMessageDiv.css("background-color", "#e74c3c");
			elementMessageDiv.css("display", "block");
			if(JSONParsed.error_description == "undeclared variables")
			{
				elementMessageLabel.text("Variable(s) non déclaré(es)");
				
				elementMessageDiv.addClass( "animated shake" );
				window.setTimeout( function(){
					elementMessageDiv.addClass( "animated bounceIn" );
				}, 500);
				
				elementPseudoFieldDiv.addClass( "animated shake" );
				elementPaswordFieldDiv.addClass( "animated shake" );
				window.setTimeout( function(){
					elementPseudoFieldDiv.addClass( "animated shake" );
					elementPaswordFieldDiv.removeClass('animated shake');
				}, 500);
			}
			else if(JSONParsed.error_description == "connection to database failed")
			{
				elementMessageLabel.text("Connexion à la bdd impossible");
			}
			else if(JSONParsed.error_description == "username and/or password does not match")
			{
				elementMessageLabel.text("Identifiant(s) incorrect(s)");
			}
			else if(JSONParsed.error_description == "failed to execute query")
			{
				elementMessageLabel.text("Impossible d'executer la requête");
			}
			else
			{
				elementMessageLabel.text("Erreur");
			}
		}
		
	  });
  }
});

$(window).on('popupbeforeposition', 'div:jqmData(role="popup")', function() {
        var notDismissible = $(this).jqmData('dismissible') === false;
        if (notDismissible) {
          $('.ui-popup-screen').off();
        }
});

$(document).ready(function()
{
	var fileInput  	= document.querySelector( "#uploadForm" );
	var fileData	= $('#fileUpload').prop('files');
	var elementLabel = document.getElementById("uploadLabel");
	

	
	fileInput.addEventListener( "change", function( event ) {  
		//the_return.innerHTML = this.value;  
	});
	
	elementProgress = new ElasticProgress(document.querySelectorAll('.uploadAnimation')[0], {
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
		formData.append('file', $('input[type=file]')[0].files[0]);
		
		$.ajax({
			type:'POST',
			url: 'apis/upload.php',
			data:formData,
			xhr: function() {
					var myXhr = $.ajaxSettings.xhr();
					if(myXhr.upload){
						myXhr.upload.addEventListener('progress', progress, false);
					}
					return myXhr;
			},
			cache:false,
			contentType: false,
			processData: false,

			success:function(data){
				
				var JSONParsed = data;
				
				if(JSONParsed.status_code == 0)
				{
					if(JSONParsed.error_description == "extension not authorized")
					{
						elementLabel.innerHTML = "Extension non autorisée";
					}
					else if(JSONParsed.error_description == "file already exist")
					{
						elementLabel.innerHTML = "Fichier déjà présent";
					}
					else if(JSONParsed.error_description == "file too big")
					{
						elementLabel.innerHTML = "Fichier trop volumineux";
					}
					else if(JSONParsed.error_description == "file is not a valid flac file")
					{
						elementLabel.innerHTML = "Fichier Flac non valide";
					}
					else
					{
						elementLabel.innerHTML = "Erreur, veuillez réessayer";
					}
					
					elementProgress.fail();
					
					var timer = setInterval(function() {
					   
					   elementLabel.innerHTML = "Mettre en ligne";
					   clearInterval(timer);
					   
					  }, 2700);
				}
				else
				{
					elementLabel.innerHTML = "Mettre en ligne";
				}
			},

			error: function(data){
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

function progress(e)
{
    if(e.lengthComputable && elementProgress)
	{
        var max = e.total;
        var current = e.loaded;
        var Percentage = (current * 100)/max;
		elementProgress.setValue(Percentage);
		
        if(Percentage >= 100)
        {
           // process completed  
        }
    }  
 }
