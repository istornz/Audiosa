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
  std::cout << "Lancement de la musique Iron Hand" << std::endl;
  // Test Modification du Volume
  std::cin >> i;
  std::cout << "Volume a 0.5" << std::endl;
  engine->setSoundVolume(0.5);                                             //Met le volume a 0.5
  std::cin >> i;                                                           //Attend que l'utilisateur appuie sur une touche
  std::cout << "Volume a 0" << std::endl;
  engine->setSoundVolume(0);                                               //Met le volume a 0
  std::cin >> i;                                                           //Attend que l'utilisateur appuie sur une touche
  std::cout << "Volume a 0.5" << std::endl;
  engine->setSoundVolume(0.5);                                             //Met le volume a 0.5
  std::cin >> i;                                                           //Attend que l'utilisateur appuie sur une touche
  std::cout << "Volume a 1" << std::endl;
  engine->setSoundVolume(1);                                               //Met le volume a 1

  // Test Mise en Pause et Play
  std::cin >> i;                                                           //Attend que l'utilisateur appuie sur une touche
  std::cout << "Musique en pause" << std::endl;
  engine->setAllSoundsPaused(true);                                        //Met la musique en pause

  std::cin >> i;                                                           //Attend que l'utilisateur appuie sur une touche
  std::cout << "Play musique" << std::endl;
  engine->setAllSoundsPaused(false);                                       //Remet la musique en route

  // Test Changement de Musique
  std::cin >> i;                                                           //Attend que l'utilisateur appuie sur une touche
  engine->removeAllSoundSources();                                         //Supprime les musiques qui sont dans l'objet engine
  std::cout << "Changement de musique - Play Tourette's de Nirvana" << std::endl;
  engine->play2D("D:\\Dropbox\\Projet_Lecteur\\media\\11_Tourettes.flac", true); // Lancement de la musique en boucle (true)

  // Fermer Programme
  std::cin >> i; // wait for user to press a key
  engine->drop(); // delete engine

  return 0;
}



