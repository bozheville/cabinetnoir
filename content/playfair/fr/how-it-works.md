# Fonctionnement du chiffre de Playfair

## L'idée en une phrase

Playfair est le premier chiffre de {{term:digraph}} pratique : les
lettres cessent de voyager seules et avancent par paires sur un
carré de 5×5, si bien qu'une seule lettre du texte clair ne
détermine plus une seule lettre chiffrée.

## La recette

1. Écrivez le mot-clé (sans doublons), puis le reste de l'alphabet —
   sans J, fondu dans I — dessous, et découpez en carré 5×5.
2. Coupez le message en paires ({{term:digraph}}). Une lettre doublée
   à l'intérieur d'une paire reçoit un X serré entre les jumelles ;
   une queue impaire reçoit un X au bout.
3. Pour chaque paire, trouvez les deux lettres dans le carré et
   appliquez la première règle qui s'ajuste :
   - même ligne → chaque lettre prend sa voisine de droite (en
     bouclant) ;
   - même colonne → chaque lettre prend celle du dessous ;
   - sinon → chaque lettre prend le coin du rectangle situé dans sa
     propre ligne et dans la colonne de sa partenaire.
4. Écrivez le résultat par paires.

## Un exemple détaillé

{{example:playfair-basic}}

Le carré construit sur PLAYFAIREXAMPLE commence par
`PLAYF / AIREX / AMPLE …`. **HI** n'a ni ligne ni colonne commune :
chaque lettre saute au coin opposé du rectangle — **CX**. **EG**
partage une colonne : les deux lettres descendent — **LQ**.
Notez le changement profond par rapport aux chiffres plus anciens :
la même lettre se chiffre différemment selon sa partenaire.

## La formule

Pas de formule au sens affine — la clé est une table entière.
Mathématiquement, c'est une substitution sur les 336 paires
possibles (25 lettres, moins les doubles impossibles), pilotée par
les règles de ligne, de colonne et de rectangle qui déplacent les
paires *à l'intérieur* du carré sans jamais mélanger lignes et
colonnes.

## Déchiffrement et ses plis

Le déchiffrement fait marcher chaque règle à rebours : à gauche au
lieu de droite, au-dessus au lieu de dessous, les coins restent des
coins. Deux artefacts voyagent avec le système : un I du texte clair
apparaît toujours là où un J était écrit, et chaque X est ambigu —
vrai X ou bourrage. Deux coûts acceptés sur le terrain : les
clercs du télégraphe apprenaient le carré en un après-midi sans
jamais toucher une table de 26 fréquences.

{{try:playfair-basic}}
