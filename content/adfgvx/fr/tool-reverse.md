# Déchiffrer le chiffre ADFGVX

Pour déchiffrer un message ADFGVX, il faut la variante et les deux
mots-clés. Le déchiffrement refait les deux étapes à l'envers. L'outil
reconstruit d'abord les colonnes à partir de la clé de transposition et
de la longueur du message, puis lit les paires de lettres ligne par
ligne. Le carré à clé retransforme ensuite chaque paire en caractère.

## Utiliser l'outil de déchiffrement

- Collez le texte chiffré dans {{control:message-input}} ; le texte
  clair s'affiche dans {{control:output}}.
- Choisissez la variante de l'expéditeur : ADFGX (5×5, lettres
  seulement) ou ADFGVX (6×6, lettres et chiffres).
- Saisissez le mot-clé de la grille dans {{control:square-key}} et
  celui des colonnes dans {{control:transposition-key}}.
- Seules les lettres A, D, F, G, V et X sont lues, en majuscules ou en
  minuscules. Tout le reste est ignoré.
- La grille de l'expéditeur a été complétée par des X : le texte clair
  peut donc finir par un caractère en trop. `ATTACKAT` avec les mêmes
  clés se déchiffre en `ATTACKAT9`.
- J a été fusionné avec I : il revient donc sous la forme d'un I.
- Pour chiffrer une réponse, revenez en arrière avec {{control:swap}}.

## Un exemple rapide

`AFDAXXXXAAAAVDVVVAFAADAG` avec la clé du carré `NIGHT` et la clé de
transposition `GERMAN` donne `ATTACKATDAWN`. Les 24 lettres remplissent
6 colonnes de 4. Remises dans l'ordre de `GERMAN`, la première ligne se
lit `AXAVAV` : les paires `AX`, `AV`, `AV`, soit A, T, T.

Chaque clé échoue à sa façon. Une mauvaise clé du carré garde la
structure mais renomme les lettres : `DAY` donne `ECCEGLECHEVD`.
Inverser les deux dernières lettres de `GERMAN` en `GERMNA` donne
`ATYACGATLAWN` : la plupart des lettres tiennent, mais les lettres 3,
6 et 9 sont fausses.

## Pas de clé ?

- [Casser un ADFGVX sans la clé](/encoder/adfgvx/cryptanalysis) :
  trouver la longueur de la clé, remettre les colonnes en ordre, puis
  résoudre le carré
- [Le fonctionnement du chiffre ADFGVX](/encoder/adfgvx/learn), carré
  et mélange
- [L'histoire du chiffre ADFGVX](/encoder/adfgvx/history), de Nebel à
  Painvin
- [Exercices de déchiffrement sur le chiffre ADFGVX](/encoder/adfgvx/practice)
- [Identifier un chiffre inconnu](/identify) si le message ne contient
  pas que les lettres ADFGVX
