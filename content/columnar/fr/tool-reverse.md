# Déchiffrer la transposition colonnaire

Pour déchiffrer une transposition colonnaire, il faut le mot-clé et le
réglage de grille de l'expéditeur. L'outil retrouve d'abord la forme de
la grille à partir de la longueur du mot-clé et de celle du message.
Il replace ensuite les colonnes dans leur ordre de lecture et lit les
lignes. Avec un mauvais mot-clé, toutes les lettres sont là, mais dans
le désordre.

## Utiliser l'outil de déchiffrement

- Collez le texte chiffré dans {{control:message-input}} ; le texte
  clair s'affiche dans {{control:output}}.
- Saisissez le mot-clé dans {{control:keyword-input}}. Seul compte
  l'ordre alphabétique de ses lettres : `BCA` déchiffre comme `SUN`.
- Pour une double transposition, cochez {{control:double-toggle}} et
  remplissez le second mot-clé, {{control:second-keyword-input}}.
  L'outil annule d'abord le second mot-clé — le dernier appliqué par
  l'expéditeur — puis le premier.
- Réglez {{control:grid-toggle}} comme l'expéditeur. Une grille
  complétée se déchiffre dans les deux cas, mais une dernière ligne
  courte exige la case cochée.
- Les espaces, les chiffres et la ponctuation sont supprimés. Les X de
  remplissage restent à la fin du texte clair : retirez-les vous-même.
- Pour chiffrer une réponse, revenez en arrière avec {{control:swap}}.

## Un exemple rapide

`TKDNAAAATCTW` avec le mot-clé `SUN` donne `ATTACKATDAWN`. Douze
lettres sous un mot-clé de 3 lettres font 4 lignes : chaque colonne
compte donc 4 lettres. N se lit en premier, donc `TKDN` retourne dans
la troisième colonne, `AAAA` dans la première et `TCTW` dans la
deuxième.

Le réglage de la grille compte autant que le mot-clé. `ATTACKATDAW`
avec une dernière ligne courte donne `TKDAAAATCTW`. Déchiffré avec
{{control:grid-toggle}} décoché, il devient `ACTATKAWDTA` : les bonnes
lettres, mais des colonnes de la mauvaise longueur.

## Pas de clé ?

- [Casser une transposition colonnaire sans la clé](/encoder/columnar/cryptanalysis) :
  trouver le nombre de colonnes, puis les faire glisser jusqu'à ce que
  les lignes se lisent
- [Le fonctionnement de la transposition colonnaire](/encoder/columnar/learn),
  grille par grille
- [L'histoire de la transposition colonnaire](/encoder/columnar/history),
  des tranchées aux codes-poèmes du SOE
- [Exercices de déchiffrement sur la transposition colonnaire](/encoder/columnar/practice)
- [Identifier un chiffre inconnu](/identify) si vous n'êtes pas sûr
  qu'il s'agisse d'une transposition
