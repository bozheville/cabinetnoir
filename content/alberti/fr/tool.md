# Le chiffre d'Alberti en bref

Le chiffre d'Alberti utilise deux disques concentriques : un anneau
extérieur fixe de majuscules et un anneau intérieur mobile de
minuscules dans le désordre. Chaque lettre extérieure est remplacée par
la lettre intérieure placée en face, et l'on tourne le disque intérieur
de temps en temps : la substitution ne cesse de changer. Leon Battista
Alberti l'a décrit vers 1467 ; c'est le premier chiffre
{{term:polyalphabetic}} connu.

## Utiliser l'outil

- Tapez votre message dans {{control:message-input}} ; le résultat
  s'affiche dans {{control:output}} en minuscules, comme le disque
  intérieur.
- Le disque extérieur porte 20 lettres et les chiffres 1–4 :
  `ABCDEFGILMNOPQRSTVXZ1234`. H, J, K, U, W et Y n'y figurent pas et
  sont supprimés, tout comme les espaces et la ponctuation.
- Réglez le nombre de lettres chiffrées avant chaque rotation avec
  {{control:period}} (2 par défaut), et l'ampleur de la rotation avec
  {{control:increment}} (3 par défaut).
- Changez la position de départ avec {{control:rotate-left}} et
  {{control:rotate-right}}.
- Appuyez sur {{control:swap}} pour déchiffrer. Il faut la même
  période, le même incrément et la même position de départ que
  l'expéditeur.

## Un exemple rapide

`SECRETNOTE` avec une période de 2 et un incrément de 3 donne
`rfdugs&xft`. S et E sont lus avec le disque en position de départ, C
et R après la première rotation, et ainsi de suite toutes les deux
lettres.

## Pour aller plus loin

Les lettres placées au même rang dans chaque bloc partagent la même
substitution : c'est la porte d'entrée du cryptanalyste.

- [Le fonctionnement du chiffre d'Alberti](/encoder/alberti/learn),
  rotation par rotation
- [Casser un chiffre d'Alberti sans la clé](/encoder/alberti/cryptanalysis)
- [L'histoire du chiffre d'Alberti](/encoder/alberti/history), de la
  Renaissance aux machines à chiffrer
- [Exercices pratiques sur le chiffre d'Alberti](/encoder/alberti/practice)
