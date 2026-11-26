# Déchiffrer le chiffre nihiliste

Pour déchiffrer un message nihiliste, il faut les deux clés : le carré
et le mot-clé. L'outil convertit le mot-clé en nombres et les retranche
du texte chiffré, chiffre par chiffre. Il reste des coordonnées du
[carré de Polybe](/encoder/polybius/learn), que le carré retransforme
en lettres. Un mauvais mot-clé donne de mauvaises lettres, voire aucune.

## Utiliser l'outil de déchiffrement

- Collez les nombres dans {{control:message-input}} ; le texte clair
  s'affiche dans {{control:output}}.
- Laissez vide le champ « Clé du carré » pour le carré A–Z simple, ou
  tapez le mot-clé de l'expéditeur.
- Saisissez la {{term:additive-key}} dans le champ « Mot-clé ». Sans
  elle, aucun résultat.
- Les espaces entre les nombres aident mais ne sont pas obligatoires.
  Sans eux, l'outil découpe lui-même les chiffres en sommes valides.
- J a été fusionné avec I avant le chiffrement : il revient donc sous
  la forme d'un I.
- Pour chiffrer une réponse, revenez en arrière avec {{control:swap}}.

## Un exemple rapide

`53 89 87 54 37 36 53 89 57 54 76 44` avec la clé `RUSSIA` donne
`ATTACKATDAWN`. Le premier nombre est 53 et R vaut 42. Chiffre par
chiffre, 5 − 4 = 1 et 3 − 2 = 1 : on obtient 11, c'est-à-dire A.

Un mauvais mot-clé se trahit de deux façons. `RUSSKA` ne diffère que
par sa cinquième lettre et donne `ATTABKATDAVN` : les lettres 5 et 11
sont fausses. Avec `RUSSIAN`, certaines soustractions sortent du carré.
L'outil écarte ces nombres, et il ne reste que `ATTACKBAN`.

## Pas de clé ?

- [Casser un chiffre nihiliste sans la clé](/encoder/nihilist/cryptanalysis) :
  trouver la longueur de la clé, fixer chaque nombre de la clé, puis
  reconstituer le carré
- [Le fonctionnement du chiffre nihiliste](/encoder/nihilist/learn),
  avec la table d'addition
- [L'histoire du chiffre nihiliste](/encoder/nihilist/history)
- [Exercices de déchiffrement sur le chiffre nihiliste](/encoder/nihilist/practice)
- [Identifier un chiffre inconnu](/identify) si vous n'êtes pas sûr
  que les nombres viennent d'un chiffre nihiliste
