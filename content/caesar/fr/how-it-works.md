# Fonctionnement du chiffre de César

## L'idée en une phrase

César décale chaque lettre du {{term:plaintext}} de la même quantité
fixe — le {{term:shift}} — de sorte que tout l'{{term:alphabet}}
glisse latéralement d'un coup. C'est un chiffre par
{{term:substitution}} à alphabet unique : chaque A devient, disons, D,
chaque B devient E, et ainsi de suite pour tout le message.

## La recette

1. Écrivez votre message et ne gardez que les lettres (l'outil supprime
   les espaces et la ponctuation, sauf si vous demandez le contraire).
2. Choisissez le décalage : un nombre entre 1 et 25. Jules César
   utilisait 3.
3. Faites avancer chaque lettre dans l'{{term:alphabet}} d'autant de
   positions, en rebouclant à la fin : après Z vient A.
4. Lisez les lettres d'arrivée — c'est le texte chiffré.

## Un exemple détaillé

{{example:caesar-basic}}

Avec un décalage de 3, la lettre **A** du texte clair arrive sur **D**,
**B** sur **E**, et la fin de l'alphabet reboucle : **X**, **Y** et
**Z** donnent **A**, **B** et **C**. Un seul décalage pour tout le
message : voilà ce qui rend César si pratique — et si facile à casser.

## La formule

En numérotant A=0 … Z=25, le chiffrement ajoute le décalage et reboucle
sur l'alphabet :

```
chiffré = (clair + décalage) mod 26
clair   = (chiffré - décalage + 26) mod 26
```

Le déchiffrement est le même mouvement à l'envers : on soustrait le
décalage au lieu de l'ajouter. Le bouton d'échange de l'outil fait
exactement cela — il fait passer le texte chiffré par la seconde
formule au lieu de la première.

## Un alphabet ou un autre

L'outil utilise par défaut l'alphabet anglais, mais le chiffre
fonctionne avec tout ensemble ordonné de lettres : choisissez un
préréglage ou collez le vôtre dans le champ Alphabet. Le calcul reste
le même ; seule change la longueur de l'alphabet (la formule reboucle
alors sur cette longueur au lieu de 26).

{{try:caesar-basic}}
