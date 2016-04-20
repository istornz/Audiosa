/*
    Quentin TRIDON
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audiosarce
    Extraction de métadonnées provenant d'un fichier audio flac,
    Et insertion dans une base de donnée
*/

#include "Fichier.h"

Fichier::Fichier(string nomDuFichier, string cheminEtNomFichierReception, string cheminEtNomFichierDeplacement, string cheminEtNomFichierSuppression, string cheminTemp)
{
    ifstream fichierALire ;

    fichierALire.open (cheminEtNomFichierReception.c_str(), ios::in | ios::binary) ; // ouverture en lecture et binaire
    if(fichierALire == NULL)
    {
        //test ouverture du fichier ***/
        cout<<"/*****************************/" << endl ;
        cout << "Impossible d'ouvrir le fichier en lecture !" << endl ;
        cout<<"/*****************************/" << endl ;
        cout<<"" << endl ;
        Sleep(1000) ;
        //*****************************/
        EcrireLogErreur(cheminTemp, "constructeur fichier, Impossible d'ouvrir le fichier flac en lecture") ;
    }

    else
    {
        //test ouverture du fichier ***/
        cout<<"/*****************************/" << endl ;
        cout << "Constructeur fichier, fichier ouvert, traitement en cours" << endl ;
        cout<<"/*****************************/" << endl ;
        cout<<"" << endl ;
        Sleep(1000) ;
        //*****************************/

        this->nomDuFichier = nomDuFichier ; //passage du nom du fichier

        this->MD5 = calculerMD5(cheminEtNomFichierReception) ; //calcul du md5

        this->testDoublons = testerLesDoublons(this->MD5) ; //appel du script de test de doublon

        if(this->testDoublons == 1) // = 1 pas de doublons présent
        {
            this->metas = extraireMetadonnees(&fichierALire) ;

            this->duree = recupererDuree(cheminEtNomFichierReception) ;

            recupererCover(cheminEtNomFichierReception) ;

            fichierALire.close() ; //fermeture du fichier
        }

        else if(this->testDoublons == 2) // = 2 doublons présent
        {
            fichierALire.close() ; //fermeture du fichier
            deplacerLeFichier(cheminEtNomFichierReception, cheminEtNomFichierSuppression) ;
            EcrireLogErreur(cheminTemp, "constructeur fichier, doublons present, fichier supprimé") ;
        }

        else if(this->testDoublons == 3) // = 3 erreur
        {
            fichierALire.close() ; //fermeture du fichier
            deplacerLeFichier(cheminEtNomFichierReception, cheminTemp) ;
            EcrireLogErreur(cheminTemp, "constructeur fichier, erreur test des doublons, deplacement dans temp") ;
        }

        //test fermeture du fichier ****/
        cout<<"/*****************************/" << endl ;
        cout << "Constructeur fichier, traitement termine, fichier ferme" << endl ;
        cout<<"/*****************************/" << endl ;
        cout<<"" << endl ;
        Sleep(1000) ;
        //*****************************/

    }

}

Fichier::~Fichier()
{
    //dtor
}


