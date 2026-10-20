# Comment fonctionne le carré de Polybe

## L'idée en une phrase

Le carré de Polybe transforme chaque lettre en une **paire de
nombres** — la ligne et la colonne d'une grille 5×5 — si bien qu'un
message devient un flux de coordonnées qui ne dit rien sans la grille.

## La recette

1. Dessinez une grille 5×5 et remplissez-la avec l'alphabet. Il ne
   reste que 24 lettres après le partage de la cellule entre I et J :
   les deux vivent dans la même case.
2. Numérotez les lignes et les colonnes de 1 à 5. Chaque lettre a
   désormais une adresse : `A` est `11`, `B` est `12`, `Z` est `55`.
3. Pour chiffrer, remplacez chaque lettre par sa paire : `ATTAQUE`
   devient une suite de paires comme `11 44 44 …`.
4. Pour déchiffrer, coupez le flux de chiffres en paires et cherchez
   chacune dans la grille — la paire est la ligne et la colonne de la
   lettre.

## Un exemple commenté

{{example:polybius-basic}}

Chaque ligne suit une lettre du texte clair : les coordonnées qu'elle
devient, et la croissance du flux de paires. Remarquez la forme : deux
chiffres par lettre, rien que les chiffres de 1 à 5 — toute
l'empreinte de ce chiffre.

## Le carré clé

Remplissez d'abord la grille avec une {{term:key}} et la correspondance
change du tout au tout. Avec le mot-clé `SPARTAN`, le carré commence
`S P A R T A N…` — les lettres du mot-clé (dédoublonnées), puis le
reste de l'alphabet dans l'ordre.

{{example:polybius-keyed}}

Les paires ne pointent plus vers les mêmes lettres que le carré simple
— un attaquant qui suppose le carré simple décode du charabia. La case
partagée I/J survit : le carré garde toujours 25 lettres.

## Pourquoi c'est une substitution déguisée

Retirez la grille : rien n'a bougé. Chaque lettre du texte clair
correspond à un symbole fixe, toujours. Les coordonnées ne sont qu'un
alphabet écrit en nombres — une {{term:substitution}}, pas une
transposition. Voilà pourquoi le chiffré garde les empreintes d'une
substitution : la paire la plus fréquente est la lettre la plus
fréquente, E, portant le nombre `15` de sa case.

{{try:polybius-basic}}
