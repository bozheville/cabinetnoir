## Ce qui unit la famille

Un chiffrement par transposition garde toutes les lettres du message et ne change que leur ordre. Rien n'est remplacé : le chiffré est une anagramme du clair, avec exactement les mêmes lettres en exactement les mêmes nombres. La clé est la règle du mélange.

## Comment ça marche

Le [rail fence](/encoder/railFence/learn) écrit le message en zigzag sur quelques lignes et lit les lignes l'une après l'autre. Avec deux rails, ATTACKATDAWN devient ATCADW TAKTAN. La [transposition par colonnes](/encoder/columnar/learn) écrit le message en lignes sous un mot-clé et lit les colonnes dans l'ordre alphabétique des lettres de la clé. Le [chiffre de Saknussemm](/encoder/saknussemm/learn), tiré du roman de Jules Verne, mélange une grille runique, et [ADFGVX](/encoder/adfgvx/learn) utilise un mélange par colonnes comme seconde étape.

## Comment on le casse

Comme les lettres ne changent pas, leurs comptages correspondent exactement à la langue, et cela seul indique que le chiffre est une transposition : E, T et A sont aussi fréquents qu'ils doivent l'être, simplement mal placés. L'attaque porte un nom : {{term:anagramming}}. On essaie une largeur ou un nombre de rails, on aligne les colonnes et on les fait glisser jusqu'à ce que des paires courantes comme TH et HE apparaissent d'une colonne à l'autre. Un rail fence a si peu de clés qu'on les essaie toutes rapidement ; le [casseur de rail fence](/encoder/railFence/cryptanalysis) s'en charge. Les clés par colonnes sont plus nombreuses, mais les scores de paires guident encore la recherche, comme le montre le [casseur de transposition par colonnes](/encoder/columnar/cryptanalysis).

## Histoire

La plus ancienne transposition connue est la scytale spartiate, une lanière de cuir enroulée autour d'un bâton. Les mélanges par colonnes ont rempli les manuels de chiffre de la Renaissance, et en 1864 Jules Verne ouvrit *Voyage au centre de la Terre* sur un message runique mélangé.
