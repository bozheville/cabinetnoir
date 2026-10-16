# Fonctionnement du chiffre affine

## L'idée en une phrase

Le chiffre affine est une {{term:substitution}} pilotée par une droite
: chaque lettre est d'abord étirée par un multiplicateur puis
décalée, le tout dans l'{{term:modular-arithmetic}} — l'arithmétique
du rebroussement à 26.

## La recette

1. Choisissez la clé : un multiplicateur `a` et un décalage `b`.
2. Le multiplicateur doit être premier avec la longueur de l'alphabet
   : pour les 26 lettres, cela laisse douze valeurs (1, 3, 5, 7, 9,
   11, 15, 17, 19, 21, 23, 25). Tout facteur commun avec 26
   écraserait plusieurs lettres sur une seule, et l'outil refuse de
   construire cet alphabet.
3. Numérotez les lettres à partir de 0 (A = 0). Chiffrez la lettre
   numéro `x` en la lettre numéro `(a·x + b) mod 26`.
4. Lisez la nouvelle lettre dans l'alphabet.

## Un exemple détaillé

{{example:affine-basic}}

Avec un multiplicateur de 3 et un décalage de 7, **S** (lettre 18)
atterrit sur (3·18 + 7) mod 26 = 9 — **J**. **E** (lettre 4) atterrit
sur 19 — **T**. La colonne centrale est le cœur sincère du chiffre :
une multiplication et une addition, avec rebroussement à 26.

## La formule

```
chiffrer : y = (a·x + b) mod 26
déchiffrer : x = a⁻¹·(y − b) mod 26
```

Le déchiffrement demande l'inverse du multiplicateur — le nombre qui,
multiplié par `a`, donne 1 mod 26. Pour `a` = 3 l'inverse est 9, car
3·9 = 27 ≡ 1 (mod 26). Seuls les multiplicateurs premiers avec 26 ont
un inverse — d'où l'espace de clés de 12 × 26 = 312 clés.

## Pourquoi deux nombres valent mieux qu'un

Un pur décalage (César, `a` = 1) glisse l'alphabet mais préserve les
écarts entre lettres : le motif A-B-C reste visible sous tout
décalage. Le multiplicateur redistribue les espacements — B n'est plus
« un pas après A ». Chaque écart change avec la multiplication, et
l'{{term:frequency-analysis}} qui abat César demande ici plus de
travail.

{{try:affine-basic}}
