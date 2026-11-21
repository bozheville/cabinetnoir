# Casser le chiffre VIC

Personne n'a jamais cassé le chiffre VIC par cryptanalyse. Le message
qui l'a rendu célèbre est resté illisible dans un coffre du FBI de
1953 à 1957 — dix colonnes de groupes de cinq chiffres sur un bout de
microfilm — et il ne s'est ouvert que lorsque Reino Häyhänen, l'espion
à qui il était adressé, a fait défection et a appris au FBI ses
propres clés. Cette page explique pourquoi les tentatives ont échoué,
et ce que cela coûterait aujourd'hui.

{{challenge:vic-easy-1}}

## Pourquoi le FBI et la NSA n'ont pas pu le lire

Un cryptanalyste attaque des structures : la période d'une clé qui se
répète, les comptes de colonnes d'une grille, la plage de coordonnées
d'un carré. VIC n'en offre aucune.

1. **Aucune répétition.** Le groupe-clé est neuf pour chaque message,
   et chaque ligne du programme en pousse — donc la clé entière,
   échiquier compris, est nouvelle à chaque fois. Il n'y a jamais de
   période à trouver.
2. **Aucune couche visible.** Le flux de chiffres de l'échiquier est
   statistiquement plat — lettres fréquentes et rares ne se
   distinguent plus par la fréquence des chiffres comme elles se
   distinguent par la fréquence des lettres.
3. **Des serrures composées.** Même en admettant la substitution,
   l'analyste affronte deux transpositions d'affilée, la seconde
   perturbée, dont les largeurs viennent de chiffres qu'il n'a pas.
   Chaque couche résolue laisse le message scellé ; les couches n'ont
   même pas la même longueur.
4. **Une goutte de masque jetable.** La Ligne G additionne un dérivé
   de la clé du message dans l'en-tête de l'échiquier — une
   composante petite mais véritable de clé courante, quarante ans
   après l'idée de Mauborgne.

Le verdict de Kahn dans « Number One From Moscow » : pas
théoriquement insoluble, mais effectivement inviolable sans une
connaissance préalable du système et sur la base d'un message unique.

## Comment il est réellement tombé

Pas par les mathématiques — par un homme. En 1957, Häyhänen, l'illégal
soviétique qui portait le message du nickel creux, se dégoûta, fut
rappelé à Moscou, et choisit Washington à la place. Il reconstitua le
système VIC pour le FBI de mémoire, ouvrant le message de 1953 et
démasquant son propre chef — le colonel Rudolf Abel, arrêté dans un
hôtel de Brooklyn la même année. La leçon du chiffre est la plus
ancienne du livre : le maillon le plus fort d'un système
cryptographique, ce sont ses humains.

## Ce que cela coûte aujourd'hui

La force brute a enfin une étiquette de prix, sinon une bonne
affaire. Les secrets inconnus, une fois le système connu, sont les dix
chiffres de la Ligne H (gardés par la phrase et la date — dans le
pire cas, environ 10^34 permutations de la ligne elle-même) plus le
numéro personnel des largeurs de tableaux — avec un ordinateur
moderne, un attaquant déterminé peut fouiller l'espace plausible des
phrases et dates d'une correspondance *connue* en quelques heures à
quelques semaines. Mais cela suppose le système connu, le message
identifié et les secrets devinables — trois choses qui ont toutes
échoué en 1953. Comme chiffre manuel entre deux gens prudents, VIC
reste inviolable en pratique.

## Pourquoi il n'y a pas d'outil de cassage ici

Chaque outil de cassage de ce site exploite une faiblesse structurelle
— une période, une grille, une contrainte. Le but de conception de VIC
était de n'en avoir aucune, et il a réussi : un assistant n'aurait
rien à mesurer. L'outil vous donne l'autre côté de l'histoire — le
panneau des calculs de clé, où vous regardez le système faire
exactement ce que le FBI n'a pas pu défaire.

## Le verdict

VIC a fermé l'ère du papier-crayon à son point culminant : une
sécurité née de la platitude informationnelle et de la discipline
opérationnelle plutôt que de la difficulté de calcul. On ne l'a jamais
cassé ; il a été livré.
