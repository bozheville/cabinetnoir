# La machine Enigma en bref

Enigma est une machine à chiffrer électromécanique employée par les
forces armées allemandes de la fin des années 1920 à la Seconde Guerre
mondiale. Chaque frappe envoie le courant à travers trois
{{term:rotor}}s et un {{term:reflector}}, et les rotors avancent après
chaque lettre : l'alphabet de substitution change à chaque caractère.
Les cryptologues polonais l'ont cassée les premiers ; Bletchley Park
l'a lue à grande échelle.

## Utiliser l'outil

- Tapez votre message dans {{control:message-input}} ; le résultat
  s'affiche dans {{control:output}}. Seules les lettres A–Z sont
  traitées — espaces, chiffres et ponctuation sont supprimés, comme
  sur la vraie machine, qui n'avait pas de barre d'espace.
- Saisissez la position de départ en trois lettres dans
  {{control:key}}, par exemple `AAA` (la valeur par défaut). Tout ce
  qui n'est pas exactement trois lettres ne donne aucun résultat.
- La machine est figée : une Enigma I avec les rotors I, II et III, le
  réflecteur B et pas de tableau de connexions. Sur une vraie feuille
  de clés, la position de départ n'était qu'une partie de la clé.
- Enigma est réciproque : avec la même position de départ, chiffrer le
  cryptogramme redonne le clair. Appuyer sur {{control:swap}}
  ne change que l'intitulé.

## Un exemple rapide

`AAAAA` avec la position de départ `AAA` donne `BDZGO`. La même lettre
sort de cinq façons différentes, car le rotor de droite avance avant
chaque frappe — et aucune lettre n'est jamais chiffrée en elle-même.

## Pour aller plus loin

- [Le fonctionnement de la machine Enigma](/encoder/enigma/learn) :
  rotors, avance et réflecteur
- [L'histoire d'Enigma](/encoder/enigma/history), de Scherbius à la
  bomba polonaise et à Bletchley Park
- [Exercices pratiques sur Enigma](/encoder/enigma/practice)
