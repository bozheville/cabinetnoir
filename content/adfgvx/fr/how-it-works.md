# Comment fonctionne le chiffre ADFGVX

## L'idée en une phrase

ADFGVX transforme chaque lettre (et chiffre) du {{term:plaintext}} en
une paire de coordonnées prises parmi les six lettres **A D F G V X**,
puis mélange le flot obtenu par un mélange de colonnes — chaque lettre
en clair est d'abord coupée en deux, et chaque moitié voyage
séparément. Les chiffres qui coupent ainsi les lettres pratiquent le
{{term:fractionation}}.

## La recette

1. Construisez un {{term:polybius-square}} de 6×6 rempli avec un
   {{term:alphabet}} mélangé : d'abord les lettres de la
   {{term:key}} du carré (doublons retirés), puis le reste de
   l'alphabet, puis les chiffres 0–9. Chaque case contient un
   caractère.
2. Remplacez chaque caractère du message par les deux coordonnées de
   sa case — la lettre de ligne et la lettre de colonne. Un message de
   N lettres devient un flot de 2N lettres prises parmi A D F G V X.
3. Écrivez le flot fractionné dans une grille, ligne par ligne, large
   comme la clé de transposition. Si la dernière ligne est courte, la
   grille est complétée jusqu'au rectangle plein.
4. Lisez la grille colonne par colonne, dans l'ordre alphabétique des
   lettres de la clé de transposition. Cette lecture colonne par
   colonne est la {{term:transposition}} — le texte chiffré final.

## Un exemple détaillé

{{example:adfgvx-basic}}

Lisez les premières lignes : **A** occupe la case ligne **A**,
colonne **A** du carré, il devient donc `AA` ; **T** tombe ligne
**A**, colonne **G** et devient `AG`. La troisième colonne montre le
flot fractionné grandir — le flot que la transposition mélangea plus
tard.

## Le déchiffrement marche à reculons

Avec les clés, le déchiffrement est mécanique :

1. Recoupez le texte chiffré en ses colonnes (des morceaux égaux, la
   grille étant un rectangle plein) et replacez-les dans la grille
   dans l'ordre des lettres de la clé.
2. Lisez la grille ligne par ligne — le flot fractionné revient.
3. Prenez les coordonnées deux par deux et cherchez chaque paire dans
   le carré : la case est le caractère en clair.

L'outil fait les trois étapes quand vous appuyez sur Décrypter avec
les deux clés remplies.

## Deux variantes, une idée

L'armée allemande a d'abord mis en service la version 5×5 **ADFGX**
(lettres seules, I et J partageant une case), puis a ajouté en quelques
semaines une sixième ligne pour les chiffres — **ADFGVX**. L'outil
prend en charge les deux : changez de variante au-dessus des champs de
clé, et le carré, l'alphabet de fractionnement et les caractères
autorisés changent avec elle.

{{try:adfgvx-basic}}
