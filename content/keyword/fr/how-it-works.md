# Comment fonctionne le chiffre par mot-clé

## L'idée en une phrase

Le chiffre par mot-clé est une {{term:substitution}} dont
l'{{term:cipher-alphabet}} s'épelle tout seul : écrivez d'abord le mot
de passe (le {{term:key}}), puis continuez avec les lettres qu'il
n'utilise pas — l'alphabet garde le mot-clé dans sa forme même.

## La recette

1. Choisissez un mot-clé, par exemple `KRYPTOS`. Écrivez ses lettres
   dans l'ordre, sans les répétitions : `K R Y P T O S`.
2. En dessous de l'alphabet clair, continuez avec les lettres restantes
   dans leur ordre naturel : `A B C D E F G H I J L M N Q U V W X Z`.
3. Les deux rangées ensemble forment l'alphabet chiffré :
   `KRYPTOSABCDEFGHIJLMNQUVWXZ`.
4. Chiffrez chaque lettre du texte clair par la lettre chiffrée placée
   sous elle : A devient K, B devient R, C devient Y. Le déchiffrement
   parcourt les rangées dans l'autre sens.

## Un exemple travaillé

{{example:keyword-basic}}

La colonne du milieu montre d'où vient chaque lettre chiffrée : `K`
marque les lettres du mot-clé, `·` marque la suite ordinaire. Ce
partage est toute l'astuce — et toute la faiblesse.

## La variante par continuation

Certains alphabets à mot-clé ne reprennent pas à A après le mot-clé ;
ils continuent à compter depuis sa dernière lettre. Avec `KRYPTOS` cela
donne `KRYPTOSUVWXZABCDEFGHIJLMNQ` — après S vient U (T est déjà
utilisé), puis V, W, X, Z, puis le retour A, B, C… L'outil propose les
deux modes avec la case « Continuer après le mot-clé ».

## Alphabets libres

N'importe quel arrangement des 26 lettres fonctionne comme alphabet
chiffré — le mot-clé n'est que la manière mémorisable de l'écrire. Le
mode « Alphabet libre » de l'outil accepte toute permutation ; c'est
exactement ce que produit l'assistant de cryptoanalyse : un alphabet
reconstitué ne vient pas forcément d'un mot-clé.

{{try:keyword-basic}}
