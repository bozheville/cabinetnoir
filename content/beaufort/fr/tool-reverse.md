# Déchiffrer le chiffre de Beaufort

Pour déchiffrer un message de Beaufort, il faut le mot-clé et la
variante choisis par l'expéditeur. Le Beaufort classique est
réciproque : déchiffrer, c'est refaire la même opération,
`P = K − C`. Cette page et celle du chiffrement donnent donc le même
résultat pour le même texte et la même clé. Avec une mauvaise clé, on
obtient du charabia.

## Utiliser l'outil de déchiffrement

- Collez le texte chiffré dans {{control:message-input}} ; le texte
  clair s'affiche dans {{control:output}}.
- Saisissez le mot-clé dans {{control:key}}. La casse ne compte pas :
  `lemon` et `LEMON` donnent le même résultat.
- Vérifiez le sélecteur « Variante ». Le Beaufort classique déchiffre
  exactement comme il chiffre. Le Beaufort variante déchiffre avec
  `P = C + K` : il doit correspondre au choix de l'expéditeur.
- Vérifiez {{control:alphabet}}. Une table désordonnée ne se
  déchiffre qu'avec exactement le même ordre de lettres.
- Les espaces, les chiffres et la ponctuation du texte chiffré sont
  supprimés. Le texte clair sort d'un seul bloc en majuscules : à vous
  de remettre les espaces entre les mots.

## Un exemple rapide

`LLTOLBETLNPR` avec la clé `LEMON` donne `ATTACKATDAWN`. Le premier L
rencontre la lettre de clé L : L − L = A. Collez ce même texte chiffré
sur la page de chiffrement, et `ATTACKATDAWN` en sort aussi.

Un mauvais réglage se repère vite. `LIMON` donne `AXTACKETDAWR` :
seules les lettres 2, 7 et 12 sont fausses, celles qui tombent sous la
lettre de clé erronée. La bonne clé avec « Beaufort variante » donne
`WPFCYMIFZAAV`, faux dès la première lettre.

## Pas de clé ?

- [Casser un Beaufort sans la clé](/encoder/beaufort/cryptanalysis) :
  trouver la longueur de la clé, puis chacune de ses lettres
- [Le fonctionnement du chiffre de Beaufort](/encoder/beaufort/learn),
  avec la {{term:tabula-recta}} inversée
- [L'histoire du chiffre de Beaufort](/encoder/beaufort/history), de la
  carte de l'amiral à la M-209
- [Exercices de déchiffrement sur le chiffre de Beaufort](/encoder/beaufort/practice)
- [Identifier un chiffre inconnu](/identify), si vous n'êtes pas sûr
  qu'il s'agisse de Beaufort
