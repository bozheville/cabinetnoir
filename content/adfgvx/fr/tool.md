# Le chiffre ADFGVX en bref

ADFGVX est le chiffre de campagne allemand de 1918. Il empile deux
étapes : un {{term:polybius-square}} à clé transforme chaque caractère
en deux lettres parmi A, D, F, G, V et X, puis une
{{term:transposition}} par colonnes mélange ces lettres sous un second
mot-clé. Les six lettres ont été choisies parce qu'elles se distinguent
facilement en Morse. Le cryptanalyste français Georges Painvin l'a
cassé à temps pour l'offensive de juin 1918.

## Utiliser l'outil

- Tapez ou collez votre texte dans {{control:message-input}} ; le
  résultat s'affiche dans {{control:output}}, écrit uniquement avec les
  lettres du chiffre.
- Choisissez la variante : ADFGX utilise un carré de 5×5 lettres (J
  est fusionné avec I) ; ADFGVX utilise un carré de 6×6 qui contient
  aussi les chiffres 0–9.
- Saisissez le mot-clé de la grille dans {{control:square-key}} et
  celui du mélange des colonnes dans {{control:transposition-key}}.
- Les espaces et la ponctuation sont supprimés ; dans la variante
  ADFGX, les chiffres aussi.
- La grille est complétée par des X jusqu'à un rectangle plein : un
  message court peut donc se déchiffrer avec une lettre en trop à la
  fin.
- Appuyez sur {{control:swap}} pour déchiffrer avec les deux mêmes
  clés.

## Un exemple rapide

`ATTACKATDAWN` avec la clé du carré `NIGHT` et la clé de transposition
`GERMAN` donne `AFDAXXXXAAAAVDVVVAFAADAG`. A devient `AX`, T devient
`AV`, et le mélange des colonnes sépare les paires.

## Pour aller plus loin

- [Le fonctionnement du chiffre ADFGVX](/encoder/adfgvx/learn), carré
  et mélange
- [Casser un ADFGVX sans la clé](/encoder/adfgvx/cryptanalysis)
- [L'histoire du chiffre ADFGVX](/encoder/adfgvx/history), de Nebel à
  Painvin
- [Exercices pratiques sur le chiffre ADFGVX](/encoder/adfgvx/practice)
