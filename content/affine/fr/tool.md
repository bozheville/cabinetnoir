# Le chiffre affine en bref

Le chiffre affine transforme chaque lettre en nombre (A = 0 … Z = 25),
le multiplie par `a`, ajoute `b` et reboucle modulo 26 :
`E(x) = a·x + b`. C'est un chiffre par {{term:substitution}} qui va un
pas plus loin que César — César est le cas particulier `a = 1` — et un
premier exercice classique d'{{term:modular-arithmetic}}.

## Utiliser l'outil

- Tapez ou collez votre texte dans {{control:message-input}} ; le
  résultat s'affiche dans {{control:output}}.
- Réglez le multiplicateur `a` dans {{control:multiplier}}. Il ne doit
  avoir aucun facteur commun avec 26 : seuls 1, 3, 5, 7, 9, 11, 15,
  17, 19, 21, 23 et 25 conviennent ; toute autre valeur est ignorée et
  la dernière valeur valide reste en place.
- Réglez le décalage `b` dans {{control:shift}}, de 0 à 25.
- En mode chiffrement, les interrupteurs « Keep spaces » et « Keep
  case » préservent les espaces et les majuscules. Les chiffres et la
  ponctuation sont supprimés.
- Appuyez sur {{control:swap}} pour déchiffrer avec les deux mêmes
  nombres ; l'outil calcule l'inverse modulaire à votre place.

## Un exemple rapide

`SECRETMESSAGE` avec `a = 3` et `b = 7` donne `JTNGTMRTJJHZT`. S vaut
18, et 3 × 18 + 7 = 61, soit 9 modulo 26 : la lettre J.

## Pour aller plus loin

Il n'existe que 12 × 26 = 312 clés, et deux paires de lettres connues
suffisent pour retrouver `a` et `b` directement.

- [Le fonctionnement du chiffre affine](/encoder/affine/learn), avec le
  tableau complet lettre par lettre
- [Casser un chiffre affine sans la clé](/encoder/affine/cryptanalysis)
- [L'histoire du chiffre affine](/encoder/affine/history)
- [Exercices pratiques sur le chiffre affine](/encoder/affine/practice)
