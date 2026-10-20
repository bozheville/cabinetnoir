# Transposition colonnaire : guides

## Guide 1 — votre première transposition

1. Ouvrez l'outil et tapez le mot-clé `SUN`. La grille affiche
   l'{{term:column-order}} sous forme de badges numérotés : 1 sous la
   colonne que le mot-clé lit en premier.
2. Tapez `MEET ME AT NOON` et comparez avec la grille : le chiffre
   contient exactement les mêmes lettres, lues colonne par colonne dans
   l'ordre des badges.
3. Passez en mode déchiffrement et recollez le cryptogramme — il
   revient inchangé. La transposition se défait d'elle-même quand on
   connaît l'ordre de lecture.

## Guide 2 — complétée ou irrégulière

1. Chiffrez un message dont la longueur ne se divise pas par la longueur
   du mot-clé — par exemple 13 lettres sous `SUN` (3 colonnes).
2. Chiffrez une fois avec « Laisser la dernière ligne incomplète » et
   une fois sans. Avec le complètement, la longueur du chiffre est un
   multiple de 3 ; sans, elle est de 13 — la forme de la grille
   trahit ou cache de l'information.
3. Comptez combien de largeurs candidates divisent la longueur
   complétée : chaque diviseur est une hypothèse que le cryptanalyste
   doit essayer. Les grilles irrégulières raccourcissent cette liste.

## Guide 3 — double transposition

1. Cochez « Double transposition » et ajoutez un second mot-clé, par
   exemple `WOLF`.
2. Chiffrez le même message avec et sans le second mot-clé et comparez
   les deux cryptogrammes : le double ne laisse aucun fragment de
   colonne lisible — précisément les fragments que fuite le chiffre
   simple.
3. Voilà pourquoi les armées doublaient la transposition, et pourquoi le
   déchiffreur guidé de cette application s'en tient à la version
   simple.
