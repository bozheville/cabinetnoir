# Le chiffre autokey en bref

Le chiffre autokey (ou autoclave) est un Vigenère dont la clé ne se répète
jamais : une courte {{term:primer}} lance la clé, puis le message
lui-même la prolonge. La période répétée qui trahit le Vigenère
ordinaire disparaît. Giovan Battista Bellaso a proposé l'idée en 1553,
et Blaise de Vigenère a publié en 1586 la forme qui porte en général
son nom.

## Utiliser l'outil

- Tapez ou collez votre texte dans {{control:message-input}} ; le
  résultat s'affiche dans {{control:output}}.
- Saisissez une amorce dans {{control:key}} — quatre à six lettres,
  c'est l'usage. Sans amorce, aucun résultat.
- La rangée de flux de clé, sous les réglages, montre l'amorce en
  surbrillance, suivie de votre propre texte clair qui nourrit la clé.
- Seules les lettres A–Z sont chiffrées. Les espaces, les chiffres et
  la ponctuation sont supprimés, et le résultat est en majuscules.
- Appuyez sur {{control:swap}} pour déchiffrer avec la même amorce ;
  l'outil reconstruit le flux de clé à partir de chaque lettre
  retrouvée.

## Un exemple rapide

`ATTACKATDAWN` avec l'amorce `QUEENLY` donne `QNXEPVYTWTWP`. Les sept
premières lettres utilisent Q, U, E, E, N, L, Y ; à partir de la
huitième, la clé est le texte clair lui-même : A, T, T, A, C.

## Pour aller plus loin

Comme le clair et la clé sont le même texte, un mot deviné
({{term:crib}}) que l'on fait glisser le long du cryptogramme révèle la
suite de la clé.

- [Le fonctionnement du chiffre autokey](/encoder/autokey/learn),
  lettre par lettre
- [Casser un autokey sans la clé](/encoder/autokey/cryptanalysis)
  par glissement de mot probable
- [L'histoire du chiffre autokey](/encoder/autokey/history), de
  Bellaso à Vigenère
- [Exercices pratiques sur le chiffre autokey](/encoder/autokey/practice)
