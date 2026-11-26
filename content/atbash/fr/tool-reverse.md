# Déchiffrer le chiffre Atbash

Pour déchiffrer Atbash, aucune clé n'est nécessaire : il suffit de
connaître l'alphabet que l'expéditeur a renversé. Le déchiffrement
renverse le texte une seconde fois : Z redevient A, Y redevient B. Le
seul réglage qui peut tromper, c'est l'alphabet. Avec le mauvais, les
lettres tombent au mauvais endroit.

## Utiliser l'outil de déchiffrement

- Collez le texte chiffré dans {{control:message-input}} ; le texte
  clair s'affiche dans {{control:output}}.
- Choisissez l'alphabet de l'expéditeur dans
  {{control:alphabet-selector}}. L'alphabet français est ici un simple
  A–Z : il déchiffre exactement comme le latin.
- Côté déchiffrement, il n'y a pas de cases pour les espaces et la
  casse. Les espaces et les majuscules restent toujours ; les chiffres,
  la ponctuation et les lettres hors de l'alphabet sont supprimés.
- {{control:swap}} passe au chiffrement, qui est le même miroir. Seul
  l'intitulé change.

## Un exemple rapide

`IVEVIHVNV` donne `REVERSEME`. I, 9ᵉ lettre, tombe sur R, 9ᵉ en
partant de la fin ; V tombe sur E. Écrit avec espaces et majuscules,
`Ivevihv nv!` donne `Reverse me`, sans le point d'exclamation.

Le mauvais alphabet montre l'importance du réglage. Avec l'alphabet
allemand, qui compte 30 lettres, `IVEVIHVNV` donne `QCUCQRCMC`. Avec
l'alphabet russe ou ukrainien, le résultat est vide : aucune lettre
latine ne passe.

## Pas sûr que ce soit de l'Atbash ?

- [Le fonctionnement du chiffre Atbash et pourquoi il tombe aussitôt](/encoder/atbash/learn),
  avec la table miroir complète
- [Identifier un chiffre inconnu](/identify) si le miroir ne donne
  rien ; l'outil teste Atbash, les décalages de César et d'autres
  chiffres
- [L'histoire d'Atbash](/encoder/atbash/history), du Livre de Jérémie
  aux livres d'énigmes
- [Exercices de déchiffrement sur Atbash](/encoder/atbash/practice)
