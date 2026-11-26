# Déchiffrer le chiffre VIC

Pour déchiffrer un message VIC, il faut trois des quatre secrets : la
phrase, la date et le numéro personnel. Le quatrième, le
{{term:keygroup}}, voyage dans le message, et l'outil le retrouve
seul. Avec ces secrets, il reconstruit la même clé, défait les deux
transpositions et relit les chiffres sur l'échiquier. Un seul secret
faux donne un fouillis de lettres et de chiffres.

## Utiliser l'outil de déchiffrement

- Collez les groupes de cinq chiffres dans {{control:message-input}} ;
  le texte clair s'affiche dans {{control:output}}. Les espaces entre
  les groupes sont facultatifs, mais le nombre de chiffres doit être
  un multiple de cinq.
- Remplissez **Phrase**, **Date** et **Numéro perso** exactement comme
  l'expéditeur.
- Le champ **Groupe-clé** est grisé. Il affiche les cinq chiffres que
  l'outil a lus dans le message, à la place indiquée par le sixième
  chiffre de la date.
- Réglez **Alphabet** sur l'échiquier de l'expéditeur. S'il a utilisé
  **Couper le message en deux**, activez l'option avec le même nombre
  dans **Couper à**.
- Les points et les chiffres reviennent, pas les espaces. Jusqu'à six
  `X` de remplissage peuvent rester à la fin : ignorez-les.
- **Montrer les calculs de clé** affiche les mêmes lignes A à S que sur
  la page de chiffrement.
- Pour chiffrer une réponse, revenez en arrière avec {{control:swap}}.

## Un exemple rapide

Collez les 13 groupes de la page de chiffrement :

`36468 87820 86582 86639 59530 50098 00052 72401 86536 78885 50052
75803 60092`

Saisissez la phrase *Twas the night before Christmas*, la date
`13/9/1959` et le numéro personnel `6`. L'outil retrouve le groupe-clé
`72401` et donne `ATTACKATDAWN.BYDAWNIMEAN0500.XXXX`.

Remplacez seulement le numéro personnel par `7`, et le résultat
devient `R.APBJRRL98550ASRTMJELRRRENGTPNCE`. La feuille de calcul
produit une autre clé, et plus rien n'est lisible.

## Pas de clé ?

Personne n'a jamais cassé le VIC par la cryptanalyse : ce site n'a
donc pas de casseur VIC. Le FBI n'a lu le message de la pièce creuse
qu'en 1957. Cette année-là, Reino Häyhänen, l'espion à qui il était
destiné, a fait défection et livré ses secrets.

- [Casser le chiffre VIC](/encoder/vic/learn#breaking-it) : pourquoi le
  FBI n'a pas pu le lire
- [Guides pas à pas](/encoder/vic/learn#guides) : chiffrer et
  déchiffrer votre premier message
- [Fonctionnement du chiffre VIC](/encoder/vic/learn) : le calcul de
  la clé, ligne par ligne
- [Histoire du chiffre VIC](/encoder/vic/history) : la pièce creuse,
  l'espion transfuge et l'arrestation de Rudolf Abel
- [Défis du chiffre VIC](/encoder/vic/practice) : déchiffrez de vrais
  messages vous-même
