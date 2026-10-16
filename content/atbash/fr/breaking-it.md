# Briser le chiffre Atbash

Atbash est le chiffre le plus rapide à casser de ce site — non pas
parce que les cryptanalystes sont habiles, mais parce que le chiffre
n'a jamais eu de secret à protéger. Cette page montre pourquoi, et ce
que cela enseigne.

## La faiblesse : pas de clé, pas de sécurité

Un chiffre n'est fort que par son espace de clés. L'espace de clés
d'Atbash vaut exactement un : il n'existe précisément qu'une façon de
retourner un alphabet. L'attaquant ne cherche pas — il connaît la
correspondance, comme tout le monde connaît l'alphabet. L'essayer une
fois est une attaque par {{term:brute-force}} avec une charge de un.

## Attaque — appliquez le miroir, une fois

1. Passez l'outil en mode déchiffrement et collez le
   {{term:ciphertext}}. La correspondance est publique, donc
   « déchiffrer » tient en un clic.
2. Si le texte ne livre rien, ce n'était pas Atbash — essayez les
   idées voisines : un décalage de César, une
   {{term:substitution}} générale.
3. Notez que l'{{term:frequency-analysis}} est inutile ici, bien
   qu'elle marcherait : Atbash est monoalphabétique. Sans clé à
   retrouver, même les statistiques classiques sont trop de travail.

## Un chiffre qui se cache lui-même

La seule protection d'Atbash est l'obscurité : un lecteur qui ne
soupçonne pas de chiffre ne voit que du charabia. C'est la même
protection que ROT13 sur internet — assez pour cacher une chute,
jamais assez pour cacher un secret de qui regarde deux fois.

## La ressemblance de famille

Atbash est le chiffre affine avec `a` = `b` = 25 — la correspondance
en miroir est `y = (25·x + 25) mod 26`, ce qui simplifie en
`y = 25 − x`. Comparez la famille : César glisse l'alphabet, l'affine
le redistribue avec un multiplicateur choisi, Atbash le retourne
complètement. Tous trois sont monoalphabétiques ; tous trois tombent
sous les mêmes statistiques ; seul l'espace de clés diffère — 312
clés, puis 1.

## Pourquoi on l'enseigne encore

Parce que c'est le cas limite. Chaque question sur la force d'un
chiffre — quelle taille d'espace de clés ? la correspondance est-elle
inversible ? la même lettre clair se chiffre-t-elle toujours pareil ? —
trouve sur Atbash une réponse immédiate et visible. Quand un étudiant
sait expliquer *pourquoi* Atbash ne vaut rien, il sait expliquer ce
qu'il faut à toute substitution pour valoir quelque chose.
