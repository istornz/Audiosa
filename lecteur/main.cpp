#include <iostream>
#include <irrKlang.h>

using namespace irrklang;

int main(int argc, const char** argv)
{
  // start irrKlang with default parameters
  ISoundEngine* engine = createIrrKlangDevice();

  if (!engine)
    return 0; // error starting up the engine

  // play some sound stream, looped
  engine->play2D("D:\\Dropbox\\Projet_Lecteur\\media\\11_Tourettes.flac", true);

  char i = 0;
  std::cin >> i; // wait for user to press a key

  engine->drop(); // delete engine

  return 0;
}

