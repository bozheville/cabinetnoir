# Le chiffre nihiliste en bref

Le chiffre nihiliste transforme les lettres en coordonnées du carré de
Polybe, puis leur ajoute une clé répétée, elle aussi convertie en
coordonnées. L'addition se fait chiffre par chiffre, sans retenue : le
résultat est une suite de nombres de deux ou trois chiffres. Les
révolutionnaires russes s'en servaient dans les années 1880 pour faire
passer leurs lettres sous le nez des censeurs des prisons du tsar.

## Utiliser l'outil

- Tapez ou collez votre texte dans {{control:message-input}} ; les
  nombres s'affichent dans {{control:output}}.
- Le champ « Clé du carré » est facultatif : laissez-le vide pour le
  carré A–Z simple, ou tapez un mot-clé pour mélanger la grille.
- Le champ « Mot-clé » contient la {{term:additive-key}}. Elle se
  répète sur tout le message ; sans elle, aucun résultat.
- Seules les lettres sont chiffrées, et J est fusionné avec I. Les
  espaces, les chiffres et la ponctuation sont supprimés.
- La table d'addition sous le texte montre `clair + clé = somme` pour
  chaque lettre. Les sommes vont de 22 à 110 : un total de colonne
  égal à 10 déborde sur le rang suivant, donc `ZZZZZ` avec la clé
  `ZZZZZ` donne `110 110 110 110 110`.
- Appuyez sur {{control:swap}} pour déchiffrer avec les deux mêmes
  clés.

## Un exemple rapide

`ATTACKATDAWN` avec la clé `RUSSIA` donne
`53 89 87 54 37 36 53 89 57 54 76 44`. Le premier A vaut 11 et R vaut
42 : 11 + 42 = 53.

## Pour aller plus loin

Chaque nombre de la clé décale sa colonne de sommes d'une valeur fixe :
la longueur de la clé apparaît quand on écrit les nombres en lignes.

- [Le fonctionnement du chiffre nihiliste](/encoder/nihilist/learn),
  avec la table d'addition
- [Casser un chiffre nihiliste sans la clé](/encoder/nihilist/cryptanalysis)
- [L'histoire du chiffre nihiliste](/encoder/nihilist/history)
- [Exercices pratiques sur le chiffre nihiliste](/encoder/nihilist/practice)
