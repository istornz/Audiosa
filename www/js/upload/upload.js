$(document).ready(function() {
    var fileInput = document.querySelector("#uploadForm");
    var fileData = $('#fileUpload').prop('files');
    var elementUploadLabel = document.getElementById("uploadLabel");
    elementProgress = new ElasticProgress(document.querySelectorAll(
        '.uploadAnimation')[0], {
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
        elementUploadLabel.style.display = 'none';
        elementProgress.open();
    })
	
    elementProgress.onOpen(function() {
        var formData = new FormData();
        formData.append('pseudoPost', pseudo);
        formData.append('passwordPost', passwordHash);
        formData.append('file', $('#fileUpload')[0].files[0]);
        $.ajax({
            type: 'POST',
            url: './apis/upload.php',
            data: formData,
            xhr: function() {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener(
                        'progress', progress,
                        false);
                }
                return myXhr;
            },
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
                var JSONParsed = data;
				
                if (JSONParsed.status_code == 0) {
					
					elementProgress.fail();
					switch(JSONParsed.error_description)
					{
						case "undeclared variables":
							elementUploadLabel.innerHTML = "Variable(s) non déclaré(es)";
							break;
						case "connection to database failed":
							elementUploadLabel.innerHTML = "Connexion à la bdd impossible";
							break;
						case "extension not authorized":
							elementUploadLabel.innerHTML = "Extension non autorisée";
							break;
						case "file already exist":
							elementUploadLabel.innerHTML = "Fichier déjà présent";
							break;
						case "file too big":
							elementUploadLabel.innerHTML = "Fichier trop volumineux";
							break;
						case "file is not a valid flac file":
							elementUploadLabel.innerHTML = "Fichier Flac non valide";
							break;
						case "failed to execute query":
							elementUploadLabel.innerHTML = "Impossible de se connecter";
							break;
						case "username and/or password does not match":
							elementUploadLabel.innerHTML = "Identifiant(s) incorrect(s)";
							break;
						case "unable to move file":
							elementUploadLabel.innerHTML = "Impossible de déplacer le fichier";
							break;
						default:
							elementUploadLabel.innerHTML = "Erreur";
							break;
					}
					
                    var timer = setInterval(
                        function() {
                            elementUploadLabel.innerHTML =
                                "Mettre en ligne";
                            clearInterval(timer);
                        }, 2700);
                } else {
                    elementUploadLabel.innerHTML =
                        "Mettre en ligne";
                }
            },
            error: function(data) {
                
                elementProgress.close();
            }
        });
    });
	
    elementProgress.onComplete(function() {
        elementProgress.close();
        elementUploadLabel.style.display = '';
    })
	
    elementProgress.onFail(function() {
        elementProgress.close();
        elementUploadLabel.style.display = '';
    }) 
});

function progress(e) {
    if (e.lengthComputable && elementProgress) {
        var max = e.total;
        var current = e.loaded;
        var Percentage = current / max;
        elementProgress.setValue(Percentage);
        if (Percentage >= 1) {
            // process completed  
        }
    }
}