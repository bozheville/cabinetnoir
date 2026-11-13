# Le chiffre de Vigenère en bref

Le chiffre de Vigenère chiffre chaque lettre avec un décalage de [César](/encoder/caesar/learn)
différent, pris tour à tour dans les lettres d'un mot-clé. C'est donc
un chiffre {{term:polyalphabetic}} : une même lettre du clair peut
donner plusieurs lettres différentes dans le chiffré. Pendant trois
siècles, on l'a surnommé « le chiffre indéchiffrable ».

## Utiliser l'outil

- Tapez ou collez votre texte dans {{control:message-input}} ; le
  résultat s'affiche dans {{control:output}}.
- Saisissez un mot-clé dans {{control:key}}. Chaque lettre de la clé
  donne un décalage : A = 0, B = 1, etc. La clé se répète sur tout le
  message. Une clé longue et absente du dictionnaire résiste mieux.
- Réglez l'alphabet du chiffre dans {{control:alphabet}}. Laissez
  A–Z, ou tapez votre propre ordre pour une variante à alphabet
  désordonné.
- Seules les lettres de cet alphabet sont chiffrées. Les espaces, les
  chiffres et la ponctuation sont supprimés, et le résultat est en
  majuscules.
- Passez au déchiffrement avec {{control:swap}} et la même clé.

## Un exemple rapide

`ATTACKATDAWN` avec la clé `LEMON` donne `LXFOPVEFRNHR`. Le premier A
rencontre L et se décale de 11 ; les deux T qui se suivent reçoivent
des décalages différents (E puis M) et deviennent X et F.

## Pour aller plus loin

- [Le fonctionnement du chiffre de Vigenère](/encoder/vigenere/learn),
  avec le tableau complet lettre par lettre
- [Casser un Vigenère sans la clé](/encoder/vigenere/cryptanalysis) :
  longueur de clé, {{term:frequency-analysis}} et reconstitution de la
  clé
- [L'histoire du chiffre de Vigenère](/encoder/vigenere/history), de
  Bellaso à Babbage et Kasiski
- [Exercices pratiques sur le chiffre de Vigenère](/encoder/vigenere/practice)
