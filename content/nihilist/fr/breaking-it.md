# Casser le chiffre nihiliste

Deux clés, deux faiblesses. L'assistant de l'onglet Cryptoanalysis
conduit l'attaque en quatre étapes ; cette page explique ce que chacune
écoute.

{{challenge:nihilist-demo}}

## La faille : la clé se répète, et la grille coupe

Deux faits font tout le travail. D'abord la {{term:additive-key}} se
répète, donc les sommes d'une même position de clé partagent son biais
— le flux a une {{term:key-length}} à trouver. Ensuite chaque chiffre de
coordonnée vit entre 1 et 5 : un nombre de clé candidat n'est plausible
que si sa soustraction laisse, pour *chaque* valeur de sa colonne, les
deux chiffres entre 1 et 5. Un seul chiffre faux et la valeur tombe de
la grille.

## L'assistant, étape par étape

1. **Longueur de clé.** L'outil découpe le flux de nombres à chaque
   période candidate et mesure la force du resserrement de chaque
   tranche (la version « indice de coïncidence » du flux de nombres),
   plus la fréquence des répétitions de courtes suites de nombres à
   intervalles de clé. Choisissez une carte — le score est un indice,
   pas une réponse.
2. **Épingler chaque nombre de clé.** Colonne par colonne : vous
   essayez des nombres de clé (deux chiffres, chacun 1–5) et chaque
   valeur de la colonne vote — vert quand la soustraction reste dans
   le carré, rouge sinon. En facile, les nombres qui ne peuvent
   correspondre à aucune valeur sont grisés avant l'essai ; en
   difficile, vous ne voyez que le rouge et le vert après chaque essai.
   Aucune colonne n'est jamais remplie pour vous.
3. **Reconstituer le carré.** La clé épinglée, soustrayez-la : le flux
   retombe sur des coordonnées de Polybe simples, de `11` à `55`.
   C'est une {{term:substitution}} directe — le plateau d'assignation
   partagé prend le relais : lettres par fréquence, texte partiel en
   direct, retour en arrière libre. Le carré se remplit à côté du
   plateau au fur et à mesure.
4. **Terminé.** Le carré reconstitué (et le mot-clé qu'il épelle, s'il
   est clé) plus la clé additive partent vers l'outil avec « use this
   result ».

## Pourquoi l'attaque en deux temps marche

Aucune des deux étapes n'est décisive seule, mais chacune rétrécit la
recherche de l'autre : la contrainte de plage ramène les 25 nombres de
clé possibles par colonne à une poignée, et une fois la clé partie le
chiffre n'est plus qu'un comptage de fréquences manuel. C'est le même
diviser-pour-régner que le casseur de Vigenère — trouver la période,
puis attaquer chaque tranche — avec des tranches faites de nombres au
lieu de lettres.
