# Le chiffre par mot-clé en bref

Le chiffre par mot-clé est une {{term:substitution}} simple dont
l'alphabet chiffré se construit à partir d'un mot : on écrit le mot-clé
sans lettres répétées, puis le reste de l'alphabet dans l'ordre. Une
lettre du clair donne toujours la même lettre chiffrée. Facile à
retenir et à transmettre, il tombe pourtant, comme tout alphabet fixe,
sous l'{{term:frequency-analysis}} — la leçon de Marie Stuart en 1586.

## Utiliser l'outil

- Tapez ou collez votre texte dans {{control:message-input}} ; le
  résultat s'affiche dans {{control:output}}.
- Saisissez le mot-clé dans {{control:keyword-input}}.
  {{control:alphabet-strip}} montre l'alphabet clair en haut et
  l'alphabet chiffré en dessous.
- Cochez {{control:continuation-toggle}} pour poursuivre l'alphabet
  après la dernière lettre du mot-clé plutôt qu'à partir de A.
- Cochez {{control:free-alphabet-toggle}} pour saisir directement un
  alphabet de 26 lettres ; l'outil vérifie que chaque lettre n'y figure
  qu'une fois.
- Cochez {{control:keep-spaces}} ou {{control:keep-case}} pour
  préserver les espaces et les majuscules. Les chiffres et la
  ponctuation sont supprimés.
- Appuyez sur {{control:swap}} pour déchiffrer avec le même mot-clé.

## Un exemple rapide

Avec le mot-clé `KRYPTOS`, l'alphabet chiffré commence par
`KRYPTOSABCDEF…`, donc `ATTACKATDAWN` devient `KNNKYDKNPKVG`. Chaque A
devient K et chaque T devient N — exactement la répétition que compte
un cryptanalyste.

## Pour aller plus loin

- [Le fonctionnement du chiffre par mot-clé](/encoder/keyword/learn),
  avec les deux bandes d'alphabet
- [Casser un chiffre par mot-clé sans la clé](/encoder/keyword/cryptanalysis)
  par analyse fréquentielle
- [L'histoire du chiffre par mot-clé](/encoder/keyword/history), des
  manuels de chiffre au complot de Babington
- [Exercices pratiques sur le chiffre par mot-clé](/encoder/keyword/practice)
