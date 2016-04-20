/*
    Quentin TRIDON
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audiosarce
    Extraction de métadonnées provenant d'un fichier audio flac,
    Et insertion dans une base de donnée
*/

#include "BDD.h"
#include <string>

BDD::BDD(Fichier *fichierAInserer, string cheminReception, string cheminDeplacement, string cheminTemp)
{
    bool testInsertion ; //variables utiles

    this->metasRecup = fichierAInserer->getListeMetas() ;

    //test map ***/
    /*map<string,string>::iterator iter ;
    for(iter = this->metasRecup.begin() ; iter != this->metasRecup.end() ; ++iter)
        {
            cout<<"Constructeur bdd, map, cle: ["<< iter->first
                <<"], valeur: "<< iter->second << endl ;
            //cout<<"" << endl ;
            Sleep(1000) ;
        }*/
    //*****************************/

    this->dureeRecup = fichierAInserer->getDuree() ;
    //test duree ***/
    //cout<<"duree : "<< this->dureeRecup << endl ;
    //cout<<"" << endl ;
    //Sleep(1000) ;
    //*****************************/

    this->MD5Recup = fichierAInserer->getMD5() ;
    //test md5 ***/
    //cout<<"md5 : "<< this->MD5Recup << endl ;
    //cout<<"" << endl ;
    //Sleep(1000) ;
    //*****************************/

    this->coverRecup = fichierAInserer->getCheminCover() ;
    //test cover ***/
    //cout<<"cover : "<< this->coverRecup << endl ;
    //cout<<"" << endl ;
    //Sleep(1000) ;
    //*****************************/

    this->nomDuFichierRecup = fichierAInserer->getNomDuFichier() ;
    //test nom du fichier ***/
    //cout<<"nom : "<< this->nomDuFichierRecup << endl ;
    //cout<<"" << endl ;
    //Sleep(1000) ;
    //*****************************/

    testInsertion = insertionDesMetas(fichierAInserer, cheminTemp) ;

    if(testInsertion == true)
    {
        fichierAInserer->deplacerLeFichier(cheminReception, cheminDeplacement) ; // si l'insertion est un succes on deplace le fichier dans le dossier definitif des flacs
    }
    else
    {
        fichierAInserer->deplacerLeFichier(cheminReception, cheminTemp) ; // si il y a une erreur on le stock dans le fichier temporaire
        fichierAInserer->EcrireLogErreur(cheminTemp, "constructeur bdd, erreur insertion des métas dans la base, deplacement dans temp") ;
    }
}

BDD::~BDD()
{
    //dtor
}

