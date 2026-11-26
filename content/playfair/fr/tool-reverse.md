# Déchiffrer le chiffre de Playfair

Pour déchiffrer un message de Playfair, il faut le mot-clé qui a
construit le carré de 5×5. Chaque paire chiffrée se défait avec les
trois mêmes règles, appliquées à l'envers. Sur une ligne, on recule
d'un cran à gauche ; dans une colonne, d'un cran vers le haut ; dans
un rectangle, on échange les coins. Un mauvais mot-clé construit un autre carré, et toutes
les paires deviennent du bruit.

## Utiliser l'outil de déchiffrement

- Collez le texte chiffré dans {{control:message-input}} ; les paires
  du texte clair s'affichent dans {{control:output}}, séparées par des
  espaces.
- Saisissez le mot-clé dans {{control:key}}. La casse et les espaces
  ne comptent pas : seules ses lettres, sans doublons, construisent le
  carré.
- Les espaces entre les paires sont facultatifs. Le nombre de lettres
  doit en revanche être pair : un nombre impair ne donne aucun
  résultat.
- L'outil ne retire rien de ce qu'il a ajouté. Les X de remplissage
  restent dans le texte clair, et un I peut se trouver là où
  l'expéditeur avait écrit un J. À vous d'enlever les X.
- Pour chiffrer une réponse, revenez en arrière avec {{control:swap}}.

## Un exemple rapide

`BM OD ZB XD NA GE` avec le mot-clé `PLAYFAIR EXAMPLE` donne
`HI DE TH EG OL DX`. Lisez HIDE THE GOLD : le X final ne servait qu'à
compléter un nombre impair de lettres.

Des X se glissent aussi entre deux lettres doublées. `HELLO` se
chiffre en `DM YR AN` et se déchiffre en `HE LX LO` : supprimez le X
entre les deux L. Un mot-clé plus court, `PLAYFAIR`, change l'exemple
en `DH TR WD ZC QP EM`.

## Pas de clé ?

- [Casser un Playfair sans la clé](/encoder/playfair/cryptanalysis),
  par les statistiques de {{term:digraph}}s et l'amélioration du carré
  pas à pas
- [Le fonctionnement du chiffre de Playfair](/encoder/playfair/learn) :
  le carré et les trois règles des paires
- [L'histoire du chiffre de Playfair](/encoder/playfair/history), d'un
  dîner victorien aux tranchées
- [Exercices de déchiffrement sur le chiffre de Playfair](/encoder/playfair/practice)
- [Identifier un chiffre inconnu](/identify), si vous n'êtes pas sûr
  qu'il s'agisse de Playfair
