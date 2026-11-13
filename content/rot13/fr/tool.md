# ROT13 en bref

ROT13 est un [chiffre de César](/encoder/caesar/learn) au décalage fixe de 13. Comme
l'{{term:alphabet}} latin compte 26 lettres, deux décalages de 13
ramènent chaque lettre à sa place : la même opération encode et
décode. Les groupes Usenet s'en servaient pour masquer les spoilers et
les chutes de blagues — il protège d'un coup d'œil distrait, jamais
d'un lecteur qui veut savoir.

## Utiliser l'outil

- Tapez ou collez du texte dans {{control:message-input}} ; le
  résultat s'affiche dans {{control:output}} au fil de la frappe.
- Il n'y a ni clé ni réglage : le décalage vaut toujours 13 et
  l'alphabet est toujours A–Z.
- Les espaces, la ponctuation, les chiffres et les majuscules restent
  tels quels ; seules les lettres latines changent. Les lettres
  accentuées et non latines passent sans modification.
- Appuyer sur {{control:swap}} ne change que l'intitulé : encoder et
  décoder donnent le même résultat.

## Un exemple rapide

`HELLOWORLD` devient `URYYBJBEYQ`. H avance de 13 rangs jusqu'à U, E
jusqu'à R, et repasser `URYYBJBEYQ` dans l'outil redonne
`HELLOWORLD`.

## Pour aller plus loin

ROT13 n'a qu'une seule clé : il n'offre aucune protection, quiconque
le reconnaît peut le lire. Un texte anglais plein de `gur` et de `naq`
(`the` et `and`) le trahit aussitôt.

- [Le fonctionnement de ROT13](/encoder/rot13/learn), et pourquoi 13
  est un nombre à part
- [L'histoire de ROT13](/encoder/rot13/history), d'Usenet aux énigmes
  de géocaching
- [Exercices pratiques sur ROT13](/encoder/rot13/practice)
