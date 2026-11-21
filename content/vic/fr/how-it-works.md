# Comment fonctionne le chiffre VIC

## L'idée en une phrase

Quatre petits secrets — une phrase, une date, un numéro personnel et
un groupe-clé frais de cinq chiffres — s'étirent par l'arithmétique
modulo 10 en un {{term:straddling-checkerboard}} et deux clés de
{{term:transposition}}, si bien qu'un message coûte au cryptanalyste
une substitution invisible, deux transpositions irréversibles et une
clé qui ne se répète jamais.

## Les cinq étapes

1. **Le programme de clés.** Le groupe-clé moins les cinq chiffres de
   la date (sans emprunt) amorce une ligne d'{term:chain-addition} ;
   les vingt lettres de la phrase sont classées par
   {{term:sequencing}} et mélangées dedans ; il en sort la Ligne Q et
   la Ligne R — les deux tableaux de transposition — et la Ligne S,
   l'en-tête de chiffres mélangés de l'échiquier. Activez
   **Montrer les calculs de clé** dans l'outil et regardez chaque
   ligne apparaître ; les infobulles nomment chaque opération, de A à
   S chez Kahn.
2. **L'échiquier.** Un moyen mnémotechnique (`AT ONE SIR`) trône sur
   les chiffres de la Ligne S : huit lettres fréquentes prennent un
   chiffre chacune, et les deux cases vides deviennent les étiquettes
   de rangées du reste de l'alphabet. Toute autre lettre, le point et
   le signe de bascule `/` enjambe deux chiffres. Les nombres
   voyagent dans une paire `/…/`, écrits trois fois chacun.
3. **Le premier tableau.** Le flux de chiffres s'écrit dans une
   grille large de `a` colonnes (la largeur vient du numéro
   personnel) et se lit colonne par colonne dans l'ordre des rangs de
   la Ligne Q.
4. **Le tableau perturbé.** Une seconde transposition, large de `b`
   colonnes, dont la grille porte des zones triangulaires de
   « perturbation » — remplies en dernier, après chaque case
   ordinaire. Les triangles brisent précisément la régularité de
   colonnes dont l'anagrammeur a besoin.
5. **Le groupe-clé.** Les chiffres sont coupés en groupes de cinq et
   le groupe-clé s'insère à un nombre de groupes de la fin choisi par
   la date. Il voyage avec le message — ce qui est sans danger,
   car seul il sème tout et ne révèle rien.

## Un exemple travaillé

{{example:vic-basic}}

Les secrets de l'exemple Wikipédia, tout le programme du groupe-clé
jusqu'à l'en-tête de l'échiquier. La Ligne S `5961328470` coiffe le
plateau ; les cases vides au-dessus de `6` et de `8` étiquettent les
rangées enjambées.

{{try:vic-basic}}

## Le déchiffrement

Déroulez le même programme depuis les trois secrets mémorisés, mais
d'abord sortez le groupe-clé de sa position choisie par la date — le
message révèle lui-même sa graine. Puis défaites les deux
transpositions (la perturbée en dernier), relisez l'échiquier, et
annulez la bisection facultative à la coupe convenue. Les `X` finaux
étaient du bourrage ; le message finit là où ils commencent.

## Les indices — et pourquoi il n'y en a pas

Un flux nihiliste trahit la période de sa clé ; une transposition
colonnaire trahit ses comptes de colonnes ; les chiffres d'un échiquier
ne trahissent rien, car ils sont plats comme un masque jetable : le
groupe-clé est neuf à chaque message, donc tout le programme est neuf
à chaque message. C'est tout le secret du chiffre — et la raison pour
laquelle la page suivante est une leçon d'histoire plutôt qu'un
outil de cassage.
