# Histoire de la transposition colonnaire

## Plus vieille que son nom

Réarranger des lettres selon un motif convenu est l'une des plus
anciennes idées cryptographiques — la scytale spartiate est un ruban
ligné par lignes et lu par colonnes, une transposition à tout le moins
dans les faits. La forme colonnaire, clé par un mot, paraît dans la
littérature du XVIIe siècle et s'installe dans tous les grands manuels
de chiffres au XIXe. Elle n'exige ni machine, ni tables, ni
arithmétique : une feuille de papier et un mot dont on se souvient.

## La Première Guerre mondiale : le cheval de bataille des tranchées

La guerre des tranchées a produit des montagnes de messages à chiffrer
vite, par des signaleurs épuisés. Les chiffres de substitution tombaient
sous le comptage des fréquences ; les machines n'existaient pas au
front. La transposition colonnaire — appliquée en général **deux fois**
avec deux mots-clés — est devenue le chiffre de campagne standard de
plusieurs armées, dont l'armée allemande. Les Français, qui lisaient le
trafic allemand, apprirent à attaquer la double transposition par
l'anagrammage : faire glisser des fragments de colonnes suspectés
jusqu'à ce que des phrases apparaissent. Des services entiers du
déchiffrement étaient, en pratique, des ateliers de puzzles
professionnels.

## ADFGVX, 1918 : la transposition comme second verrou

Le plus sophistiqué des chiffres de campagne allemands de la guerre,
ADFGVX, enchaînait deux idées : la fractionation (chaque lettre du
texte clair devient deux lettres de coordonnées) et une transposition
colonnaire clé sur le résultat. La transposition était là précisément
pour détruire les fréquences que les coordonnées fractionnées auraient
sinon montrées — et la percée de Georges Painvin fut de défaire
l'{{term:column-order}} d'abord, grâce au volume du trafic, avant
d'attaquer ce qui restait. Les pages ADFGVX de cette application
racontent cette histoire en entier ; la deuxième étape de son
déchiffreur est la même reconstruction de colonnes que celle-ci.

## Le SOE et les chiffres-poèmes

Pendant la Seconde Guerre mondiale, les agents du Special Operations
Executive derrière les lignes ennemies chiffraient leurs rapports avec
la double transposition — elle survivait sur du papier là où les
machines ne pouvaient pas. Leo Marks, le cryptographe du SOE, donnait
aux agents des clés inoubliables en les écrivant comme des poèmes
originaux (« The Life That I Have »), mémorisés plutôt que portés. Un
poème dans la tête, une grille sur un bout de papier : la transposition
colonnaire marchait précisément parce que sa clé vit dans la mémoire
humaine, pas dans un dispositif saisissable.

## Toujours un professeur

La transposition colonnaire n'a jamais protégé quoi que ce soit contre
un professionnel disposant de assez de trafic — et ce n'était pas son
rôle. Elle survit comme la démonstration la plus claire que *cacher
l'ordre* est un problème différent de *cacher les lettres*, et comme le
premier chapitre de toute leçon de transposition : la grille est le
chiffre, et la clé est la façon de la lire.

{{timeline:columnar}}
