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
			url: 'upload.php',
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
				elementProgress.fail();
				var JSONParsed = JSON.parse(data);
				if(JSONParsed.status == "error")
				{
					if(JSONParsed.errorDescribe == "extension not authorized")
					{
						
					}
					else if(JSONParsed.errorDescribe == "file already exist")
					{
						
					}
					else if(JSONParsed.errorDescribe == "file too big")
					{
						
					}
					else if(JSONParsed.errorDescribe == "file is not a valid flac file")
					{
						
					}
					else
					{
						
					}
				}
			},

			error: function(data){
				console.log(data);
				elementProgress.close();
			}
		});

		elementProgress.preventDefault();
		
		
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

function fakeLoading($obj, speed, failAt) {
	if (typeof speed == "undefined") speed = 2;
				if (typeof failAt == "undefined") failAt = -1;
				var v = 0;
				var l = function() {
						if (failAt > -1) {
								if (v >= failAt) {
										if (typeof $obj.jquery != "undefined") {
												$obj.ElasticProgress("fail");
										} else {
												$obj.fail();
										}
										return;
								}
						}
						v += Math.pow(Math.random(), 2) * 0.1 * speed;

						if (typeof $obj.jquery != "undefined") {
								$obj.ElasticProgress("setValue", v);
						} else {
								$obj.setValue(v);
						}
						if (v < 1) {
								TweenMax.delayedCall(0.05 + (Math.random() * 0.14), l)
						}
				};
	l();
}
