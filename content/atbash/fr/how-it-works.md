# Fonctionnement du chiffre Atbash

## L'idée en une phrase

Atbash est la plus simple des {{term:substitution}} : retournez
l'{{term:alphabet}} et échangez chaque lettre avec son miroir — A
devient Z, B devient Y, et la dernière lettre devient la première.

## La recette

1. Écrivez l'alphabet.
2. En dessous, écrivez le même alphabet à l'envers.
3. Chiffrez chaque lettre par la lettre située sous elle. Rien
   d'autre : pas de clé, pas de choix, une seule correspondance fixe.
4. Le déchiffrement est la même opération — la correspondance est sa
   propre inverse, car retourner deux fois ramène au point de départ.

## Un exemple détaillé

{{example:atbash-basic}}

La colonne des indices raconte tout : une lettre à la position `x`
va toujours à la position `25 − x`. **R** (17) devient **H** (7), car
17 + 7 = 25. Chaque ligne est une paire en miroir, et le milieu de
l'alphabet (M ↔ N) se mappe sur son voisinage.

## La formule

Atbash est le cas particulier du chiffre affine avec `a` = `b` = 25 :
`y = (25·x + 25) mod 26`, ce qui se réduit à `y = 25 − x`. C'est pour
cela que chiffrer et déchiffrer sont le même geste — la formule est
sa propre inverse.

## Aucune clé

Chaque chiffre de ce site demande « quelle est la clé ? ». Atbash est
le contre-exemple qui définit la question : il n'existe qu'une seule
façon de retourner un alphabet, la correspondance est donc publique.
Le sélecteur d'alphabet de l'outil applique la même astuce aux
alphabets allemand, français, russe ou ukrainien — l'idée du miroir
marche sur tout système d'écriture ordonné, et choisir l'alphabet est
le seul « choix » restant.

{{try:atbash-basic}}
