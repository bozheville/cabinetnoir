# Le chiffre Rail fence en bref

Le chiffre Rail fence (« clôture ») écrit le message en
{{term:zigzag}} sur plusieurs lignes — les rampes — puis lit les rampes
l'une après l'autre, de haut en bas. Aucune lettre ne change, seul leur
ordre : c'est un chiffre par {{term:transposition}}. Les soldats de la
guerre de Sécession s'en servaient pour chiffrer vite au crayon, et
l'ennemi le cassait tout aussi vite.

## Utiliser l'outil

- Tapez ou collez votre texte dans {{control:message-input}} ; le
  résultat s'affiche dans {{control:output}}.
- Choisissez le nombre de rampes, de 2 à 10, avec
  {{control:rails-picker}}. La valeur par défaut est 3.
- Fixez la rampe de départ du zigzag avec {{control:offset-picker}}. La
  clôture classique part du haut ; tout autre départ masque la
  première lettre révélatrice.
- Sous les réglages, {{control:zigzag-fence}} dessine les lettres sur
  leurs rampes au fil de la frappe.
- Seules les lettres sont gardées et le résultat est en majuscules.
  Cochez {{control:keep-spaces}} pour faire passer aussi les espaces ;
  les chiffres et la ponctuation sont supprimés.
- Appuyez sur {{control:swap}} pour déchiffrer avec les mêmes rampes et
  le même départ.

## Un exemple rapide

`ATTACKATDAWN` sur 3 rampes donne `ACDTAKTANTAW`. La rampe du haut
porte A, C, D ; celle du milieu T, A, K, T, A, N ; celle du bas T, A,
W. On les lit l'une après l'autre : `ACD` + `TAKTAN` + `TAW`.

## Pour aller plus loin

Avec seulement quelques nombres de rampes et de départs possibles, tout
Rail fence tombe quand on les essaie tous.

- [Le fonctionnement du chiffre Rail fence](/encoder/railFence/learn),
  rampe par rampe
- [Casser un Rail fence sans la clé](/encoder/railFence/cryptanalysis)
- [L'histoire du chiffre Rail fence](/encoder/railFence/history), de la
  scytale à la guerre de Sécession
- [Exercices pratiques sur le Rail fence](/encoder/railFence/practice)
