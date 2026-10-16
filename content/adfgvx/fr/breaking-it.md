# Briser le chiffre ADFGVX

ADFGVX a été conçu pour résister précisément aux deux attaques qui
avaient tué les chiffres de campagne antérieurs : l'{{term:frequency-analysis}}
(tuée par le {{term:fractionation}}) et les attaques par motifs (tuées
par la {{term:transposition}}). Il est tombé quand même — devant l'une
des cryptanalyses les plus impressionnantes de la Grande Guerre. Le
défi de démonstration ouvre le décrypteur guidé de l'outil sur un
vrai texte chiffré.

{{challenge:adfgvx-demo}}

## Pourquoi une seule attaque ne suffit pas

Avec le fractionnement seul, les lettres A D F G V X du texte chiffré
n'ont aucune fréquence utile : chaque lettre du message en clair est
étalée sur deux d'entre elles. Avec la transposition seule, les
lettres du texte chiffré sont de vraies coordonnées fractionnées, mais
mélangées — leurs fréquences sont plates elles aussi. La défense est
l'empilement, et l'attaque doit le désempiler dans le bon ordre :
d'abord défaire le mélange, puis résoudre ce qui reste.

## Attaque 1 — reconstituer les colonnes

Défaire la {{term:transposition}} revient à découvrir quels morceaux
du texte chiffré étaient des colonnes voisines de la grille. Le signe
révélateur : quand deux morceaux étaient vraiment voisins, leur
entrelacement associe chaque coordonnée de ligne à la coordonnée de
colonne de la *même* lettre en clair — les « symboles » de deux
lettres obtenus sont de vraies lettres, aux fréquences déséquilibrées
et langagières. Un test d'indépendance du khi-deux sur les paires de
coordonnées mesure précisément ce lien ; l'outil l'utilise pour
classer les longueurs de clé candidates et suggérer les colonnes qui
vont ensemble. Prenez ces suggestions pour des indices : sur des
messages courts, une mauvaise disposition peut sembler convaincante,
et le vrai test est que l'étape suivante produise du texte lisible.

## Attaque 2 — le carré comme puzzle de substitution

Une fois les colonnes à leur place, les paires de coordonnées sont les
lettres d'une {{term:substitution}} monoalphabétique ordinaire sur 25
ou 36 symboles. La vieille machinerie s'applique : les symboles les
plus fréquents sont les lettres les plus fréquentes, les
{{term:crib}} confirment les hypothèses, et chaque symbole confirmé
fiche une case du carré et contraint ses voisines de ligne et de
colonne. Le décrypteur guidé de l'outil parcourt cette étape avec un
graphique de fréquences, des suggestions de lettres et un aperçu en
direct.

## Le raccourci historique : le volume du trafic

La percée de Georges Painvin au printemps 1918 vint par la quantité :
des dizaines de messages chiffrés *avec la même clé du jour*,
comparés colonne par colonne, longueur contre longueur. Des messages
longs identiques sur la même clé s'alignèrent et trahirent l'ordre des
colonnes. Un court message isolé ne lui donnait presque rien — c'est
pourquoi la discipline radio allemande (ou son absence) décida de la
bataille plus que le chiffre.

## Le verdict de l'histoire

Le trafic déchiffré aida à arrêter l'offensive allemande du printemps
1918. Le chiffre lui-même était solide pour l'époque ; les procédures
autour ne l'étaient pas. ADFGVX reste l' exemple canonique du
fractionnement plus transposition — et de la façon dont la réutilisation
des clés terrasse même les bons chiffrements.
