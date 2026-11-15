## Ce qui unit la famille

Un chiffrement à carré de Polybe écrit l'alphabet dans une grille et remplace chaque lettre par sa ligne et sa colonne. Les lettres deviennent des paires de coordonnées, de chiffres ou de symboles, et le chiffré prend la forme de nombres. La grille elle-même, le {{term:polybius-square}}, est une substitution simple, mais les nombres invitent au calcul et au mélange, et c'est pourquoi le carré se trouve au départ de plusieurs chiffres plus solides.

## Comment ça marche

Dans le carré simple de 5 × 5, où I et J partagent une case, H se trouve ligne 2, colonne 3, donc HELLO devient 23 15 31 31 34. Le [chiffre de Polybe](/encoder/polybius/learn) s'arrête là, ou utilise un mot-clé pour mélanger la grille. Le [chiffre nihiliste](/encoder/nihilist/learn) ajoute à chaque paire les coordonnées d'une clé répétée, et [ADFGVX](/encoder/adfgvx/learn) étiquette les lignes et les colonnes avec les lettres A, D, F, G, V et X, puis mélange les coordonnées par colonnes.

## Comment on le casse

Un carré nu est une substitution monoalphabétique déguisée : comptez les paires, et la méthode dite {{term:frequency-analysis}} les lit comme des lettres. Le [casseur de Polybe](/encoder/polybius/cryptanalysis) le fait directement. La clé nihiliste ajoute un motif répété qui tombe, comme le chiffre de Vigenère, dès que sa longueur est connue ; voir le [casseur nihiliste](/encoder/nihilist/cryptanalysis). ADFGVX coupe chaque lettre en deux moitiés, procédé appelé {{term:fractionation}}, et a demandé une tout autre attaque.

## Pourquoi certains chiffres apparaissent ici et ailleurs

Le chiffre nihiliste et ADFGVX commencent par un carré puis ajoutent une seconde étape : ce sont donc aussi des chiffrements produits, et ADFGVX appartient en outre à la famille des chiffrements par transposition.

## Histoire

Polybe, l'historien grec du IIe siècle av. J.-C., décrivit la grille comme un système de signaux. Des prisonniers la frappèrent plus tard sur les murs, des révolutionnaires russes des années 1880 y ajoutèrent des nombres, et l'armée allemande bâtit ADFGVX dessus en 1918.
