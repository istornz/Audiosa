/*
    Quentin TRIDON
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audiosarce
    Extraction de métadonnées provenant d'un fichier audio flac,
    Et insertion dans une base de donnée
*/

#include <iostream>
#include <Fichier.h>
#include <BDD.h>
#include <String>
#include <windows.h>
#include <fstream>

using namespace std ;

#define CHEMIN_FICHIER_RECEPTION "E:\\TMP\\Reception_FLAC\\"        /*"C:\\Users\\tridon.LGM\\Downloads\\Reception_FLAC\\"*/          /*D:\\uploaded\\*/
#define CHEMIN_FICHIER_DEPLACEMENT "E:\\TMP\\Deplacement_FLAC\\"    /*"C:\\Users\\tridon.LGM\\Downloads\\Deplacement_FLAC\\"*/        /*D:\\files\\*/
#define CHEMIN_FICHIER_SUPPRESSION "E:\\TMP\\Suppression_FLAC\\"    /*"C:\\Users\\tridon.LGM\\Downloads\\Suppression_FLAC\\"*/        /*D:\\trash\\*/
#define CHEMIN_FICHIER_TEMP "E:\\TMP\\temp\\"                       /*"C:\\Users\\tridon.LGM\\Downloads\\temp\\"*/                    /*D:\\temp\\*/
#define ATTENTE_BOUCLE_RECHERCHE_FICHIER 10000 //temps d'attente de la boucle de recherche de fichier flac en seconde

int main()
{
    WIN32_FIND_DATA fichierAOuvrir ; //variables détection fichier flac dans le dossier
    HANDLE rechercheFichier ;

    string cheminEtNomFichierReception, // chaines utiles
           cheminEtNomFichierSuppression,
           nomDuFichier,
		   cheminEtNomFichierDeplacement ;

    while(1) //recherche de fichier flac en boucle jusqu'à annulation
    {
        rechercheFichier = FindFirstFile(CHEMIN_FICHIER_RECEPTION"*.flac", &fichierAOuvrir) ; // trouve le premier fichier avec extansion .flac

        if (rechercheFichier != INVALID_HANDLE_VALUE)
        {
            //test titre du fichier ***/
            cout<<"/*****************************/" << endl ;
            cout << "detection du fichier flac reussi, fichier : " << fichierAOuvrir.cFileName << endl ; //test pour trouver le fichier
            cout<<"/*****************************/" << endl ;
            cout<<"" << endl ;
            Sleep(1000) ;
            //*****************************/

			cheminEtNomFichierReception = (string)CHEMIN_FICHIER_RECEPTION+(string)fichierAOuvrir.cFileName ; // concatener chemin + nom du fichier
			cheminEtNomFichierDeplacement = (string)CHEMIN_FICHIER_DEPLACEMENT+(string)fichierAOuvrir.cFileName ;
			cheminEtNomFichierSuppression = (string)CHEMIN_FICHIER_SUPPRESSION+(string)fichierAOuvrir.cFileName ;
			nomDuFichier = (string)fichierAOuvrir.cFileName ;

            Fichier *musique = new Fichier(nomDuFichier,
                                           cheminEtNomFichierReception,
                                           cheminEtNomFichierDeplacement,       //traitement du fichier flac et passage des chemins
                                           cheminEtNomFichierSuppression,
                                           CHEMIN_FICHIER_TEMP) ;

            BDD *baseDeDonnees = new BDD(musique,
                                         cheminEtNomFichierReception,
                                         cheminEtNomFichierDeplacement,
                                         CHEMIN_FICHIER_TEMP) ; // Stockage dans la BDD*/

        }

        else
        {
            system("cls") ; //clear console
            //attente de fichier ***/
            cout<<"/*****************************/" << endl ;
            cout << "ATTENTE DE FICHIER FLAC"<< endl ;
            cout<<"/*****************************/" << endl ;
            cout<<"" << endl ;
            //*****************************/
            Sleep(ATTENTE_BOUCLE_RECHERCHE_FICHIER) ;
        }

        FindClose(rechercheFichier) ; //fermeture de recherche
    }
    return 0;
}
