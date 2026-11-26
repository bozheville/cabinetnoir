# Déchiffrer le chiffre de Saknussemm

Pour déchiffrer un message de Saknussemm, il faut connaître sa forme :
le nombre de lettres par groupe et de groupes par ligne. L'outil pose
les groupes côte à côte comme des colonnes, lit les rangées, puis
remet le tout à l'endroit. Les lettres ne changent jamais : une erreur
ne fait que brouiller leur ordre.

## Utiliser l'outil de déchiffrement

- Collez les groupes dans {{control:message-input}} ; le texte clair
  s'affiche dans {{control:output}} d'un seul bloc en majuscules.
- Gardez les espaces entre les groupes si vous les avez. L'outil prend
  alors chaque groupe pour une colonne, et les réglages de forme ne
  jouent plus.
- Pour un bloc de lettres continu, reprenez la forme de l'expéditeur
  avec {{control:cluster-width-picker}} et
  {{control:clusters-per-line-picker}}. L'outil découpe le bloc selon
  cette forme.
- Les chiffres et la ponctuation sont supprimés. Les espaces entre les
  mots sont perdues : à vous de les remettre.
- Avec {{control:load-parchment}}, le champ se remplit du texte
  brouillé que Lidenbrock dicte dans le roman. Il redonne le message
  latin, à quelques lettres près, déplacées ou manquantes comme dans
  le texte imprimé.
- Pour chiffrer une réponse, revenez en arrière avec {{control:swap}}.

## Un exemple rapide

`SF LE EN FS`, avec 3 lettres par groupe et 2 groupes par ligne,
donne `SNEFFELS`. Les rangées se lisent `SLEF`, `FENS` ; à l'envers,
elles donnent le nom du volcan.

Collez les mêmes lettres d'un seul bloc, `SFLEENFS`, en gardant la
forme par défaut 7 × 3. L'outil coupe le bloc aux mauvais endroits et
donne `NLSEFFES`. Inversez les deux premiers groupes, `LE SF EN FS`,
et vous obtenez `SNFEFESL` : les mêmes lettres, dans le mauvais
ordre.

## Forme perdue ?

- [Le fonctionnement du chiffre de Saknussemm](/encoder/saknussemm/learn),
  et comment retrouver une forme perdue à la main
- [L'histoire du chiffre de Saknussemm](/encoder/saknussemm/history),
  du roman de Verne aux livres d'énigmes
- [Exercices de déchiffrement sur le chiffre de Saknussemm](/encoder/saknussemm/practice)
- [Identifier un chiffre inconnu](/identify) si vous n'êtes pas sûr
  qu'il s'agisse d'une transposition
