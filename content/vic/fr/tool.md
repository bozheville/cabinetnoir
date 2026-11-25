# Le chiffre VIC en bref

Le chiffre VIC est un chiffre manuel soviétique de la guerre froide.
Les espions du KGB l'utilisaient dans les années 1950 pour envoyer des
messages en groupes de cinq chiffres. En 1953, le FBI en trouve un dans
une pièce creuse et ne parvient pas à le lire pendant quatre ans. On le
considère souvent comme le chiffre le plus solide jamais réalisé au
papier et au crayon.

Il repose sur quatre petits secrets : une phrase, une date, un numéro
personnel et un {{term:keygroup}} de cinq chiffres tirés au hasard. Un
peu d'arithmétique en tire un {{term:straddling-checkerboard}}, qui
change les lettres en chiffres, et deux clés de
{{term:transposition}}, qui mélangent ces chiffres.

## Comment utiliser l'outil

- Tapez votre message dans {{control:message-input}}. Les groupes de
  cinq chiffres s'affichent dans {{control:output}}.
- Remplissez les quatre secrets :
  - **Phrase** : une phrase d'au moins 20 lettres.
  - **Date** : jour, mois et année, par exemple `13/9/1959`.
  - **Numéro perso** : un nombre de 1 à 20.
  - **Groupe-clé** : cinq chiffres. Le bouton **Tirer un nouveau
    groupe-clé** en propose d'autres. Changez-le à chaque message, comme
    les vrais agents.
- **Alphabet** permet de choisir l'échiquier latin (`AT ONE SIR`) ou
  cyrillique (`СНЕГОПА`, celui de Häyhänen).
- Cochez **Montrer les calculs de clé** pour voir chaque étape du
  calcul : les lignes A à S de la feuille de travail, l'échiquier et la
  largeur des deux tableaux. Chaque ligne a son info-bulle.
- L'option **Couper le message en deux** est facultative. L'outil coupe le
  message à la position indiquée dans **Couper à** et inverse les deux
  moitiés avant de chiffrer. Votre correspondant doit connaître ce
  nombre lui aussi. Laissez-la désactivée pour un premier essai.
- Les lettres, les chiffres et les points sont gardés. Le reste est
  supprimé. Chaque chiffre est écrit trois fois entre deux signes de
  nombre : `0500` devient donc 12 chiffres, plus les signes.
- L'outil peut ajouter jusqu'à six `X` à la fin, pour que le nombre de
  chiffres soit un multiple de cinq. Au déchiffrement, ignorez-les.
- Pour déchiffrer, cliquez sur {{control:swap}}, collez les groupes et
  saisissez la phrase, la date et le numéro personnel. Inutile de
  taper le groupe-clé : l'outil le retrouve dans le message.

## Un exemple rapide

Prenons le message `ATTACKATDAWN. BY DAWN I MEAN 0500.` avec ces
secrets : la phrase *Twas the night before Christmas*, la date
`13/9/1959`, le numéro personnel `6` et le groupe-clé `72401`.

L'échiquier change d'abord le texte en chiffres :
`599569645966583387658866583376025380000555000000808782828282`. Puis
deux transpositions les mélangent. On obtient 13 groupes, et le
groupe-clé `72401` se cache parmi eux, à cinq groupes de la fin :

`36468 87820 86582 86639 59530 50098 00052 72401 86536 78885 50052
75803 60092`

## Pour aller plus loin

- [Fonctionnement du chiffre VIC](/encoder/vic/learn) : le calcul de
  la clé, ligne par ligne
- [Guides pas à pas](/encoder/vic/learn#guides) : chiffrer et
  déchiffrer votre premier message
- [Casser le chiffre VIC](/encoder/vic/learn#breaking-it) : pourquoi le
  FBI n'a pas pu le lire
- [Histoire du chiffre VIC](/encoder/vic/history) : la pièce creuse,
  l'espion transfuge et l'arrestation de Rudolf Abel
- [Défis du chiffre VIC](/encoder/vic/practice) : déchiffrez de vrais
  messages vous-même
