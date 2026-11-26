# Déchiffrer un message Enigma

Pour déchiffrer un message Enigma, on règle la machine exactement
comme l'expéditeur et on tape le texte chiffré. Enigma est
réciproque : si A devient B à une position donnée, B y devient A. Les
mêmes réglages ramènent donc le texte chiffré au texte clair. Dans cet
outil, vous ne choisissez que la position de départ en trois lettres,
et toute autre position donne du charabia.

## Utiliser l'outil de déchiffrement

- Collez le texte chiffré dans {{control:message-input}} ; le texte
  clair s'affiche dans {{control:output}}.
- Saisissez la position de départ de l'expéditeur dans
  {{control:key}}, par exemple `AAA`. Il faut exactement trois
  lettres.
- Le reste de la machine est figé : rotors I, II et III, réflecteur B,
  pas de tableau de connexions. Un vrai message exigeait aussi l'ordre
  des rotors, les réglages des anneaux et les fiches de l'expéditeur.
- Les espaces, les chiffres et la ponctuation sont supprimés. Le texte
  clair sort d'un seul bloc en majuscules : à vous de remettre les
  espaces entre les mots.
- Chiffrer et déchiffrer sont ici la même chose : {{control:swap}} ne
  change que l'intitulé.

## Un exemple rapide

`BDZGO` avec la position de départ `AAA` donne `AAAAA`. Chaque lettre
redevient A, car les rotors repassent par les cinq mêmes positions que
chez l'expéditeur.

Une mauvaise position de départ donne aussitôt du charabia. `AAB`
donne `JJJFK` : décaler le rotor de droite d'un seul cran change
toutes les lettres.

## Pas de clé ?

Cet outil n'a pas de casseur pour Enigma. La machine n'était pas le
point faible : ce sont les procédures autour d'elle qui ont cédé. Les
clés de message doublées, les formules routinières ({{term:crib}}) et
les clés paresseuses ont ouvert la voie aux Polonais puis aux
Britanniques.

- [Briser la machine Enigma](/encoder/enigma/learn#breaking-it) : la
  clé doublée, les mots probables et la bombe
- [Le fonctionnement de la machine Enigma](/encoder/enigma/learn) :
  rotors, avance et réflecteur
- [L'histoire d'Enigma](/encoder/enigma/history), de Scherbius à la
  bomba polonaise et à Bletchley Park
- [Exercices de déchiffrement sur Enigma](/encoder/enigma/practice)
- [Identifier un chiffre inconnu](/identify), si vous n'êtes pas sûr
  qu'il s'agisse d'Enigma
