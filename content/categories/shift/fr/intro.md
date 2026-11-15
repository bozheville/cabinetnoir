## Ce qui unit la famille

Un chiffrement par décalage fait glisser tout l'alphabet d'un nombre fixe de places. Chaque lettre se déplace de la même quantité, et cette quantité porte un nom : {{term:shift}}. L'alphabet boucle sur lui-même, si bien que Z est de nouveau suivi de A. Le décalage est toute la clé, et avec 26 lettres il n'y en a que 25 utiles.

## Comment ça marche

Le [chiffre de César](/encoder/caesar/learn) avec un décalage de 3 transforme HELLO en KHOOR : H passe à K, E à H, L à O. Pour décoder, on recule de trois places. Le [ROT13](/encoder/rot13/learn) est le cas particulier d'un décalage de 13, exactement la moitié de l'alphabet : l'appliquer deux fois ramène au point de départ, donc la même opération cache et révèle un texte. HELLO devient URYYB, et URYYB redevient HELLO.

## Comment on le casse

Vingt-cinq clés, ce n'est rien. L'attaque la plus directe s'appelle ainsi : {{term:brute-force}}. Elle écrit tous les décalages, un par ligne, et la seule ligne qui ressemble à une langue est la réponse ; même à la main, cela prend quelques minutes. Plus rapide encore, la méthode dite {{term:frequency-analysis}} : trouvez la lettre la plus fréquente du chiffré, supposez qu'elle représente E, et la distance entre les deux est la clé. Le ROT13 ne demande aucune attaque, puisque la clé est publique.

Les chiffrements par décalage sont le point de départ de tout cours de cryptographie, car ils montrent les deux idées de base sous leur forme la plus pure : une clé, et une attaque qui cherche ou qui compte.

## Histoire

La famille doit son nom à Jules César qui, selon son biographe Suétone, utilisait un décalage de 3 dans sa correspondance privée. Le ROT13 n'a jamais été conçu pour être secret : il est né sur Usenet dans les années 1980 pour cacher les révélations et les chutes de blagues aux lecteurs qui ne voulaient pas encore les voir.
