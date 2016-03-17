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
 
  var $form = $( this ),
    pseudoValue = $form.find( "input[name='pseudo']" ).val(),
	passwordValue = $form.find( "input[name='pseudo']" ).val(),
    url = $form.attr( "action" );
 
  var posting = $.post( url, { pseudoPost: pseudoValue, passwordPost:passwordValue } );
  
  posting.done(function( data ) {
	console.log(data);
  });
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

		//elementProgress.preventDefault();
		
		
		//fakeLoading(elementProgress, 2, 0.5);
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