bool BDD::insertionDesMetas(Fichier *fichierAInserer, string cheminTemp)
{
	MYSQL *mysqlConnexion ; //Variables utiles
	char *testCaracValeur ;
	string requeteSql,
           partiColonne,
           partiValeur,
           dureeMysql,
           champsAlterer[50],
           champsRecup[50] ;
    char castIntString[5] ;
    MYSQL_ROW champsBDD,
              idGenre ;
    int positionDansTableau = 0,
        tailleTableau = 0,
        compteurTableau = 0,
        concatAlteration,
        testEnvoiRequete,
        testBoolErreur ;
    bool presenceDansTableau = false ;
    MYSQL_RES *resultatCommandeSql ;
    wstring caracUtf8 ;
    wchar_t *traitementUtf8 ;

	map<string,string>::iterator iter ; //utiliser pour lister le contenu d'un autre objet, ici le contenu du map "TableauAsso"

    for(iter = this->metasRecup.begin() ; iter != this->metasRecup.end() ; ++iter) // conversion des caractere asci en utf8 pour traiter les : 'é' , 'è' etc.
        {
            traitementUtf8 = new wchar_t[iter->second.length() + 1] ; //wchar et wstring pour gros char ou gros string, les caractere encodés sur deux octets
            traitementUtf8[iter->second.size()] = L'\0' ; //on rajoute \0 a la fin du tableau
            MultiByteToWideChar(CP_UTF8, 0, iter->second.c_str(), -1, traitementUtf8, (int)iter->second.length()) ; //cp_acp pour asci
            caracUtf8 = wstring(traitementUtf8) ;
            string utf8Final(caracUtf8.begin(), caracUtf8.end()) ;
            iter->second = utf8Final ;
        }

    dureeMysql = (string)itoa(this->dureeRecup, castIntString, 10) ; //passage entier à string

    metasRecup["duree"]= dureeMysql ; //on ajoute les 4 données à part au tableau associatif
    metasRecup["md5"]= this->MD5Recup ;
    if(this->coverRecup != "") //si il y a une cover on l'ajoute au tableau sinon on ne le remplie pas pour que la bdd comprenne qu'elle doit metre la cover par defaut
    {
        metasRecup["cover"]= this->coverRecup ;
    }
    metasRecup["filename"]= this->nomDuFichierRecup ;

    mysqlConnexion = mysql_init(NULL) ; //initialisation de la bdd

    //test ouverture BDD ***/
    cout<<"/*****************************/" << endl ;
    cout<<"bdd, BDD ouverte" << endl ;
    cout<<"/*****************************/" << endl ;
    cout<<"" << endl ;
    Sleep(1000) ;
    //*****************************/

	if(mysql_real_connect(mysqlConnexion, SERVEUR, UTILISATEUR, MOT_DE_PASSE , BDD_AUDIO, 0, NULL, 0)) //connexion à la bdd si réussie
    {
        testBoolErreur = 1 ;
        //test connexion BDD ***/
        cout<<"/*****************************/" << endl ;
        cout<<"bdd, BDD connectee" << endl ;
        cout<<"/*****************************/" << endl ;
        cout<<"" << endl ;
        Sleep(1000) ;
        //*****************************/

        for(iter = this->metasRecup.begin() ; iter != this->metasRecup.end() ; ++iter) //on verifie si il y a la metas genre dans le tableau
        {
            if(iter->first == "genre") //Si elle y est on accede a la table genre pour sois la creer, sois juste recuperer son id. Cette fonction sert à remplacer la valeur "string : chaine de caractere" par un "string : int" pour l'insertion de la fin
            {
               requeteSql = "INSERT INTO genres(nom) SELECT '" +iter->second+ "' FROM genres WHERE NOT EXISTS (SELECT idGENRES FROM genres WHERE nom = '" +iter->second+ "') LIMIT 1" ; //insertion du genre si il n'y est pas, limit 1 pour préciser de le faire une seul fois

               testEnvoiRequete = mysql_query(mysqlConnexion, requeteSql.c_str()) ; //on cherche si le genre est present sinon on le recup

               if(testEnvoiRequete != 0)
               {
                   testBoolErreur = 0 ;
                   //test requete BDD ***/
                    cout<<"/*****************************/" << endl ;
                    cout<<"erreur requete insertion du genre" << endl ;
                    cout<<"/*****************************/" << endl ;
                    cout<<"" << endl ;
                    Sleep(1000) ;
                    //*****************************/
                    fichierAInserer->EcrireLogErreur(cheminTemp, "Insertion dans bdd, erreur requete creation du genre") ;
               }

               requeteSql = "SELECT idGENRES FROM genres WHERE nom = '" +iter->second+ "'" ;

               testEnvoiRequete = mysql_query(mysqlConnexion, requeteSql.c_str()) ; //on cherche si le genre est present sinon on le recup

               if(testEnvoiRequete != 0)
               {
                   testBoolErreur = 0 ;
                   //test requete BDD ***/
                    cout<<"/*****************************/" << endl ;
                    cout<<"erreur requete recuperation idGenre" << endl ;
                    cout<<"/*****************************/" << endl ;
                    cout<<"" << endl ;
                    Sleep(1000) ;
                    //*****************************/
                    fichierAInserer->EcrireLogErreur(cheminTemp, "Insertion dans bdd, erreur requete recuperation de l'id du genre") ;
               }
               else
               {
                   testBoolErreur = 1 ;

                   resultatCommandeSql = mysql_store_result(mysqlConnexion) ; //on recupere la reponse donc l'id

                   idGenre = mysql_fetch_row(resultatCommandeSql) ; //on recupere l'id dans un row

                   iter->second = idGenre[0] ; //on le place dans le tableau à la place de son nom en string
               }
            }

        } //si elle n'y est pas alors on continu normalement, à l'insertion la musique prendra donc le genre par defaut

        testEnvoiRequete = mysql_query(mysqlConnexion, "SHOW COLUMNS FROM pistes") ; //on envoi la premiere requete pour recuperer tous les champs de la table pistes
        if(testEnvoiRequete != 0)
        {
            testBoolErreur = 0 ;
            //test requete BDD ***/
            cout<<"/*****************************/" << endl ;
            cout<<"erreur requete recuperation colonnes" << endl ;
            cout<<"/*****************************/" << endl ;
            cout<<"" << endl ;
            Sleep(1000) ;
            //*****************************/
            fichierAInserer->EcrireLogErreur(cheminTemp, "Insertion dans bdd, erreur requete recuperation des colonnes") ;
        }

        else
        {
            resultatCommandeSql = mysql_store_result(mysqlConnexion) ; //on recupere la reponse du serveur mysql

            while(champsBDD = mysql_fetch_row(resultatCommandeSql)) //tant qu'il y a des champs on les recupere
            {
                    champsRecup[positionDansTableau] = champsBDD[0] ; //on les stock dans un tableau pour comparaison avec nos metas
                    positionDansTableau++ ;
                    tailleTableau++ ; //on stock la taille du tableau, se qui va nous servir de limite plus tard
            }

            for(iter = this->metasRecup.begin() ; iter != this->metasRecup.end() ; ++iter) //boucle de test des correspondances entre les deux tableaux
            {
                for(positionDansTableau = 0 ; positionDansTableau < tailleTableau ; positionDansTableau++)
                {
                    if(iter->first == champsRecup[positionDansTableau]) //si il a une corespondance entre les deux
                    {
                        presenceDansTableau = true ; //on actualise une variable
                        break ; //on quitte la boucle pour passer à la variable suivante
                    }
                }

                if(presenceDansTableau == false) // si la variable à tester n'est pas dans le tableau conteanant les champs de la bdd, on la stock à part pour ensuite  en créer le champ
                {
                    champsAlterer[compteurTableau] = iter->first ;
                    compteurTableau++ ;
                }

                presenceDansTableau = false ; //on repasse la variable à false, on part du principe que de base la variable n'est pas dans le tableau
            }

            if(compteurTableau != 0) //si il y a des champs à créer alors on passe par une requete suplémentaire
            {
                requeteSql = "ALTER TABLE pistes ADD (" ; // debut de ma commande sql pour alterer
                for(concatAlteration = 0 ; concatAlteration < compteurTableau ; concatAlteration++)
                {
                    requeteSql += "`" +champsAlterer[concatAlteration]+ "`" +DEFAUT_TYPE_BDD+ "," ; // on rajoute les champs stockés precedement à la commande, les ` sont la pour prendre en compte si la future meta a des espaces
                }
                requeteSql.erase( requeteSql.size() -1) ; // on supprime la derniere ',' de la chaine en trop
                requeteSql +=  ")" ; // on rajoute la fin de la commande

                testEnvoiRequete = mysql_query(mysqlConnexion, requeteSql.c_str()) ; // et on envoi la requete de rajout des champs non standards
                if(testEnvoiRequete != 0)
                {
                    testBoolErreur = 0 ;
                    //test requete BDD ***/
                    cout<<"/*****************************/" << endl ;
                    cout<<"erreur requete alteration" << endl ;
                    cout<<"/*****************************/" << endl ;
                    cout<<"" << endl ;
                    Sleep(1000) ;
                    //*****************************/
                    fichierAInserer->EcrireLogErreur(cheminTemp, "Insertion dans bdd, erreur requete des alterations des champs") ;
                }
                else
                {
                    testBoolErreur = 1 ;
                    //test requete BDD ***/
                    cout<<"/*****************************/" << endl ;
                    cout<<"requete, alteration reussie" << endl ;
                    cout<<"/*****************************/" << endl ;
                    cout<<"" << endl ;
                    Sleep(1000) ;
                    //*****************************/
                }
            }

            requeteSql = "INSERT INTO pistes (" ; // on passe ensuite au remplissage des champs par les valeur
            partiValeur = ") VALUES (" ;
            for(iter = this->metasRecup.begin() ; iter != this->metasRecup.end() ; ++iter) //boucle de creation de la requete qui va remplir les champs de la bdd
            {
                partiColonne += "`" +iter->first+ "`" +"," ; // on rajoute les colonnes du map

                testCaracValeur = new char[(strlen(iter->second.c_str()) * 2) + 1 ] ; //initialisation du tableau de transition qui stock la nouvelle string avec les caracteres spéciaux traités, au niveau de la taille : *2 car au pire des cas un caractere prend deux octets et +1 pour \0
                mysql_real_escape_string(mysqlConnexion, testCaracValeur, iter->second.c_str(), iter->second.size()) ; // test la présence d'un caractere imcopatible mysql tel que ' et place un \ devant pour ne pas poser de probleme d'insertion

                partiValeur += "'" +(string)testCaracValeur+ "'"+ "," ; // de même les valeurs

            }
            partiColonne.erase(partiColonne.size() -1) ; // on supprime la derniere ',' de la chaine
            partiValeur.erase(partiValeur.size() -1) ; // de même
            requeteSql += partiColonne+ partiValeur+ ")" ; // on rajoute la fin de la commande

            testEnvoiRequete = mysql_query(mysqlConnexion, requeteSql.c_str()) ; // on envoi la requete d'insertion des champs
            if(testEnvoiRequete != 0)
            {
                testBoolErreur = 0 ;
                //test requete BDD ***/
                cout<<"/*****************************/" << endl ;
                cout<<"erreur requete insertion" << endl ;
                cout<<"/*****************************/" << endl ;
                cout<<"" << endl ;
                Sleep(1000) ;
                //*****************************/
                fichierAInserer->EcrireLogErreur(cheminTemp, "Insertion dans bdd, erreur requete insertion des metas") ;
            }
            else
            {
                testBoolErreur = 1 ;
                //test requete BDD ***/
                cout<<"/*****************************/" << endl ;
                cout<<"requete, mise a jour des champs reussie" << endl ;
                cout<<"/*****************************/" << endl ;
                cout<<"" << endl ;
                Sleep(1000) ;
                //*****************************/
            }

            mysql_close(mysqlConnexion) ; //fermeture de la connexion bdd

            //test fermeture BDD ***/
            cout<<"/*****************************/" << endl ;
            cout<<"bdd, BDD fermee" << endl ;
            cout<<"/*****************************/" << endl ;
            cout<<"" << endl ;
            Sleep(1000) ;
            //*****************************/
        }

        if(testBoolErreur == 1) //si il n'y a pas eu d'erreur alors true
        {
            return true ;
        }
        else
        {
            return false ;
        }
    }
	else //connexion erreur
	{
		cout << "Connexion BDD impossible" << endl ;
		fichierAInserer->EcrireLogErreur(cheminTemp, "Insertion dans bdd, erreur connexion impossible") ;
		return false ;
	}
}
