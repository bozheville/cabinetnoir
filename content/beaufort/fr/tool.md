# Le chiffre de Beaufort en bref

Le chiffre de Beaufort est un proche parent du Vigenère : chaque lettre
est chiffrée par une lettre d'un mot-clé répété, mais on soustrait au
lieu d'additionner. Dans le Beaufort classique, la lettre chiffrée
vaut `clé − clair`, ce qui rend le chiffre réciproque : la même
opération chiffre et déchiffre. Il porte le nom de l'amiral sir
Francis Beaufort, celui de l'échelle des vents.

## Utiliser l'outil

- Tapez ou collez votre texte dans {{control:message-input}} ; le
  résultat s'affiche dans {{control:output}}.
- Saisissez un mot-clé dans {{control:key}}. Il se répète sur tout le
  message ; une clé longue résiste mieux.
- Choisissez la variante dans le sélecteur « Variante ». Le Beaufort
  classique, `C = K − P`, fonctionne de la même façon dans les deux
  sens. Le Beaufort variante, `C = P − K`, équivaut au déchiffrement de
  Vigenère : il faut le bouton d'échange pour déchiffrer.
- Réglez l'alphabet du chiffre dans {{control:alphabet}} : A–Z par
  défaut, ou votre propre ordre pour une table désordonnée.
- Seules les lettres de cet alphabet sont chiffrées. Les espaces, les
  chiffres et la ponctuation sont supprimés, et le résultat est en
  majuscules.

## Un exemple rapide

`ATTACKATDAWN` avec la clé `LEMON` donne `LLTOLBETLNPR` en Beaufort
classique. Le premier A rencontre L : L − A = L. Repassez
`LLTOLBETLNPR` dans l'outil avec la même clé et `ATTACKATDAWN`
revient.

## Pour aller plus loin

- [Le fonctionnement du chiffre de Beaufort](/encoder/beaufort/learn),
  avec la {{term:tabula-recta}} inversée
- [Casser un Beaufort sans la clé](/encoder/beaufort/cryptanalysis) :
  longueur de clé, puis lettres de la clé
- [L'histoire du chiffre de Beaufort](/encoder/beaufort/history), de la
  carte de l'amiral à la M-209
- [Exercices pratiques sur le chiffre de Beaufort](/encoder/beaufort/practice)
