# Déchiffrer le chiffre de Vigenère

Pour déchiffrer un message de Vigenère, il faut le mot-clé qui a servi
à le chiffrer. Chaque lettre de la clé recule la lettre du chiffré
d'autant de rangs que l'expéditeur l'avait avancée. Avec la bonne clé,
le texte clair revient lettre par lettre ; avec une mauvaise, on
obtient du charabia.

## Utiliser l'outil de déchiffrement

- Collez le texte chiffré dans {{control:message-input}} ; le texte
  clair s'affiche dans {{control:output}}.
- Saisissez le mot-clé dans {{control:key}}. La casse ne compte pas :
  `lemon` et `LEMON` donnent le même résultat.
- Vérifiez {{control:alphabet}}. Ce doit être l'alphabet de
  l'expéditeur. Un alphabet désordonné ne se déchiffre qu'avec
  exactement le même ordre de lettres.
- Les espaces, les chiffres et la ponctuation du texte chiffré sont
  supprimés. Le texte clair sort d'un seul bloc en majuscules : à vous
  de remettre les espaces entre les mots.
- Pour chiffrer une réponse, revenez en arrière avec {{control:swap}}.

## Un exemple rapide

`LXFOPVEFRNHR` avec la clé `LEMON` donne `ATTACKATDAWN`. Le premier L
recule de 11 rangs, le décalage de la lettre de clé L, et redevient A.

Une mauvaise clé montre où elle se trompe. `LIMON` donne
`APTACKWTDAWJ` : seules les lettres 2, 7 et 12 sont fausses, celles qui
tombent sous la deuxième lettre de la clé. `LEMONS` donne
`ATTACDTBFZUZ` : les cinq premières lettres sont justes, puis la clé
se décale.

## Pas de clé ?

- [Casser un Vigenère sans la clé](/encoder/vigenere/cryptanalysis) :
  trouver la longueur de la clé, puis chaque lettre par
  {{term:frequency-analysis}}
- [Le fonctionnement du chiffre de Vigenère](/encoder/vigenere/learn),
  avec le tableau complet lettre par lettre
- [L'histoire du chiffre de Vigenère](/encoder/vigenere/history), et
  comment Babbage et Kasiski l'ont cassé les premiers
- [Exercices de déchiffrement sur le chiffre de Vigenère](/encoder/vigenere/practice)
