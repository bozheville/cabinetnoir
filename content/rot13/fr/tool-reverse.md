# Décoder ROT13

Pour décoder ROT13, il ne faut rien de plus : la clé est dans le nom.
Chaque lettre avance de 13 rangs, et comme l'alphabet compte 26
lettres, le même pas qui a masqué le texte le fait réapparaître. Si le
résultat reste illisible, le texte n'était tout simplement pas en
ROT13.

## Utiliser l'outil de décodage

- Collez le texte en ROT13 dans {{control:message-input}} ; le texte
  décodé s'affiche dans {{control:output}}.
- Il n'y a rien à régler. Le décalage vaut toujours 13 et l'alphabet
  est toujours A–Z.
- Les espaces et les majuscules restent à leur place. Les chiffres, la
  ponctuation et les lettres hors A–Z, comme é ou le cyrillique, sont
  supprimés.
- {{control:swap}} ne change que l'intitulé. Décoder et encoder
  donnent le même résultat : les deux pages font l'affaire.

## Un exemple rapide

`URYYBJBEYQ` donne `HELLOWORLD`. U avance de 13 rangs jusqu'à H, R
jusqu'à E, et le double Y devient le double L. Avec espaces et
majuscules, `Uryyb, jbeyq!` donne `Hello world` : la virgule et le
point d'exclamation ont disparu.

Le texte d'un autre chiffre reste illisible. Le texte chiffré César
`PHHWDWQRRQ`, décalé de 3, devient `CUUJQJDEED`. Dans ce cas, le
décalage n'était pas 13.

## Pas sûr que ce soit du ROT13 ?

- [Le fonctionnement de ROT13 et pourquoi il n'y a rien à casser](/encoder/rot13/learn) :
  aucune clé à trouver, seulement le même pas à refaire
- [Identifier un chiffre inconnu](/identify) si ROT13 ne donne rien ;
  l'outil teste aussi les autres décalages de César
- [L'histoire de ROT13](/encoder/rot13/history), des spoilers d'Usenet
  aux énigmes de géocaching
- [Exercices de décodage sur ROT13](/encoder/rot13/practice)
