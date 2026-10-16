# ADFGVX pas à pas

## Avant de commencer

Ouvrez l'outil sur le chiffre ADFGVX. Deux champs de clé jouxtent le
sélecteur de variante : la {{term:key}} du carré et la clé de
transposition. Ce guide déroule un chiffrement complet avec les clés
de l'exemple par défaut — `NIGHT` pour le carré et `GERMAN` pour la
transposition.

## Étape 1 — voir le carré travailler

Tapez un court message, par exemple `ATTACK AT 9 AM`, et regardez la
sortie : elle ne contient que les lettres **A D F G V X** — deux fois
plus de caractères que votre message. Chaque caractère en clair a été
remplacé par sa ligne et sa colonne dans le
{{term:polybius-square}}. Changez une lettre de la clé du carré et
toutes les coordonnées changent : le carré est la moitié
{{term:substitution}} du chiffre.

## Étape 2 — voir le mélange travailler

Changez maintenant seulement la clé de transposition. La sortie garde
les mêmes longueurs mais les lettres sautent — le flot fractionné a
été coupé en colonnes et relu dans l'ordre de la clé. C'est la moitié
{{term:transposition}}. Remarquez ce qu'aucune moitié n'accomplit
seule : la substitution n'aplatit rien par elle-même, et la
transposition ne porte aucune statistique de lettres — la force vient
de leur empilement.

## Étape 3 — décrypter avec l'outil

Passez en Décrypter, collez le texte chiffré et gardez les mêmes
clés. L'outil reconstruit la grille, la relit ligne par ligne et
cherche les paires de coordonnées dans le carré. Les caractères de
complétion (le remplissage du rectangle) peuvent ajouter une ou deux
lettres parasites à la fin des messages courts — c'est le rectangle
qui se complète, pas un bug.

## Étape 4 — essayer la variante ADFGX

Passez la variante sur ADFGX : le carré perd sa sixième ligne (pas de
chiffres, et J se fond dans I), et les caractères non alphabétiques
disparaissent de la sortie. Le reste du flux de travail est identique.

## Étape 5 — donnez les clés à un ami

Texte chiffré complet, les deux clés, la variante — c'est tout ce dont
un destinataire de 1918 avait besoin. Essayez les défis d'entraînement
pour voir ce qu'un attaquant sans les clés peut faire.
