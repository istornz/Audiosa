/*
    Quentin TRIDON
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audiosarce
    Extraction de métadonnées provenant d'un fichier audio flac,
    Et insertion dans une base de donnée
*/

#ifndef FICHIER_H
#define FICHIER_H
#include <map>
#include <String>
#include <windows.h>
#include <fstream>
#include <iostream>
#include <md5wrapper.h>
#include <shlwapi.h>
#include <ctype.h>
#include <time.h>


#define CHEMIN_LIB_METAFLAC /*"D:\\Dropbox\\Projet\\Extraction_Insertion\\bin\\Debug\\"*/                                  "E:\\Dropbox\\Projet\\Extraction_Insertion\\bin\\Debug\\"    //chemin de la lib metaflac pour la fonction cover et duree
#define CHEMIN_COVER        /*"C:\\Users\\tridon.LGM\\Downloads\\Cover\\"*/    /*D:\\covers\\*/                            "E:\\TMP\\covers\\"                                          //chemin de la cover
#define CHEMIN_DOUBLONS     /*"C:\\Users\\tridon.LGM\\Downloads\\executable\\doublon\\"*/ /*D:\\executable\\doublon\\*/    "E:\\TMP\\executable\\"                                      //chemin du srcipt doublon en php
#define TAILLE_FICHIER_A_TRAITER 5001 //nombres de caracteres ou effectuer la recherche des metas
#define CARAC_NULL_CONSEC 19 //nombres de deplacements pour rechercher 3 null consecutif

using namespace std ;

typedef map<string, string> TableauAsso ; //tableau assosiatif pour les metas "string" "string"

class Fichier
{
    public:
        Fichier(string nomDuFichier, string cheminEtNomFichierReception, string cheminEtNomFichierDeplacement, string cheminEtNomFichierSuppression, string cheminTemp) ;
        TableauAsso extraireMetadonnees(ifstream *fichierALire) ;
        TableauAsso getListeMetas() ;
        int recupererDuree(string cheminEtNomFichierReception) ;
        int getDuree() ;
        int testerLesDoublons(string md5ATester) ;
        string calculerMD5(string cheminEtNomFichier) ;
        string getMD5() ;
        void recupererCover(string cheminEtNomFichierReception) ;
        void EcrireLogErreur(string cheminFichierLog, string logAEcrire) ;
        string getCheminCover() ;
        string getNomDuFichier() ;
        void deplacerLeFichier(string cheminOrigine, string cheminArrive) ;
        virtual ~Fichier() ;
    protected:
    private:
            TableauAsso metas ;
            int duree,
                testDoublons ;
            string MD5,
                   nomCover,
                   nomDuFichier ;
            md5wrapper md5ACalculer ;
};

#endif // FICHIER_H
