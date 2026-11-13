# Le chiffre Pigpen en bref

Pigpen remplace chaque lettre par un petit dessin : un morceau de
grille de morpion ou de croix en X, avec ou sans point. C'est un
chiffre par {{term:substitution}} qui utilise des symboles au lieu de
lettres, rendu célèbre par les francs-maçons au XVIIIᵉ siècle — d'où
son autre nom, le chiffre des francs-maçons. Sa disposition est bien
connue : il protège d'un coup d'œil, pas d'un amateur d'énigmes.

## Utiliser l'outil

- Tapez votre message dans {{control:message-input}}. Chaque lettre
  apparaît sous forme de glyphe dans la bande sous les réglages ; la
  casse n'a pas d'importance.
- Choisissez un jeu de symboles avec {{control:variant-selector}} :
  maçonnique (par défaut), rosicrucien ou templier. Ils codent la même
  idée avec des cases et des points différents. Le jeu templier n'a pas
  de J.
- Les espaces, les chiffres et la ponctuation ne sont pas dessinés :
  ils passent tels quels.
- {{control:output}} contient une légende texte de la variante
  (A→┘, B→⊔ …), car les glyphes ne survivent pas au copier-coller.
- Appuyez sur {{control:swap}} pour déchiffrer : {{control:glyph-keyboard}}
  apparaît, et chaque symbole cliqué ajoute sa lettre au message. Vous
  pouvez aussi taper les lettres directement.

## Un exemple rapide

`SOS` en jeu maçonnique devient trois glyphes : S, sur la croix sans
point, est un V ; O, dans la grille pointée, est une case ouverte avec
un point à l'intérieur.

{{example:pigpen-basic}}

## Pour aller plus loin

- [Le fonctionnement du chiffre Pigpen](/encoder/pigpen/learn) : les
  grilles, les croix et les points
- [L'histoire du Pigpen](/encoder/pigpen/history), d'Agrippa aux
  tombes maçonniques
- [Exercices pratiques sur le chiffre Pigpen](/encoder/pigpen/practice)
