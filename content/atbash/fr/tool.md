# Le chiffre Atbash en bref

Atbash renverse l'{{term:alphabet}} comme un miroir : A s'échange avec
Z, B avec Y, C avec X, et ainsi de suite jusqu'au milieu. C'est à
l'origine un chiffre de scribes hébreux — son nom même est formé des
première, dernière, deuxième et avant-dernière lettres de l'alphabet
hébreu — et on le trouve dans le Livre de Jérémie. Il n'y a pas de
clé : c'est une {{term:substitution}} fixe, et l'appliquer deux fois
redonne le texte d'origine.

## Utiliser l'outil

- Tapez ou collez votre texte dans {{control:message-input}} ; le
  texte renversé s'affiche dans {{control:output}}.
- Choisissez l'alphabet à renverser avec {{control:alphabet-selector}} :
  latin par défaut, ou allemand, français, russe ou ukrainien.
- Cochez {{control:keep-spaces}} ou {{control:keep-case}} pour
  préserver les espaces entre les mots et les majuscules. Les
  chiffres, la ponctuation et les lettres absentes de l'alphabet
  choisi sont supprimés.
- Chiffrer et déchiffrer sont la même opération ; {{control:swap}} ne
  change que l'intitulé. Pour décoder, gardez l'alphabet de
  l'expéditeur.

## Un exemple rapide

`REVERSEME` devient `IVEVIHVNV`. R, 18ᵉ lettre, tombe sur I, 9ᵉ en
partant de la fin ; E tombe sur V. Repassez `IVEVIHVNV` dans l'outil
et `REVERSEME` revient.

## Pour aller plus loin

Sans aucune clé, « casser » Atbash revient à le reconnaître : un seul
essai du miroir suffit, le sens apparaît ou c'est autre chose.

- [Le fonctionnement du chiffre Atbash](/encoder/atbash/learn), avec la
  table miroir complète
- [L'histoire d'Atbash](/encoder/atbash/history), du Livre de Jérémie
  aux livres d'énigmes
- [Exercices pratiques sur Atbash](/encoder/atbash/practice)
