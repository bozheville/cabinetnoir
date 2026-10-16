# Briser le chiffre de Playfair

Playfair fut le dernier chiffre classique à garder une vraie valeur
de terrain — et le premier à tomber devant une statistique nouvelle :
non plus la fréquence des lettres mais celle des *paires*. Cette
page montre pourquoi l'idée du digraphe a retardé les vieilles
attaques, et ce qui les remplace.

{{challenge:playfair-demo}}

## La faiblesse : les paires ont aussi des habitudes

La fréquence des lettres meurt ici : un E peut se chiffrer en une
douzaine de lettres différentes selon sa partenaire. Mais les
digraphes ont leurs habitudes — TH, HE, AN, RE et ER dominent les
paires anglaises — et la structure du chiffre amplifie la fuite :
bien des paires clair donnent des paires chiffrées partageant une
lettre, et la règle du rectangle relie des paires qui ne diffèrent
que d'une lettre.

## Attaque 1 — analyse fréquentielle des digraphes

1. Rassemblez quelques centaines de paires de
   {{term:ciphertext}}.
2. Construisez une table de fréquences des digraphes et confrontez
   les géants (TH, HE, AN, RE, ON…) aux paires chiffrées les plus
   courantes.
3. Chaque correspondance confirmée épingle des lettres dans le
   carré ; chaque lettre épinglée contraint les lignes et colonnes
   de plusieurs autres. Le carré se reconstruit comme une grille de
   mots croisés.
4. Avec assez de texte, le carré tombe entier ; avec trop peu, les
   hypothèses se multiplient — c'est pourquoi les courts messages de
   terrain survivaient.

## Attaque 2 — quand le mot-clé fuit

Le carré ne vaut que son mot-clé, et les mots-clés du terrain sont
choisis par des humains : noms d'unités, noms de lieux, mot de code
de la semaine. Devant un {{term:crib}} ou une hypothèse, construisez
le carré candidat et déchiffrez une ligne — le sens confirme la clé
instantanément. Les défis de pratique fonctionnent exactement ainsi.

## Pourquoi pas de casseur dans l'outil (encore)

Un casseur par fréquence de digraphes demande un solveur de niveau
corpus, pas une boucle de recherche de clé : l'espace des carrés
(25 !) écrase toute balayage à la César, mais la propagation des
contraintes est le vrai sujet. L'outil laisse donc le cassage de
Playfair en exercice — la démonstration ci-dessus montre la
mécanique d'un crib connu, et les guides montrent où les statistiques
viendraient s'attacher.

## Le verdict historique

Playfair a tenu le terrain de 1854 jusqu'à ce que la radio rende le
volume fatal : le gros du trafic sans fil a nourri les tables de
digraphes, et à la fin de la Première Guerre mondiale le chiffre
était transparent pour les opposants sérieux. Son héritage, c'est le
digraphe lui-même — l'idée que grouper les lettres avant de les
substituer multiplie le travail de l'analyste. Tous les designs
ultérieurs — deux carrés, quatre carrés, et même les rotors — en
héritent.
