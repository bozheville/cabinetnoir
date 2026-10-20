# Comment fonctionne le chiffre nihiliste

## L'idée en une phrase

Prenez le carré de Polybe, écrivez chaque lettre du texte clair comme
son nombre de coordonnées, et **ajoutez les nombres d'une clé qui se
répète, chiffre par chiffre, sans retenue** — le chiffré est un flux de
nombres qui ressemble à des coordonnées mais a glissé hors de la
grille.

## La recette

1. Fixez le carré — simple ou clé. Chaque lettre a désormais un nombre
   de `11` à `55` (I et J partagent une case).
2. Convertissez le mot-clé en ses propres nombres de la même façon.
   Avec la clé `RUSSIA` les nombres sont `42 45 43 43 24 11`, et ils se
   répètent sur tout le message — c'est la {{term:additive-key}}.
3. Ajoutez chaque nombre du texte clair au nombre de la clé au-dessus
   de lui, **chiffre par chiffre, sans retenue**. `44 + 42` donne
   `86` ; `15 + 45` donne `60` — les chiffres des lignes `1 + 4 = 5`,
   ceux des colonnes `5 + 5 = 10`, et une somme de 10 déborde comme
   chiffre à part entière. Ce débordement explique que les nombres
   nihilistes montent jusqu'à `110`, et qu'une somme comme `60`
   signifie `5|10`, pas `6|0`.
4. Le chiffré est la suite des sommes, d'habitude écrite avec des
   espaces : `86 68 58 …`.

## Un exemple commenté

{{example:nihilist-basic}}

Chaque ligne est une lettre du texte clair : son nombre de coordonnées,
le nombre de la clé qui l'a absorbée, et la somme. Regardez la colonne
de la clé cycler `42 45 43 43 24 11` — la périodicité que le casseur
écoute.

## Déchiffrement

Soustrayez les chiffres de la clé de chaque nombre du chiffré et
cherchez la paire obtenue dans le carré. Comme l'addition n'a jamais
retenu, la soustraction n'emprunte jamais : chaque chiffre de la somme
vaut exactement chiffre du texte clair + chiffre de la clé.

{{try:nihilist-basic}}

## Les signes dans les nombres

Chaque somme contient encore la grille : soustrayez n'importe quel
nombre de clé et les deux chiffres doivent retomber entre 1 et 5, sinon
l'hypothèse est fausse. Et comme la clé se répète, les sommes d'une
même position de clé partagent son biais — le flux ondule avec une
période, exactement ce que l'onglet Cryptoanalysis mesure.
