/*
    Dimitri DESSUS
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audio Windows 2016 - Audiosa
    
	Fichier: upload.js
	Description: Fonctions permettant de mettre en ligne une nouvelle musique
*/

// Une fois que le DOM est prêt à subir des modifications 
$(document).ready(function() {
	
	// Récupération des elements relatifs à l'element 'ElasticProgress'
    var fileInput 			= document.querySelector("#uploadForm");
    var fileData 			= $('#fileUpload').prop('files');
    var elementUploadLabel 	= document.getElementById("uploadLabel");
    
	// Instanciation d'un objet 'ElasticProgress'
	elementProgress = new ElasticProgress(
		document.querySelectorAll('.uploadAnimation')[0], {
			align: "center", 		//On centre le texte
			fontFamily: "roboto", 	//Police du texte
			colorFg: "#FFFFFF", 	//Couleur du texte
			colorBg: "#27ae60", 	//Couleur du fond
			bleedTop: 110, 			//Dimension de la division (haut)
			bleedBottom: 40, 		//Dimension de la division (bas)
			buttonSize: 100, 		//Taille du bouton
			labelTilt: 70, 			//Vibration du titre
			arrowDirection: "up" 	//Orientation de la flèche
		}
	);
	
	// Fonction executée quand on touche l'objet 'elementProgress'
    elementProgress.onClick(function() {
        elementUploadLabel.style.display = 'none';
        elementProgress.open();
    })
	
	// Fonction executée la connexion est ouverte
    elementProgress.onOpen(function() {
		
		// Création et génération du formulaire
        var formData = new FormData();
        formData.append('pseudoPost', pseudo);					// Pseudo de l'utilisateur
        formData.append('passwordPost', passwordHash);			// Mot de passe
        formData.append('file', $('#fileUpload')[0].files[0]);	// Fichier
		
		// Envoi de la requête POST asynchrone
        $.ajax({
            type: 'POST',
            url: './apis/upload.php',
            data: formData,
			async: true,
            xhr: function() {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
					// On ajoute un listener pour la progression de l'upload
                    myXhr.upload.addEventListener(
                        'progress', updateProgressBar,
                        false);
                }
                return myXhr;
            },
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
                var JSONParsed = data; // Parse du JSON
				
				// Test de la valeur "status_code" présente dans la réponse JSON
                if (JSONParsed.status_code == 0) 
				{
					// La mise en ligne à échouée
					elementProgress.fail();
					
					// On test l'erreur retournée par le serveur
					// Puis on l'affiche aux yeux de l'utilisateur
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
					
					// Mise en place d'un timer de 2.7s permettant de laisser
					// le temps à l'utilisateur de lire le message d'erreur
                    var timer = setInterval(
                        function() {
                            elementUploadLabel.innerHTML = "Mettre en ligne";
                            clearInterval(timer);
                        }, 2700);
                } 
				else 
				{
                    elementUploadLabel.innerHTML = "Mettre en ligne";
                }
            },
            error: function(data) {
                
                elementProgress.close();
            }
        });
    });
	
	// Fonction executée une fois la mise en ligne terminée
    elementProgress.onComplete(function() {
        elementProgress.close();
        elementUploadLabel.style.display = '';
    })
	
	// Fonction executée lors d'une erreur
    elementProgress.onFail(function() {
        elementProgress.close();
        elementUploadLabel.style.display = '';
    }) 
});

// Fonction permettant de suivre la progression de la mise en ligne
function updateProgressBar(data) {
    if (data.lengthComputable && elementProgress) {
        var max = data.total;					// Taille totale du fichier
        var current = data.loaded;				// Données téléchargées
        var percentage = current / max; 		// Pourcentage
        elementProgress.setValue(percentage);
    }
}