TableauAsso Fichier::extraireMetadonnees(ifstream *fichierALire)
{
    char caracNull = 0x00 ; // recherche et test du nul
    char caracRecup = 0x3D ; // recherche et test du '='
    char caracTest ; //caractere à tester
    int positionOrigine, // variables utiles
        positionRecuperation,
        positionLimite,
        positionDuNul,
        positionSiNombreDeNullEchec,
        nombreDeNul = 0,
        positionActuel ;

    string tableauRecupClef,
           tableauRecupValeur ; // recuperation caractere par caractere des metas

    TableauAsso listeMetas ; // création du conteneur liste des metadonnées

    for(positionActuel = 1; positionActuel < TAILLE_FICHIER_A_TRAITER; positionActuel++) //lecture de 5000 caractere pour rechercher les metas
    {
        fichierALire->get(caracTest) ; // lecture caractere par caractere

        if(caracTest == caracRecup) // des que le caractere trouvé est '='
            {
                positionActuel = fichierALire->tellg() ; // on stock la position pour travailler
                positionOrigine = fichierALire->tellg() ;  //on stock la position au '=' pour y revenir facilement

                positionSiNombreDeNullEchec = fichierALire->tellg() ;  //on stock la position au '=' en  pour le cas d'un echec au test des nuls

                while(caracTest != caracNull) // tant que différent de 'nul'
                {
                    fichierALire->seekg(positionActuel--) ; //on se décale sur la gauche
                    fichierALire->get(caracTest) ; // on récupère le caractère
                }

                while(caracTest == caracNull) // tant que égal à 'nul'
                {
                    positionDuNul = fichierALire->tellg() ; // on stock le nul comme base pour y revenir facilement
                    fichierALire->seekg(positionActuel--) ; //on se décale sur la gauche
                    fichierALire->get(caracTest) ; // on récupère le caractère
                    nombreDeNul++ ;
                }

                if(nombreDeNul == 3)
				{
                    for(positionRecuperation = positionDuNul + 2; positionRecuperation < positionOrigine - 1; positionRecuperation++) //on se replace au premier 'nul' et on va stocker jusqu'au '=' -1 (pour ne pas recup le '=')
                    {
                        fichierALire->seekg(positionRecuperation) ; //on se place à la position de depart
                        fichierALire->get(caracTest) ; // on récupère le caractère
                        tableauRecupClef += tolower(caracTest) ; //on ajoute caractère par caractère la métadonnée dans un tableau, en la passant en minuscule, important pour la correspondance avec la bdd
                    }

                    fichierALire->seekg(positionOrigine) ; // on se replace au égal

                    while(caracTest != caracNull) // on repart pour delimiter la valeur de la métadonnées
                    {
                        fichierALire->get(caracTest) ; // on récupère le caractère
                    }

                    positionLimite = fichierALire->tellg() ; // on stock la limite de la valeur de la métadonnée

                    for(positionRecuperation = positionOrigine; positionRecuperation < positionLimite - 2; positionRecuperation++) //on se replace au egal et on va stocker jusqu'a la limite -2 pour ne pas prendre le caractere aleatoire
                    {
                        fichierALire->seekg(positionRecuperation) ; //on se place à la position de depart
                        fichierALire->get(caracTest) ; // on récupère le caractère
                        tableauRecupValeur += caracTest ; //on ajoute caractère par caractère la valeur de la métadonnée dans un tableau
                    }

                    listeMetas[tableauRecupClef]= tableauRecupValeur ; //on stock dans le tableau associatif

                    positionActuel = positionLimite ; //On se replace à la limite

                    //test affichage des tableaux****/
                    //cout << "Fonction extraire METAS : " << tableauRecupClef << " = " << tableauRecupValeur << endl ;
                    //cout<<"" << endl ;
                    //Sleep(1000) ;
                    //*******************************/

                    tableauRecupClef.clear() ; //purge des tableaux
                    tableauRecupValeur.clear() ;

				}

				else
                {
                    positionActuel = positionSiNombreDeNullEchec + 1 ; //replacement du curseur à +1 pour ne pas relire le '=' précédent
                }

            }

        nombreDeNul = 0 ; //purge de la variable

        fichierALire->seekg(positionActuel) ; //On repart de la limite pour continuer vers le prochain '='

    }

    return listeMetas;
}

int Fichier::recupererDuree(string cheminEtNomFichierReception)
{
    string commandeCompleteEchantillon, // variables utiles
           commandeCompleteFe ;
    int dureeEnSeconde = 0 ;
    FILE *fichierTampon ;
    char tableauTamponEchantillon[10],
         tableauTamponFe[10] ;

    commandeCompleteEchantillon = (string)CHEMIN_LIB_METAFLAC+"metaflac --show-total-samples "+"\""+(string)cheminEtNomFichierReception+"\"" ; //concatenation de la commande
    commandeCompleteFe = (string)CHEMIN_LIB_METAFLAC+"metaflac --show-sample-rate "+"\""+(string)cheminEtNomFichierReception+"\"" ;

    fichierTampon = popen(commandeCompleteEchantillon.c_str(), "r"); //on execute la commande avec popen qui cré un fichier virtuel
    fgets(tableauTamponEchantillon, 10, fichierTampon) ; //on la stock dans un tableau

    fichierTampon = popen(commandeCompleteFe.c_str(), "r"); //même concepte
    fgets(tableauTamponFe, 10, fichierTampon) ;

    pclose(fichierTampon) ; //on ferme le fichier virtuel

    dureeEnSeconde = atoi(tableauTamponEchantillon) / atoi(tableauTamponFe) ; // on cast les char en int et on divise pour optenir la duree en seconde

    //test duree ****/
    //cout << "Fonction duree : "<< dureeEnSeconde << endl ;
    //cout<<"" << endl ;
    //Sleep(1000) ;
    //*****************************/

    return dureeEnSeconde ;
}

int Fichier::testerLesDoublons(string md5ATester)
{
    /*string commandeComplete ;

    commandeComplete = (string)CHEMIN_LIB_METAFLAC+"metaflac --export-picture-to="+CHEMIN_COVER+this->MD5+".jpg "+(string)cheminEtNomFichierReception ; //concatenation de la commande complete*/
    return 1 ;
}

