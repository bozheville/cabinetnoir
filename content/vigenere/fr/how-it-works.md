# Fonctionnement du chiffre de Vigenère

## L'idée en une phrase

Le chiffre de Vigenère décale chaque lettre du {{term:plaintext}} d'une
quantité différente : la première lettre selon la première lettre de la
{{term:key}}, la seconde selon la deuxième, et ainsi de suite. Quand la
clé est épuisée, elle recommence depuis sa première lettre. C'est pourquoi
on parle de chiffre {{term:polyalphabetic}} : une même lettre du texte
clair peut devenir différentes lettres du {{term:ciphertext}}, ce qui
déjoue une simple {{term:frequency-analysis}}.

## La recette

1. Écrivez votre message et ne gardez que les lettres (l'outil supprime
   les espaces et la ponctuation de la même façon).
2. Écrivez la clé sous le message, lettre par lettre, en la répétant
   jusqu'à ce que les deux lignes aient la même longueur.
3. Décalez chaque lettre du message dans l'{{term:alphabet}} d'autant de
   positions que l'indique la lettre de clé : A vaut 0, B vaut 1, … Z
   vaut 25. Ce nombre est le {{term:shift}}.
4. Lisez les lettres d'arrivée — c'est le texte chiffré.

## Un exemple détaillé

{{example:vigenere-basic}}

Lisez la première ligne : la lettre du texte clair **A**, décalée par la
lettre de clé **L** (position 11), donne **L**. La clé `LEMON` se répète
ensuite : la deuxième lettre est décalée par **E**, la troisième par
**M**, et après la cinquième lettre la clé repart du début — cette
répétition est à la fois la force et la faiblesse du chiffre.

## La formule

En numérotant A=0 … Z=25, le chiffrement additionne les deux positions
et boucle sur l'alphabet :

```
chiffré = (clair + clé) mod 26
clair   = (chiffré - clé + 26) mod 26
```

La table des 26 alphabets de décalage possibles est la fameuse *tabula
recta* ; vous n'avez jamais besoin de la table entière — une colonne par
lettre de clé suffit.

## Un alphabet ou un autre

L'outil utilise par défaut l'alphabet anglais, mais le chiffre
fonctionne avec tout ensemble ordonné de lettres : collez le vôtre dans
le champ Alphabet — un alphabet anglais mélangé, ou une autre langue.
Le calcul reste le même ; seule la longueur de l'alphabet change (la
formule boucle alors sur cette longueur au lieu de 26).

{{try:vigenere-basic}}
