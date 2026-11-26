# Déchiffrer le chiffre autokey

Pour déchiffrer un message autokey, il suffit de l'amorce, la courte
clé par laquelle l'expéditeur a commencé. L'amorce ouvre les premières
lettres. Chaque lettre retrouvée sert ensuite de clé à la lettre
située une longueur d'amorce plus loin : le texte clair se déverrouille
de lui-même. Une mauvaise amorce gâche toutes les lettres qui en
dépendent.

## Utiliser l'outil de déchiffrement

- Collez le texte chiffré dans {{control:message-input}} ; le texte
  clair s'affiche dans {{control:output}}.
- Saisissez l'amorce dans {{control:key}}. La casse ne compte pas,
  mais la longueur si : l'amorce doit avoir exactement autant de
  lettres que celle de l'expéditeur.
- La rangée de flux de clé, sous les réglages, montre l'amorce en
  surbrillance, puis le texte clair à mesure que l'outil le retrouve.
- Les espaces, les chiffres et la ponctuation du texte chiffré sont
  supprimés. Le texte clair sort d'un seul bloc en majuscules : à vous
  de remettre les espaces entre les mots.
- Pour chiffrer une réponse, revenez en arrière avec {{control:swap}}.

## Un exemple rapide

`QNXEPVYTWTWP` avec l'amorce `QUEENLY` donne `ATTACKATDAWN`. Les sept
premières lettres se déchiffrent avec Q, U, E, E, N, L, Y. La
huitième se déchiffre avec la première lettre retrouvée, A.

Une lettre d'amorce fausse répète son erreur. `KUEENLY` donne
`GTTACKANDAWN` : la lettre 1 est fausse, et la lettre 8 aussi, sept
rangs plus loin. Une amorce de mauvaise longueur casse la chaîne :
`QUEEN` donne `ATTACVFAWRBK`, juste sur cinq lettres, puis du bruit.

## Pas de clé ?

- [Casser un autokey sans la clé](/encoder/autokey/cryptanalysis) en
  faisant glisser un mot deviné ({{term:crib}}) le long du texte
  chiffré
- [Le fonctionnement du chiffre autokey](/encoder/autokey/learn),
  lettre par lettre
- [L'histoire du chiffre autokey](/encoder/autokey/history), de
  Bellaso à Vigenère
- [Exercices de déchiffrement sur le chiffre autokey](/encoder/autokey/practice)
- [Identifier un chiffre inconnu](/identify), si vous n'êtes pas sûr
  qu'il s'agisse d'un autokey
