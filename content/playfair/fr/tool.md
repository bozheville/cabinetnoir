# Le chiffre de Playfair en bref

Playfair chiffre les lettres deux par deux sur un carré de 5×5
construit à partir d'un mot-clé. Inventé par Charles Wheatstone en
1854, il porte le nom de Lord Playfair, qui en fit la promotion, et
servit aux forces britanniques de la guerre des Boers à la Première
Guerre mondiale. Comme il travaille sur des {{term:digraph}}s et non
sur des lettres isolées, un simple comptage des lettres ne suffit pas
à le casser.

## Utiliser l'outil

- Tapez votre message dans {{control:message-input}} ; les paires
  chiffrées s'affichent dans {{control:output}}, séparées par des
  espaces.
- Saisissez un mot-clé dans {{control:key}}. Ses lettres, sans
  doublons, remplissent d'abord le carré, puis le reste de l'alphabet
  suit. Sans mot-clé, aucun résultat.
- Seules les lettres sont chiffrées. J est fusionné avec I, le carré a
  donc 25 cases. Les espaces, les chiffres et la ponctuation sont
  supprimés.
- Une lettre doublée dans une paire est séparée par un X, et un X
  complète la dernière lettre si le message a une longueur impaire.
- Appuyez sur {{control:swap}} pour déchiffrer avec le même mot-clé ;
  les espaces entre les paires sont facultatifs. Attendez-vous à un I
  là où un J était écrit, et à des X de remplissage.

## Un exemple rapide

`HIDE THE GOLD` avec le mot-clé `PLAYFAIR EXAMPLE` donne
`BM OD ZB XD NA GE`. Les paires sont HI, DE, TH, EG, OL et D + X de
remplissage.

## Pour aller plus loin

- [Le fonctionnement du chiffre de Playfair](/encoder/playfair/learn) :
  le carré et les trois règles des paires
- [Casser un Playfair sans la clé](/encoder/playfair/cryptanalysis)
- [L'histoire du chiffre de Playfair](/encoder/playfair/history), d'un
  dîner victorien aux tranchées
- [Exercices pratiques sur le chiffre de Playfair](/encoder/playfair/practice)
