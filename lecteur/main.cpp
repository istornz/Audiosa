#include <iostream>
#include <irrKlang.h>
#include <windows.h>

using namespace irrklang;

int main(int argc, const char** argv)
{
  // start irrKlang with default parameters
  ISoundEngine* engine = createIrrKlangDevice();

  if (!engine)
    return 0; // error starting up the engine
  
   char i = 0;
  

  engine->play2D("D:\\Dropbox\\Projet_Lecteur\\media\\08_Iron_Hand.flac"); // Lancement de la musique

  std::cin >> i;                                                           //Attend que l'utilisateur appuie sur une touche
  engine->setAllSoundsPaused(true);                                        //Met la musique en pause
  
  std::cin >> i;                                                           //Attend que l'utilisateur appuie sur une touche
  engine->setAllSoundsPaused(false);                                       //Remet la musique en route
  
  std::cin >> i;                                                           //Attend que l'utilisateur appuie sur une touche
  engine->removeAllSoundSources();                                         //Supprime les musiques qui sont dans l'objet engine
  engine->play2D("D:\\Dropbox\\Projet_Lecteur\\media\\11_Tourettes.flac", true); // Lancement de la musique en boucle (true)


  std::cin >> i; // wait for user to press a key
  engine->drop(); // delete engine

  return 0;
}

