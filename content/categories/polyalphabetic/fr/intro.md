## Ce qui unit la famille

Un chiffrement polyalphabétique change d'alphabet au fil du message ; chaque alphabet utilisé est un {{term:cipher-alphabet}}. La même lettre claire devient des lettres chiffrées différentes selon sa place, si bien que les comptages de fréquences qui cassent un alphabet unique s'aplatissent. La clé décide quel alphabet sert à chaque étape.

## Comment ça marche

Prenez la clé BC et décalez chaque lettre tour à tour de B (une place) puis de C (deux places). HELLO devient IGMNP : les deux L se changent en M et en N, et la lettre double qui trahit une substitution simple a disparu. La famille a deux branches. Dans la branche de la tabula recta, le [chiffre de Vigenère](/encoder/vigenere/learn), le [chiffre de Beaufort](/encoder/beaufort/learn) et l'[autoclave](/encoder/autokey/learn) lisent chaque alphabet dans une même table carrée. Dans la branche des disques et des rotors, le [disque d'Alberti](/encoder/alberti/learn) et la [machine Enigma](/encoder/enigma/learn) font tourner des roues qui changent l'alphabet mécaniquement.

## Comment on le casse

Changer d'alphabet n'aide que si le motif des changements ne se répète pas. Une clé courte et répétée ramène sans cesse les mêmes alphabets. Première méthode : {{term:kasiski-examination}}, qui mesure l'écart entre les fragments répétés. Deuxième outil : {{term:index-of-coincidence}}, qui confirme la grandeur cherchée, à savoir : {{term:key-length}}. Chaque colonne tombe ensuite devant une analyse fréquentielle ordinaire. Le [casseur de Vigenère](/encoder/vigenere/cryptanalysis) fait exactement cela. Les machines à longue période ont demandé d'autres outils, des mots connus jusqu'aux bombes de la Seconde Guerre mondiale.

## Histoire

Vers 1467, Leon Battista Alberti décrivit un disque à deux anneaux et une règle pour le tourner, le premier chiffrement polyalphabétique imprimé. Trithème, Bellaso et Vigenère perfectionnèrent la table au siècle suivant, et en 1863 Friedrich Kasiski publia l'attaque contre les clés répétées.
