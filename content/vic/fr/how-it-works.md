# Fonctionnement du chiffre VIC

## L'idée en bref

Le chiffre VIC transforme quatre petits secrets en une grande clé. Ces
secrets sont une phrase, une date, un numéro personnel et un
{{term:keygroup}} de cinq chiffres tirés au hasard. Un peu
d'arithmétique en tire un {{term:straddling-checkerboard}} et deux clés
de {{term:transposition}}.

L'échiquier change les lettres en chiffres. Les deux transpositions
mélangent ensuite ces chiffres, deux fois. Comme le groupe-clé change à
chaque message, toute la clé change à chaque message.

## Les cinq étapes

1. **Construire la clé.** C'est l'étape la plus longue. Elle se fait
   sur une feuille de travail dont les lignes portent les lettres A à S
   (les noms de David Kahn).
   - Soustrayez du groupe-clé les cinq premiers chiffres de la date,
     chiffre par chiffre, sans retenue (ligne C).
   - Allongez le résultat à dix chiffres par
     {{term:chain-addition}} : chaque nouveau chiffre est la somme de
     deux voisins, dont on ne garde que l'unité (ligne F1).
   - Prenez les 20 premières lettres de la phrase. Numérotez chaque
     moitié dans l'ordre alphabétique : c'est le {{term:sequencing}}
     (lignes E1 et E2).
   - Combinez ces lignes (lignes G et H), puis ajoutez 50 chiffres par
     addition en chaîne (lignes K à P).
   - Ce bloc donne trois clés : la ligne Q pour le premier tableau, la
     ligne R pour le second et la ligne S pour l'échiquier.

   Cochez **Montrer les calculs de clé** dans l'outil pour voir chaque
   ligne apparaître. Une info-bulle explique comment chacune est
   obtenue.
2. **Changer les lettres en chiffres.** La rangée du haut de
   l'échiquier contient huit lettres fréquentes, `AT ONE SIR` sur
   l'échiquier latin. Chacune devient un seul chiffre. Les deux cases
   vides de cette rangée servent d'étiquettes à deux autres rangées.
   Celles-ci contiennent toutes les autres lettres, le point et un
   signe de nombre `/`, codés sur deux chiffres. Les nombres s'écrivent
   entre deux signes `/`, chaque chiffre répété trois fois.
3. **Premier mélange.** Écrivez les chiffres en lignes sous la ligne Q,
   un chiffre par colonne. Relisez-les colonne par colonne, dans
   l'ordre des numéros de la ligne Q. La largeur du tableau dépend du
   numéro personnel.
4. **Second mélange, avec des pièges.** Recommencez avec la ligne R,
   mais dans une {{term:disrupted-transposition}}. Certaines cases
   forment des triangles qu'on ne remplit qu'à la fin. Ces triangles
   cassent la régularité des colonnes qu'un cryptanalyste chercherait.
5. **Cacher le groupe-clé.** Découpez les chiffres en groupes de cinq.
   Insérez ensuite le groupe-clé dans le message. Le sixième chiffre de
   la date indique où : à autant de groupes de la fin. Le groupe-clé
   voyage en clair, mais sans les trois autres secrets il ne sert à
   rien.

## Un exemple détaillé

{{example:vic-basic}}

Ce sont les secrets de l'exemple de Wikipédia : la phrase *Twas the
night before Christmas*, la date `13/9/1959`, le numéro personnel `6`
et le groupe-clé `72401`. Le tableau montre chaque ligne de la feuille,
du groupe-clé jusqu'à la ligne S, `5961328470`. La ligne S devient
l'en-tête de l'échiquier. Les cases vides sont au-dessus de `6` et de
`8` : ces deux chiffres étiquettent les rangées du bas.

Les deux tableaux ont 13 et 6 colonnes. Les chiffres de la date sont
`1391959`, son sixième chiffre est donc `5` : le groupe-clé se place à
cinq groupes de la fin.

{{try:vic-basic}}

## Comment se fait le déchiffrement

Le destinataire connaît la phrase, la date et le numéro personnel. Le
sixième chiffre de la date lui dit où se trouve le groupe-clé : il le
retire d'abord du message. Avec les quatre secrets, il refait la même
feuille de travail.

Il défait ensuite chaque étape dans l'ordre inverse : le second
tableau, le premier, puis l'échiquier. Si le message a été coupé en
deux, il remet les moitiés dans l'ordre. Les `X` éventuels à la fin
sont du bourrage et peuvent être ignorés.

## Pourquoi le message chiffré ne trahit rien

La plupart des chiffres classiques laissent une trace. Une clé qui se
répète crée un motif toutes les quelques lettres. Une transposition
simple garde les fréquences des lettres de la langue. Le chiffre VIC
efface les deux.

L'échiquier code les lettres sur un ou deux chiffres, ce qui brouille
les fréquences. Deux transpositions de suite, dont une piégée,
détruisent l'ordre. Et comme chaque message a son propre groupe-clé,
deux messages ne partagent jamais la même clé. Le cryptanalyste n'a
rien à comparer. C'est pourquoi ce site ne propose pas de casseur VIC.
