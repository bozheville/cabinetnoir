# Déchiffrer le chiffre d'Alberti

Pour déchiffrer un message d'Alberti, il faut les trois réglages de
l'expéditeur : la période, l'incrément et la position de départ du
disque. L'outil cherche chaque minuscule sur le disque intérieur et
écrit la lettre placée au-dessus, en tournant le disque exactement
comme l'expéditeur. Avec un seul mauvais réglage, le message tourne au
charabia au plus tard à la première rotation.

## Utiliser l'outil de déchiffrement

- Collez le texte chiffré dans {{control:message-input}} ; le texte
  clair s'affiche dans {{control:output}}.
- Placez le disque intérieur comme l'expéditeur, avec
  {{control:rotate-left}} et {{control:rotate-right}}. Au départ, le
  `m` est sous le `A`.
- Réglez {{control:increment}} et {{control:period}} sur les valeurs
  de l'expéditeur. Par défaut, ce sont 3 et 2.
- Collez le texte chiffré tel que vous l'avez reçu. Les espaces et la
  casse sont gardés, et chaque caractère en trop compte dans la
  période. Une seule espace parasite décale toutes les rotations
  suivantes.
- Pour chiffrer une réponse, revenez en arrière avec {{control:swap}}.

## Un exemple rapide

`rfdugs&xft` avec une période de 2 et un incrément de 3 donne
`secretnote`. Le `&` est une case ordinaire du disque intérieur : ici,
il vaut N.

Chaque mauvais réglage laisse sa trace. Avec un incrément de 2, on
obtient `sedsgxqr1l` : les deux premières lettres sont justes, car le
disque n'a pas encore tourné. Une période de 3 donne `sefrizqr3i`. Un
seul clic sur {{control:rotate-right}} fausse tout dès le début :
`rdbqdsmnsd`.

## Pas de clé ?

- [Casser un chiffre d'Alberti sans la clé](/encoder/alberti/cryptanalysis) :
  deviner la période, puis résoudre chaque tranche par
  {{term:frequency-analysis}}
- [Le fonctionnement du chiffre d'Alberti](/encoder/alberti/learn),
  rotation par rotation
- [L'histoire du chiffre d'Alberti](/encoder/alberti/history), de la
  Renaissance aux machines à chiffrer
- [Exercices de déchiffrement sur le chiffre d'Alberti](/encoder/alberti/practice)
