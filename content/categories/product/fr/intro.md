## Ce qui unit la famille

Un chiffrement produit applique deux opérations différentes l'une après l'autre, en général une substitution puis une transposition. Chaque étape couvre la faiblesse de l'autre : la substitution cache quelles lettres sont présentes, la transposition cache où elles se trouvent. Casser une seule couche ne donne rien de lisible.

## Comment ça marche

Prenez HELLO dans un carré de Polybe simple : 23 15 31 31 34. Écrivez maintenant ces dix chiffres en lignes sous une clé de deux lettres et lisez les colonnes dans un ordre fixé : les deux chiffres de chaque lettre se retrouvent à des endroits différents. C'est l'idée d'[ADFGVX](/encoder/adfgvx/learn), qui étiquette son carré avec les lettres A, D, F, G, V et X puis mélange le résultat par une transposition par colonnes. Le [chiffre nihiliste](/encoder/nihilist/learn) combine un carré de Polybe avec l'addition d'une clé numérique répétée.

Le chiffre bifide et le damier à cheval du chiffre VIC, tous deux bientôt disponibles, mélangent les coordonnées d'autres façons.

## Comment on le casse

Couper chaque lettre en deux morceaux empêche l'analyse fréquentielle de s'appliquer directement au chiffré ; ce procédé s'appelle {{term:fractionation}}. Les attaques défont donc d'abord la seconde couche. Pour ADFGVX, il s'agit de trouver l'ordre des colonnes à partir de nombreux messages chiffrés avec la même clé, puis de lire le carré comme une substitution simple ; le [casseur d'ADFGVX](/encoder/adfgvx/cryptanalysis) suit cette voie. Le [casseur nihiliste](/encoder/nihilist/cryptanalysis) trouve la longueur de la clé à partir des nombres, à la manière du chiffre de Vigenère.

## Pourquoi ces chiffres apparaissent dans plusieurs familles

Les deux membres partent d'un carré de Polybe, ils figurent donc aussi dans cette famille, et ADFGVX est également une transposition.

## Histoire

ADFGVX fut conçu par Fritz Nebel et entra en service dans l'armée allemande en mars 1918. Georges Painvin, du bureau du chiffre français, cassa la clé d'une journée dès ce printemps-là, et quand l'offensive allemande arriva en juin 1918, les Français l'attendaient.