void Fichier::recupererCover(string cheminEtNomFichierReception)
{
    string commandeComplete, //variables utiles
           cheminTestCover ;
    ifstream fichierTestCover ;

    commandeComplete = (string)CHEMIN_LIB_METAFLAC+"metaflac --export-picture-to="+CHEMIN_COVER+this->MD5+".jpg "+"\""+(string)cheminEtNomFichierReception+"\"" ; //concatenation de la commande complete

    system(commandeComplete.c_str()) ; //on l'execute

    cheminTestCover = CHEMIN_COVER+this->MD5+".jpg" ;

    fichierTestCover.open(cheminTestCover.c_str(), ios::in) ; //on essaye d'ouvrir le fichier pour voir si il est présent

    if(fichierTestCover == NULL)
    {
        this->nomCover = "" ; //si il n'y est pas alors la variable reste nul
    }

    else
    {
        this->nomCover = this->MD5+".jpg" ; // si il y est on passe le nom à la variable
        fichierTestCover.close() ; //fermeture du fichier
    }

    //test cover ****/
    //cout << "Fonction cover : "<< this->nomCover << endl ;
    //cout<<"" << endl ;
    //Sleep(1000) ;
    //*****************************/
}

void Fichier::deplacerLeFichier(string cheminOrigine, string cheminArrive)
{
    bool testDeplacement ;

    testDeplacement = MoveFile(cheminOrigine.c_str(),  //c_str() pour parser en char*
                               cheminArrive.c_str()) ;

    if(testDeplacement != 0)
    {
        //test deplacement fichier ***/
        cout<<"/*****************************/" << endl ;
        cout << "Fonction deplacement, deplacement reussi, deplace depuis : " << cheminOrigine << endl << "pour : " << cheminArrive << endl ; //test pour trouver le fichier
        cout<<"/*****************************/" << endl ;
        cout<<"" << endl ;
        Sleep(1000) ;
        //*****************************/
    }

    else
    {
        //test deplacement fichier ***/
        cout<<"/*****************************/" << endl ;
        cout << "Fonction deplacement, fichier deja present, suppresion : "<< cheminOrigine << endl ; //test pour trouver le fichier
        cout<<"/*****************************/" << endl ;
        cout<<"" << endl ;
        Sleep(1000) ;
        //*****************************/

        DeleteFileA(cheminOrigine.c_str()) ; //suppression
    }

}

string Fichier::calculerMD5(string cheminEtNomFichier)
{
    this->MD5 = this->md5ACalculer.getHashFromFile(cheminEtNomFichier) ; //appel fonction calcule md5 provenant d'une lib

    //test fermeture du MD5 ****/
    //cout << "Fonction calcule MD5, MD5 : "<< this->MD5 << endl ;
    //cout<<"" << endl ;
    //Sleep(1000) ;
    //*****************************/

    return MD5 ;
}

void Fichier::EcrireLogErreur(string cheminFichierLog, string logAEcrire)
{
    time_t maintenant ; //variables utiles
	struct tm *dateInfo ;
	char formatDate[32] ;
	ofstream fichierLog ;
	string cheminComplet ;

    time(&maintenant) ; //initialistation pour la date
    dateInfo = localtime(&maintenant) ;
    strftime(formatDate, 32, "%d/%m/%Y %H:%M:%S", dateInfo); //stockage du format de date souhaite dans le tableau, ici par exemple : 16/04/2016 17:56:52

    cheminComplet = cheminFichierLog +"error.log" ; //on rempli le chemin d'acces du fichier à ouvrir

    fichierLog.open (cheminComplet.c_str(), ios::app);  // on ouvre le fichier en ecriture, app pour 'append' pour ajouter à la suite

    if(fichierLog)  // si l'ouverture a réussi
    {
        fichierLog << "   [" << formatDate << "]" << "   [Extracteur]   " << logAEcrire << endl ; //on écrit à la suite

        fichierLog.close();  // on ferme le fichier

        //test ecriture log ***/
        cout<<"/*****************************/" << endl ;
        cout << "Fonction ecriture log, log ecrit "<< endl ;
        cout<<"/*****************************/" << endl ;
        cout<<"" << endl ;
        Sleep(1000) ;
        //*****************************/
    }
    else
    {
        cout << "Impossible d'ouvrir le fichier log !" << endl ;
    }
}

TableauAsso Fichier::getListeMetas()
{
    return this->metas ;
}

int Fichier::getDuree()
{
    return this->duree ;
}

string Fichier::getMD5()
{
    return this->MD5 ;
}

string Fichier::getCheminCover()
{
    return this->nomCover ;
}

string Fichier::getNomDuFichier()
{
    return this->nomDuFichier ;
}
