## Ce qui unit la famille

Un chiffre affine traite l'alphabet comme des nombres de 0 à 25 et envoie chaque lettre le long d'une droite : on multiplie par un nombre, on en ajoute un autre, et on revient au début grâce à l'outil suivant : {{term:modular-arithmetic}}. La règle est E(x) = a·x + b mod 26. Le multiplicateur ne doit avoir aucun facteur commun avec 26, donc seules 12 valeurs de a conviennent, ce qui donne 312 clés en tout.

## Comment ça marche

Avec a = 5 et b = 8, H (7) devient 5·7 + 8 = 43, soit 17 mod 26 : la lettre R. HELLO devient RCLLA. Le déchiffrement parcourt la droite à l'envers avec l'inverse de 5, qui est 21, car 5·21 = 105 laisse un reste de 1 dans la division par 26.

L'[Atbash](/encoder/atbash/learn) est la droite qui descend : a = 25 et b = 25 envoient A sur Z, B sur Y et ainsi de suite, donc HELLO devient SVOOL. Il est son propre inverse, comme un miroir. La page du [chiffre affine](/encoder/affine/learn) permet de choisir n'importe quelle paire valide, et le décalage du chiffre de César n'est que le cas a = 1.

## Comment on le casse

312 clés s'essaient en un clin d'œil, donc une méthode reste toujours disponible : {{term:brute-force}}. À la main, il est plus rapide de deviner deux lettres : si les lettres les plus fréquentes du chiffré représentent E et T, deux équations donnent directement a et b. Le [casseur du chiffre affine](/encoder/affine/cryptanalysis) montre les deux voies, et l'Atbash, avec une seule clé, ne demande aucune attaque.

## Histoire

L'Atbash est le membre le plus ancien : le livre de Jérémie, écrit vers la chute de Jérusalem en 586 av. J.-C., appelle Babylone *Sheshach*, la forme Atbash de son nom hébreu. Le chiffre affine général n'a pas d'inventeur unique ; c'est ce que les mathématiques proposent dès que l'on voit le décalage de César comme une addition.
