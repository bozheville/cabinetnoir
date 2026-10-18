# Comment fonctionne le chiffre Pigpen

## L'idée en une phrase

Pigpen est une {{term:substitution}} où les symboles de remplacement ne
sont pas des lettres : chaque lettre devient un petit dessin — un
fragment de grille, avec ou sans point — le célèbre « chiffre des
francs-maçons ».

## La recette

1. Dessinez trois formes : deux grilles de morpion (#) et deux croix
   diagonales (X).
2. Remplissez la première grille avec A–I, la seconde avec J–R, puis
   placez S–V et W–Z sur les bras des deux croix.
3. Les points sont la seconde moitié du secret : la seconde grille et
   la seconde croix portent un point dans chaque case. Sans le point,
   la même forme signifie A ; avec le point, J.
4. Pour chiffrer, remplacez chaque lettre par le dessin de la case où
   elle habite. Pour déchiffrer, lisez chaque glyphe et notez la lettre
   dont la case a cette forme.

## Un exemple guidé

{{example:pigpen-basic}}

Chaque ligne associe la lettre au dessin qu'elle devient. S, la
première lettre, habite la croix non pointée : son glyphe est un
V — les deux traits de la croix qui bornent le bras du haut. O, la
quinzième lettre, habite la grille pointée : une forme de coin comme
A, mais avec un point à l'intérieur.

## Pourquoi ces formes

Rien à mémoriser : chaque glyphe se *déduit*. La clé ci-dessous est
tout le secret — deux grilles, deux croix — et chaque glyphe n'est
rien d'autre que les murs d'une case de ces figures, découpés et
emportés seuls :

{{glyphkey:pigpen}}

Le point est la seule marque ajoutée, et il dit une seule chose :
*seconde série* — la grille pointée porte J–R, la croix pointée W–Z.
Prenons **H** : il habite la case du milieu en bas de la première
grille, donc son glyphe est le mur de cette case — un plafond et deux
murs latéraux, ouvert en bas.

{{glyphkey:pigpen-h}}

Une case au centre est un carré complet, une case dans un coin est un
L, une case au bord est ouverte d'un côté. C'est pourquoi le chiffre
s'apprend si facilement à la main — et, comme la page « Le déjouer »
l'explique, pourquoi il se déjoue aussi si facilement.

{{try:pigpen-basic}}
