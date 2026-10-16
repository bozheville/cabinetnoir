# Briser la machine Enigma

La machine Enigma elle-même n'a jamais été « brisée » comme tombent
César ou Vigenère — ses mathématiques, message par message, dépassaient
l'arithmétique manuelle de quiconque. Ce qui a brisé, c'est le
**système autour d'elle** : les habitudes, les procédures, les cribs.
Cette page raconte cette histoire, car c'est la plus grande leçon de
cryptanalyse de toutes.

{{challenge:enigma-demo}}

## La faiblesse : une machine solide entre des mains qui fuient

Trois cadeaux procéduraux ont coulé Enigma :

1. **La clé de message doublée.** Les opérateurs chiffraient la clé à
   trois lettres de chaque message deux fois en tête de chaque
   transmission — six lettres dont les *première et quatrième,
   deuxième et cinquième, troisième et sixième* portaient des
   relations garanties. Marian Rejewski a exploité exactement cette
   structure pour reconstruire les rotors mathématiquement en 1932 —
   sans jamais toucher une machine.
2. **Le {{term:crib}}.** Les formules routinières — bulletins
   météo (`WETTER…`), salutations, en-têtes `ANX`, formulations
   prévisibles — offraient à Bletchley un tronçon de texte clair
   probable pour presque tout le trafic de la journée.
3. **Des clés choisies par des humains.** Les règles « pas de
   lettres consécutives » interdisant AAA et QWE rendaient les clés
   des opérateurs *plus faibles*, et des clés paresseuses (trois
   rangées du clavier) apparaissaient quand même.

## La bombe : des machines à contradictions, pas une recherche de clé

La **bombe** britannique (dessinée par Alan Turing, améliorée de
manière décisive par Gordon Welchley après la `bomba` polonaise) ne
cherchait pas de clés. Devant un crib, elle cherchait des réglages de
rotors *impossibles* :

- Un crib comme `WETTER` dit : la lettre claire W devient la lettre
  chiffrée X en position 1, E→Y en position 2, etc.
- Pour chaque réglage candidat, la bombe testait si cette
  correspondance était cohérente avec le câblage de la machine — de
  nombreux cribs produisent des **boucles** (chaînes d'énoncés de
  paires de lettres qui reviennent sur elles-mêmes), et une boucle
  rend toute une classe de réglages logiquement contradictoire.
- Chaque contradiction éliminait des milliers de réglages d'un coup ;
  les quelques survivants étaient testés sur une vraie machine pour
  y chercher un allemand intelligible.

C'est de la logique de contraintes, pas de la force brute —
l'ancêtre des stratégies de résolution utilisées aujourd'hui dans
toute l'informatique.

## Pourquoi pas de casseur dans cet outil

Une simulation de bombe demande un crib, un moteur de contradictions
et une recherche sur ordres des rotors, anneaux et tableaux de
connexions — un projet à part entière, bien au-delà des casseurs à
recherche de clé de ce site. La démonstration ci-dessus procède
comme l'adversaire d'un vrai opérateur radio : avec une clé capturée
ou devinée, le déchiffrement tient en un collage ; la partie *dure* a
toujours été d'obtenir cette clé, et cette partie-là vit dans
l'histoire, pas dans cet outil.

## Le verdict

L'historien Harry Hinsley a estimé que le renseignement Enigma
(Ultra) a raccourci la Seconde Guerre mondiale de **deux à quatre
ans**. Aucune autre défaite de chiffre n'a une revendication
comparable. La machine qui a perdu n'était pas faible — la procédure
autour d'elle l'était, et cette distinction est la leçon la plus
profonde de ce site : la cryptographie est un système, et les
systèmes cassent à leur plus faible habitude.

## Pour aller plus loin

- Comparez avec la page Vigenère : Vigenère est tombé devant les
  statistiques ; l'Enigma est tombée devant les procédures. Les deux
  attaques visent le *système*.
- La `bomba` polonaise et la bombe britannique sont deux machines
  différentes sous un même nom et avec une même ancêtre — la page
  d'histoire les démêle.
