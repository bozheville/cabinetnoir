# Déchiffrer le chiffre Pigpen

Pour déchiffrer du Pigpen, il suffit de savoir quel jeu de symboles le
message utilise. Il n'y a pas de clé : chaque glyphe vaut toujours la
même lettre, et vous associez les formes une à une. Lus avec le
mauvais jeu, les mêmes glyphes donnent d'autres lettres.

## Utiliser l'outil de déchiffrement

- Choisissez le jeu de symboles de l'expéditeur avec
  {{control:variant-selector}}. La figure de la clé et la planche de
  glyphes en dessous s'adaptent.
- Cliquez les symboles du message dans l'ordre sur
  {{control:glyph-keyboard}}. Les touches ne montrent que les dessins,
  dans l'ordre alphabétique : vous lisez par la forme, comme sur le
  papier.
- Chaque clic ajoute une lettre dans {{control:message-input}}.
  « Effacer » retire la dernière, et la gomme vide le message.
- Vous pouvez aussi taper les lettres directement dans
  {{control:message-input}}. Les espaces, les chiffres et la
  ponctuation passent tels quels.
- Lisez le message en majuscules dans {{control:output}}.
- Pour dessiner une réponse, revenez en arrière avec {{control:swap}}.

## Un exemple rapide

Prenez les 3 glyphes maçonniques de `SOS` : un V, une case ouverte
avec un point à l'intérieur, puis le V de nouveau. Cliquez ces 3
touches, et {{control:output}} affiche `SOS`.

Le jeu de symboles compte. Dans le jeu templier, ce même V veut dire
A, pas S. Avec le mauvais jeu, le message sort avec de fausses
lettres, ou avec des symboles introuvables sur le clavier.

## Ce n'est peut-être pas du Pigpen ?

Il n'y a pas de clé à trouver. Une fois le jeu de symboles connu, le
message est lu.

- [Identifier un chiffre inconnu](/identify) si les symboles
  pourraient venir d'un autre système
- [Le fonctionnement du chiffre Pigpen](/encoder/pigpen/learn) : les
  grilles, les croix et les points
- [L'histoire du Pigpen](/encoder/pigpen/history), d'Agrippa aux
  tombes maçonniques
- [Exercices de déchiffrement sur le chiffre Pigpen](/encoder/pigpen/practice)
