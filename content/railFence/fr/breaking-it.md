# Casser le rail fence

Rail fence est une {{term:transposition}} à clé de deux nombres : le
nombre de rampes et le décalage. Rien à analyser lentement — toute
l'attaque consiste à *essayer des réglages*, et l'assistant de l'onglet
Cryptoanalyse la réduit à un seul curseur.

{{challenge:railFence-demo}}

## La faiblesse : un espace de clés qu'on tient dans sa tête

Dix rampes au plus et quelques décalages : quelques dizaines de
réglages en tout, chacun testable d'un coup d'œil. Aucun cours de
statistiques requis — la seule question est de savoir quel réglage
fait se lire les lignes. C'est pourquoi rail fence est la rampe
d'accès au décryptage des transpositions : l'expérience de *glisser
jusqu'à ce que ça se lise* est la même compétence que demande le
déchiffreur Columnar, sans la partie difficile.

## L'assistant, étape par étape

1. **Glissez.** Bougez le curseur du nombre de rampes et celui du
   décalage. La clôture se redessine à chaque cran et le texte clair
   candidat se met à jour en direct — les mauvais réglages montrent des
   lignes brouillées, le bon montre des mots.
2. **Surveillez le compteur.** Chaque réglage est noté d'après la
   ressemblance de son texte avec l'anglais — le cousin digramme de la
   {{term:frequency-analysis}} : TH, HE et IN marquent haut, les paires
   absurdes ne marquent rien. Le compteur est un mètre-ruban, pas un
   oracle : sur les textes très courts un mauvais réglage peut
   dépasser le bon, et votre œil reste le juge final.
3. **Terminé.** « Utiliser ce résultat » emporte rampes et décalage
   vers l'onglet Outil, qui déchiffre le message. Le réglage est toute
   la clé.

L'outil ne glisse jamais à votre place. Le préréglage Facile marque
où le compteur culmine — un pointeur, pas un clic — car la recherche
est la leçon.

## Où ça s'arrête

Plus de rampes rendent l'image plus brouillée, pas le chiffre plus
fort : l'espace des clés grandit linéairement pendant que le test de
lecture reste instantané. La double transposition et la grille
columnar sont les étapes suivantes — elles cassent toutes deux le
raccourci « tout essayer », et elles attendent dans les chapitres
suivants de cette échelle.
