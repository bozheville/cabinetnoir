# Briser ROT13

ROT13 ne peut pas être « attaqué » au sens propre — le décalage est
publié dans le nom même du chiffre. Cette page est courte, et c'est
justement le point pédagogique.

## La faiblesse : le nom est la clé

César cachait le décalage ; ROT13 l'imprime dans son titre. Il n'y a
pas d'espace de clés — une seule possibilité, un décalage connu — donc
rien à forcer par {{term:brute-force}} et rien à déduire. Une attaque
par force brute tient ici en une seule tentative, toujours couronnée
de succès.

## Attaque — recommencez

1. Collez le {{term:ciphertext}} dans l'outil. Comme ROT13 est sa
   propre inverse, la même opération qui l'a produit le supprime.
2. Pas d'{{term:frequency-analysis}}, pas de chasse au
   {{term:crib}}, pas de statistiques : la distribution des lettres
   d'un texte ROT13 est exactement celle de l'original, réétiquetée —
   et un œil exercé lit de l'anglais réétiqueté presque
   directement.

## Ce qui le rend utile quand même

La protection de ROT13 vise la lecture *accidentelle* : un
commentateur qui survole la chute d'une blague, un lecteur qui ne
veut pas connaître l'intrigue. C'est un vrai cas d'usage — juste pas
cryptographique. C'est la même leçon qu'Atbash, une page plus tôt :
un chiffre sans clé est une fonction de confort.

## La ressemblance de famille

ROT13 est le chiffre affine avec `a` = 1, `b` = 13, et le seul
décalage de César qui soit sa propre inverse. Dans la famille des
chiffres monoalphabétiques, il marque le plancher : aucune clé,
aucune sécurité, et — précisément pour cela — un monument permanent
de la nétiquette.
