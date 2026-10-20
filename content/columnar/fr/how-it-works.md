# Fonctionnement du chiffre de transposition colonnaire

## L'idée en une phrase

La transposition colonnaire est une {{term:transposition}} : chaque
lettre garde son identité et ne change que de place. Le mot-clé décide
comment les places sont mélangées — écrivez le message ligne par ligne
dans une grille, puis lisez les colonnes dans l'ordre qu'épelle le
mot-clé.

## La recette

1. Choisissez un mot-clé, par exemple `SUN`. Ses lettres triées
   alphabétiquement (N, S, U) fixent l'{{term:column-order}} : la
   colonne sous N se lit en premier, puis S, puis U.
2. Écrivez le texte clair ligne par ligne sous le mot-clé, une lettre
   par case : `ATT / ACK / ATD / AWN`.
3. Lisez les colonnes dans l'ordre du mot-clé, de haut en bas : la
   colonne N donne `TKDN`, la colonne S `AAAA`, la colonne U `TCTW`.
4. Le chiffre est la concaténation des colonnes : `TKDNAAAATCTW`. Pour
   déchiffrer, reconstruisez la grille de la même manière et lisez-la
   ligne par ligne.

## Un exemple travaillé

{{example:columnar-basic}}

Chaque ligne suit une lettre du texte clair : dans quelle colonne de la
grille elle a été écrite, et à quelle position du chiffre elle
aboutit. Les lettres ne changent jamais — A reste A — mais leur ordre
est brouillé au point de méconnaître sans le mot-clé.

## Complètement et dernière ligne incomplète

Si la longueur du message ne remplit pas la dernière ligne,
l'expéditeur a deux options. Le complètement termine la grille avec une
lettre factice (l'outil utilise `X`) : le rectangle est régulier, toutes
les colonnes ont la même longueur, et la longueur du chiffre trahit les
largeurs possibles. Laisser la dernière ligne incomplète garde la grille
irrégulière : un peu plus dure à analyser, et c'est la pratique manuelle
classique. L'outil propose les deux.

## Double transposition

Chiffrer le résultat une seconde fois avec un autre mot-clé — la double
transposition classique — brise la structure simple des colonnes. La
faiblesse de la colonne unique que vous allez exploiter ci-dessous
disparaît en grande partie ; c'est pourquoi les utilisateurs sérieux
(deux armées de 14-18 au SOE) appliquaient toujours la transposition
deux fois.
