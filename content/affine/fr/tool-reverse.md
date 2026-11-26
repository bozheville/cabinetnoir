# Déchiffrer le chiffre affine

Pour déchiffrer un message affine, il faut les deux nombres de la clé :
le multiplicateur `a` et le décalage `b`. Le déchiffrement retire
d'abord `b`, puis multiplie par l'inverse de `a` modulo 26. Si l'un des
deux nombres est faux, la plupart des lettres en donnent une autre et
le texte reste illisible.

## Utiliser l'outil de déchiffrement

- Collez le texte chiffré dans {{control:message-input}} ; le texte
  clair s'affiche dans {{control:output}}.
- Saisissez le `a` de l'expéditeur dans {{control:multiplier}}.
  Indiquez le multiplicateur du chiffrement, pas son inverse : l'outil
  calcule l'inverse lui-même.
- Seuls 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23 et 25 sont acceptés.
  Toute autre valeur est ignorée et la dernière valeur valide reste en
  place : vérifiez donc le champ.
- Saisissez le `b` de l'expéditeur dans {{control:shift}}.
- Côté déchiffrement, il n'y a pas d'interrupteurs pour les espaces et
  la casse. Les espaces et les majuscules restent toujours ; les
  chiffres et la ponctuation sont supprimés.
- Pour chiffrer une réponse, revenez en arrière avec {{control:swap}}.

## Un exemple rapide

`JTNGTMRTJJHZT` avec `a = 3` et `b = 7` donne `SECRETMESSAGE`.
L'inverse de 3 modulo 26 est 9, car 3 × 9 = 27. J vaut 9, et
9 × (9 − 7) = 18 : la lettre S.

Chaque nombre casse le texte à sa manière. Avec `b = 8`, le même
texte chiffré donne `JVTIVKDVJJRXV` ; avec `a = 5`, il donne
`QSWFSBCSQQAOS`. Les lettres répétées se répètent toujours, car une
lettre donne toujours la même lettre.

## Pas de clé ?

- [Casser un chiffre affine sans la clé](/encoder/affine/cryptanalysis) :
  classer les 12 multiplicateurs, puis lire le décalage sur un
  graphique d'{{term:frequency-analysis}}
- [Le fonctionnement du chiffre affine](/encoder/affine/learn), avec le
  tableau complet lettre par lettre
- [L'histoire du chiffre affine](/encoder/affine/history)
- [Exercices de déchiffrement sur le chiffre affine](/encoder/affine/practice)
