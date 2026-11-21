# À propos du chiffre VIC

Le chiffre VIC est le dernier grand chiffre manuel de l'ère du
papier-crayon : un système soviétique de la guerre froide qui portait
des messages d'espionnage en groupes de cinq chiffres, inviolé de 1953
à 1957 — et tombé alors uniquement parce que son porteur avait fait
défection. Quatre petits secrets (une phrase mémorable, une date, le
numéro personnel de l'agent et une {{term:keygroup}} fraîche de cinq
chiffres) se déploient par l'arithmétique modulo 10 en un
{{term:straddling-checkerboard}} et deux tableaux de
{{term:transposition}}. Kahn l'a appelé le plus beau chiffre
mnémonique jamais rendu public.

## Comment utiliser cet outil

- Tapez votre message dans {{control:message-input}} ; les groupes de
  cinq chiffres apparaissent dans {{control:output}}.
- Les quatre secrets vont dans leurs champs : la Phrase (au moins
  vingt lettres), la Date (jour, mois, année — p. ex. `13/9/1959`), le
  numéro personnel et le groupe-clé. Tirez un groupe-clé frais avec
  le bouton dé pour chaque message, comme le faisaient les agents.
- Activez **Montrer les calculs de clé** pour suivre tout le
  programme papier-crayon : les lignes A–S de la fiche, l'échiquier et
  les largeurs des deux tableaux, chaque ligne expliquée dans une
  infobulle.
- Le message est facultativement **bisecté** : les moitiés sont
  échangées à un index convenu avant l'encodage. Votre correspondant
  doit connaître la coupe — c'est un secret comme les autres.
  Laissez-la éteinte pour un premier essai.
- Lettres, chiffres et points voyagent ; tout le reste disparaît. Les
  chiffres voyagent dans une paire de bascule, écrits trois fois
  chacun : `0500` coûte douze chiffres plus deux codes de bascule.
- Quelques `X` finaux bourrent le message jusqu'à un multiple de cinq
  chiffres — la présentation classique en groupes de cinq. Votre
  correspondant les ignore simplement à la fin.
- Appuyez sur {{control:swap}} pour déchiffrer : collez les groupes,
  retapez les trois secrets mémorisés — le groupe-clé se lit dans le
  message lui-même.

## Un exemple rapide

`ATTACKATDAWN. BY DAWN I MEAN 0500.` avec la phrase *Twas the night
before Christmas*, la date 13/9/1959, le numéro personnel 6 et le
groupe-clé `72401` passe par l'échiquier en
`60253800005550000008087…` — puis par les deux transpositions en
groupes de cinq chiffres, avec `72401` caché parmi eux.

## Pour aller plus loin

- [Comment fonctionne le chiffre VIC](/encoder/vic/learn) — le
  programme de clés complet, ligne par ligne
- [Guides du chiffre VIC](/encoder/vic/learn#guides) — chiffrez votre
  premier message, puis déchiffrez avec les quatre secrets
- [Casser le chiffre VIC](/encoder/vic/learn#breaking-it) — pourquoi
  personne ne l'a jamais fait
- [L'histoire du chiffre VIC](/encoder/vic/history) — le nickel creux,
  le transfuge, l'arrestation dans un hôtel de Brooklyn
- [Défis d'entraînement du chiffre VIC](/encoder/vic/practice)
