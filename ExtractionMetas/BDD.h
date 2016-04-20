/*
    Quentin TRIDON
    BTS SN2 LYCEE DU GRESIVAUDAN DE MEYLAN
    Projet Audiosarce
    Extraction de métadonnées provenant d'un fichier audio flac,
    Et insertion dans une base de donnée
*/

#ifndef BDD_H
#define BDD_H
#include <Fichier.h>
#include <String>
#include <windows.h>
#include <iostream>
#include <MYSQL/mysql.h>

#define SERVEUR "localhost"
#define UTILISATEUR "db_writer_music"
#define MOT_DE_PASSE "5VHKUmhKrsSspmjs"
#define BDD_AUDIO "Audio_db"
#define DEFAUT_TYPE_BDD " VARCHAR(150)"

using namespace std ;

class BDD
{
    public:
        BDD(Fichier *fichierAInserer, string cheminReception, string cheminDeplacement, string cheminTemp) ;
        bool insertionDesMetas(Fichier *fichierAInserer, string cheminTemp) ;
        virtual ~BDD() ;
    protected:
    private:
        TableauAsso metasRecup ;
        string MD5Recup,
               coverRecup,
               nomDuFichierRecup ;
        int dureeRecup ;
};

#endif // BDD_H
