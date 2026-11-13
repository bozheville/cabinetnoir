# La transposition colonnaire en bref

La transposition colonnaire garde toutes les lettres mais change leur
ordre : on écrit le message en lignes sous un mot-clé, puis on lit les
colonnes dans l'ordre alphabétique des lettres du mot-clé. C'est une
{{term:transposition}}, pas une substitution : les fréquences des
lettres restent celles du clair. Ce fut un outil de terrain de la
Première Guerre mondiale et le second étage du chiffre allemand ADFGVX.

## Utiliser l'outil

- Tapez ou collez votre texte dans {{control:message-input}} ; le
  résultat s'affiche dans {{control:output}}.
- Saisissez le mot-clé dans {{control:keyword-input}}.
  {{control:transposition-grid}} montre le texte ligne par ligne, avec
  des badges qui donnent l'ordre de lecture des colonnes.
- Par défaut, la dernière ligne est complétée par des X jusqu'à former
  un rectangle. Cochez {{control:grid-toggle}} pour la laisser courte.
- Cochez {{control:double-toggle}} et remplissez
  {{control:second-keyword-input}} pour transposer deux fois, comme les
  agents en temps de guerre.
- Seules les lettres sont gardées ; cochez {{control:keep-spaces}} pour
  faire passer les espaces dans la grille. Les chiffres et la
  ponctuation sont supprimés.
- Appuyez sur {{control:swap}} pour déchiffrer avec le même mot-clé et
  les mêmes réglages.

## Un exemple rapide

`ATTACKATDAWN` sous le mot-clé `SUN` remplit quatre lignes de trois. N
vient en premier dans l'alphabet, puis S, puis U : on lit donc la
troisième, la première puis la deuxième colonne, `TKDN AAAA TCTW`, ce
qui donne `TKDNAAAATCTW`.

## Pour aller plus loin

- [Le fonctionnement de la transposition colonnaire](/encoder/columnar/learn),
  grille par grille
- [Casser une transposition colonnaire sans la clé](/encoder/columnar/cryptanalysis)
- [L'histoire de la transposition colonnaire](/encoder/columnar/history),
  des tranchées aux codes-poèmes du SOE
- [Exercices pratiques sur la transposition colonnaire](/encoder/columnar/practice)
