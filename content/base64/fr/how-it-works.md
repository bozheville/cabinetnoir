# Fonctionnement du Base64

## Un encodage, pas un chiffre

Base64 est la deuxième grande {{term:encoding}} de ce site : tout le
monde peut la décoder, elle ne cache rien, et ce n'est pas du
chiffrement. Son but est le transport — transformer des octets
arbitraires en texte qui survit aux canaux qui ne comprennent que le
texte : corps de courriel, URL, fichiers JSON.

## L'idée en une phrase

Chaque groupe de trois octets d'entrée (24 bits) est redécoupé en
quatre groupes de six bits, et chaque valeur de six bits — de 0 à 63,
d'où « base 64 » — s'écrit comme une lettre d'un alphabet fixe de
64 caractères : `A–Z`, `a–z`, `0–9`, `+` et `/`.

## La recette

1. Prenez trois octets : 24 bits.
2. Redécoupez-les en quatre nombres de 6 bits (0–63).
3. Cherchez chaque nombre dans la table des 64 caractères et écrivez
   le caractère.
4. Quand l'entrée n'est pas multiple de trois, le dernier groupe a
   moins d'octets — les places manquantes s'écrivent comme du
   bourrage `=`.

## Un exemple détaillé

{{example:base64-basic}}

M vaut `01001101`, E vaut `01000101`, encore E `01000101` — coulez
les 24 bits ensemble, redécoupez par six : 19, 20, 21, 5 → `TUVF`.
Remarquez la dernière ligne : un N solitaire devient `Tg==` — deux
caractères de charge et deux signes de bourrage, car 1 octet = 12
bits ne remplit que deux cases de 6 bits.

## Les mathématiques

```
3 octets  = 24 bits = 4 × 6 bits → 4 caractères
la longueur croît d'exactement 4/3 (plus le bourrage)
```

Cette croissance — un tiers de plus que l'entrée, quel que soit le
contenu — explique pourquoi les blocs Base64 semblent uniformes :
toute lettre de toute langue tombe dans les mêmes 64 caractères.

## À quoi cela sert — et à quoi cela ne sert pas

Base64 rend les données binaires imprimables et sûres pour le canal
postal ; il ne sert aussi à rien comme cachette. Les chaînes encodées
se décodent en un clic sans clé, donc « illisible à l'œil » ne vaut
pas « protégé ». Si un mot de passe, une clé d'API ou un « secret »
voyage en Base64, il voyage à découvert — le décodage est à un bouton
de collage, comme l'onglet pratique le démontre.
