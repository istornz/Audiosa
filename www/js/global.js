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
$(document).ready(function() {
	
	var fileInput  	= document.querySelector( "#uploadForm" );
	var fileData	= $('#fileUpload').prop('files');
	var elementLabel = document.getElementById("uploadLabel");
	
	fileInput.addEventListener( "change", function( event ) {  
		//the_return.innerHTML = this.value;  
	});
	
	var e = new ElasticProgress(document.querySelectorAll('.uploadAnimation')[0], {
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
	
	e.onClick(function() {
		/*
		var fileName 	= fileData[0].name;
		var fileSize 	= fileData[0].size;
		var type 		= fileData[0].type;
		*/
		//var jqXHR = fileData.submit();
		
		
		
		
		
		
		elementLabel.style.display = 'none';
		e.open();
	})
	
	e.onOpen(function() {
		
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
				console.log(data);

			  alert('data returned successfully');

			},

			error: function(data){
				console.log(data);
			}
		});

		e.preventDefault();
		
		
		//fakeLoading(e, 2, 0.5);
	});
	
	e.onComplete(function() {
		e.close();
	})
	
	e.onFail(function() {
		e.close();
		elementLabel.style.display = '';
	})
});

function progress(e)
{
    if(e.lengthComputable){
        var max = e.total;
        var current = e.loaded;

        var Percentage = (current * 100)/max;
        console.log(Percentage);

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
