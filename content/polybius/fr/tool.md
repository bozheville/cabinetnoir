# Le carré de Polybe en bref

Le carré de Polybe range l'alphabet dans une grille de 5×5 et remplace
chaque lettre par deux chiffres : sa ligne et sa colonne. L'historien
grec Polybe l'a décrit au IIᵉ siècle av. J.-C. comme un moyen de
transmettre des lettres avec des torches. Seul, c'est une simple
{{term:substitution}}, mais ses paires de chiffres sont la brique de
base du chiffre nihiliste, d'ADFGVX et de bien d'autres chiffres
ultérieurs.

## Utiliser l'outil

- Tapez ou collez votre texte dans {{control:message-input}} ; les
  coordonnées s'affichent dans {{control:output}}.
- Laissez vide le champ « Clé du carré » pour le carré A–Z simple, ou
  tapez un mot-clé : ses lettres, sans doublons, remplissent d'abord
  la grille, puis le reste de l'alphabet suit.
- La grille a 25 cases : I et J en partagent une. Seules les lettres
  sont chiffrées ; les espaces, les chiffres et la ponctuation sont
  supprimés.
- L'interrupteur « Paires espacées », activé par défaut, met une
  espace entre les paires.
- Le carré sous les réglages met en évidence la case de la dernière
  lettre, avec sa ligne et sa colonne.
- Appuyez sur {{control:swap}} pour déchiffrer ; les chiffres sont lus
  deux par deux, avec ou sans espaces.

## Un exemple rapide

`HELLO` dans le carré simple donne `23 15 31 31 34` : H est en ligne 2,
colonne 3 ; E en ligne 1, colonne 5. `ATTACKATDAWN` donne
`11 44 44 11 13 25 11 44 14 11 52 33`.

## Pour aller plus loin

- [Le fonctionnement du carré de Polybe](/encoder/polybius/learn),
  ligne par ligne
- [Casser un carré de Polybe à clé](/encoder/polybius/cryptanalysis)
- [L'histoire du carré de Polybe](/encoder/polybius/history), des
  torches grecques aux murs des prisons
- [Exercices pratiques sur le carré de Polybe](/encoder/polybius/practice)
