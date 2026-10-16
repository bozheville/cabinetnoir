# Fonctionnement du chiffre d'Alberti

## L'idée en une phrase

Le disque de chiffrement d'Alberti est le premier chiffre
{{term:polyalphabetic}} : deux disques concentriques portent deux
{{term:alphabet}}s différents, et le disque intérieur tourne après
quelques lettres, si bien que la {{term:substitution}} change pendant
que vous écrivez — une même lettre du {{term:plaintext}} devient
différentes lettres du {{term:ciphertext}}.

## La recette

1. Écrivez votre message et ne gardez que les lettres portées par le
   disque — l'anneau d'Alberti compte 20 lettres latines (pas de H, J,
   K, U, W, Y) plus les chiffres 1–4. L'outil supprime le reste.
2. Réglez la {{term:period}} : combien de lettres sont chiffrées avant
   que le disque ne tourne.
3. Réglez l'incrément : de combien de positions le disque intérieur
   saute à chaque tour.
4. Pour chaque groupe de lettres de la période, lisez la lettre
   chiffrée située en face sur le disque intérieur. Puis tournez le
   disque intérieur de l'incrément et continuez avec le groupe suivant.

## Un exemple détaillé

{{example:alberti-basic}}

La colonne du disque montre l'alignement en vigueur : il commence avec
le **A** extérieur sur le **m** intérieur, si bien que **S** devient
**r** et **E** devient **f**. Après le groupe de deux lettres, le
disque saute de trois positions — **A** se retrouve sur **h**, et
**C** devient **d**. Chaque nouvel alignement donne à l'alphabet un
nouveau mélange : l'idée polyalphabétique en miniature.

## La formule

Chaque groupe est une substitution, et la substitution change d'un
groupe à l'autre. En comptant les positions sur les disques :

```
chiffré = cible[indice du clair]          # au sein d'un groupe
cible   = rotation(cible, incrément)      # après chaque groupe
```

Le déchiffrement raconte la même histoire à l'envers : lisez chaque
groupe avec l'alignement courant, et tournez le disque de l'incrément
après chaque groupe. Comme le destinataire a besoin de la période, de
l'incrément *et* de l'alignement de départ, le secret partagé a trois
composantes.

## Les disques de l'outil

L'outil reproduit exactement les anneaux d'Alberti : le disque
extérieur fixe (Stabilis) porte l'alphabet latin majuscule
**ABCDEFGILMNOPQRSTVXZ** plus les chiffres **1234**, qu'Alberti
utilisait pour un second code numérique. Le disque intérieur mobile
(Mobilis) porte un alphabet minuscule mélangé
**mqihfdbacegklnprtuz&xyso** — le mélange est le brassage
supplémentaire propre à Alberti. Les flèches tournent le disque
intérieur à la main si vous voulez partir d'un autre alignement que
celui par défaut.

{{try:alberti-basic}}
