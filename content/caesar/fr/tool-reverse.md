# Déchiffrer le chiffre de César

Pour déchiffrer un message de César, il faut connaître le décalage de
l'expéditeur. Le déchiffrement recule chaque lettre d'autant de rangs :
P redevient M. Avec un mauvais décalage, le texte reste décalé, mais
d'une autre valeur. L'alphabet latin n'offre que 25 décalages : vous
pouvez aussi les essayer tous.

## Utiliser l'outil de déchiffrement

- Collez le texte chiffré dans {{control:message-input}} ; le texte
  clair s'affiche dans {{control:output}}.
- Placez le curseur de rotation sur le décalage de l'expéditeur.
  Indiquez le décalage lui-même, pas 26 moins ce décalage : l'outil
  fait le calcul inverse à votre place.
- Choisissez l'alphabet de l'expéditeur. Un texte latin passé avec
  l'alphabet russe ou ukrainien donne un résultat vide, car toutes ses
  lettres sont supprimées.
- Côté déchiffrement, il n'y a pas de cases pour les espaces et la
  casse. Les espaces et les majuscules restent toujours ; les chiffres
  et la ponctuation sont supprimés.
- Pour chiffrer une réponse, revenez en arrière avec {{control:swap}}.

## Un exemple rapide

`PHHWDWQRRQ` avec un décalage de 3 donne `MEETATNOON`. P recule de 3
rangs jusqu'à M, et D recule jusqu'à A. Déchiffrer avec 3 revient à
chiffrer avec 23 : les deux transforment `PHHWDWQRRQ` en `MEETATNOON`.

Un mauvais décalage paraît aussi étranger que le texte chiffré. Un
décalage de 2 donne `NFFUBUOPPO`, un décalage de 4 donne `LDDSZSMNNM`.
Le mauvais alphabet échoue aussi : l'alphabet allemand compte 30
lettres, et un décalage de 3 y donne `NEEUBUOÖÖO`.

## Pas de clé ?

- [Le fonctionnement du chiffre de César et comment le casser](/encoder/caesar/learn) :
  {{term:brute-force}} sur les 25 décalages, ou comptage des lettres
  par {{term:frequency-analysis}}
- [Identifier un chiffre inconnu](/identify) : s'il reconnaît un
  décalage de César, il ouvre cette page avec le curseur déjà réglé
- [L'histoire du chiffre de César](/encoder/caesar/history), de
  Suétone au comptage des lettres d'al-Kindi
- [Exercices de déchiffrement sur le chiffre de César](/encoder/caesar/practice)
