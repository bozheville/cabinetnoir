## Ce qui unit la famille

Un chiffrement polygraphique remplace les lettres par groupes plutôt qu'une à une. Une paire, c'est-à-dire un {{term:digraph}}, ou un bloc plus long entre, et une paire ou un bloc sort, si bien qu'une lettre claire n'a pas de partenaire fixe dans le chiffré. Le même E devient des lettres différentes selon sa voisine.

## Comment ça marche

Le [chiffre de Playfair](/encoder/playfair/learn) écrit un carré de 5 × 5 lettres, où I et J partagent une case, et découpe le message en paires. HELLO devient HE LX LO : un X sépare le double L. Chaque paire est remplacée par les deux autres coins de son rectangle, ou par les lettres situées à droite ou en dessous quand les deux lettres partagent une ligne ou une colonne. Avec le carré sans clé, HE LX LO devient KC NV MP. Un mot-clé placé au début du carré constitue la clé.

Le chiffre de Hill, bientôt dans le cabinet, va plus loin : il multiplie des blocs de lettres par une matrice clé, si bien que chaque lettre produite dépend du bloc entier.

## Comment on le casse

Les paires cachent les fréquences des lettres isolées, mais la langue a aussi des fréquences de paires : TH, HE et IN sont aussi révélatrices que E. Avec quelque 600 paires possibles au lieu de 26 lettres, les comptages demandent plus de texte, mais ils finissent par parler. Une paire et son inverse, comme ER et RE, se chiffrent aussi en paires inversées, autre indice qui resserre le carré. Le [casseur de Playfair](/encoder/playfair/cryptanalysis) reconstruit le carré à partir des statistiques de paires.

## Histoire

Charles Wheatstone inventa le chiffre en 1854, mais il porte le nom de son ami Lord Playfair, qui en fit la promotion. Le Foreign Office le jugea trop difficile pour ses commis ; l'armée britannique l'utilisa comme chiffre de campagne pendant la seconde guerre des Boers en 1899, puis pendant la Première Guerre mondiale.
