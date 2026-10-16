# Fonctionnement de la machine Enigma

## L'idée en une phrase

Enigma est une machine électromécanique {{term:polyalphabetic}} :
trois roues {{term:rotor}} remanient l'{{term:alphabet}} à chaque
frappe, et un {{term:reflector}} renvoie le signal à travers les
roues — de sorte qu'une même lettre ne se chiffre presque jamais deux
fois de la même manière.

## La machine de ce site

L'outil modélise une Enigma I en configuration fixe :

- **Rotors I, II et III**, de gauche à droite, partant de la clé que
  vous tapez (trois lettres, A–Z — la *Grundstellung*, les positions
  de départ) ;
- **Réflecteur B** ;
- **pas de tableau de connexions** et un entrée-walze droite.

Soyons honnêtes avec le mot *clé* : sur la vraie machine, la feuille
de clés portait aussi l'ordre des rotors (cinq rotors parmi
lesquels en choisir trois), les réglages de l'anneau et jusqu'à dix
paires de {{term:plugboard}}. Les trois lettres d'ici ne sont que les
positions de départ — la plus petite part d'une vraie clé Enigma.

## La recette

1. Réglez les trois rotors sur la clé, par exemple `AAA`.
2. Tapez une lettre. **Les rotors avancent d'abord** — la roue de
   droite gagne une position à chaque frappe.
3. Le signal court alors : à travers l'entrée-walze, de droite à
   gauche dans les trois rotors, dans le réflecteur, qui le renvoie
   de gauche à droite dans les mêmes rotors, puis sort par
   l'entrée-walze.
4. Une lampe au-dessus du clavier s'allume : c'est la lettre du
   texte chiffré.

## Un exemple détaillé

{{example:enigma-basic}}

C'est le test de contrôle le plus célèbre de la cryptologie : Enigma
I, rotors I-II-III, réflecteur B, positions de départ `AAA`, taper
`AAAAA` donne **BDZGO**. Regardez la colonne centrale — la fenêtre
des rotors avance `AAB, AAC, AAD…` à mesure que l'on tape, et chaque
A se chiffre dans un état différent des rotors, d'où des sorties
différentes.

## L'alphabet roulant

- Le **rotor de droite** avance à chaque frappe — 26 pas, puis il
  reporte au rotor du milieu.
- Chaque rotor a une **encoche** : lorsqu'il dépasse son encoche (le
  rotor I reporte après Q), la roue située à sa gauche avance aussi.
- Le rotor du milieu a la fameuse particularité du **double pas** :
  être sur sa propre encoche le fait avancer à deux frappes
  consécutives, si bien que le rotor de gauche tourne plus tôt qu'un
  compteur kilométrique propre ne le suggérerait.

## Pourquoi la même machine chiffre et déchiffre

Le réflecteur échange les lettres par paires (A↔Y, R↔U…) et ne mappe
jamais une lettre sur elle-même. Comme chaque étape du trajet est
parcourue en avant puis en arrière en ordre miroir, la machine toute
entière est sa propre inverse : mêmes positions de départ, texte
chiffré tapé — et les lampes du texte clair s'allument. Voilà
pourquoi l'outil n'a pas de vrai « mode déchiffrement » — le bouton
d'échange est une courtoisie, pas une nécessité.

{{try:enigma-basic}}
