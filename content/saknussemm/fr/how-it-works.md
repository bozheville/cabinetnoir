# Le fonctionnement du chiffre de Saknussemm

## L'idée en une phrase

Saknussemm est une {{term:transposition}} en deux temps — le message
entier écrit à rebours, puis le flot de lettres renversé découpé en
groupes en forme de colonnes — le parchemin runique qu'Arne Saknussemm
laisse dans le « Voyage au centre de la Terre » de Jules Verne.

## La recette

1. Prenez le {{term:plaintext}}, gardez les lettres seules et
   renversez le flot : DESCENDE devient EDNECSED. C'est l'étape qui
   arrête le professeur dans le roman — il lit les runes pendant des
   jours avant qu'Axel ne suggère de lire le message « de droite à
   gauche, comme tous les peuples du Thulé ».
2. Choisissez la forme : combien de lettres contient chaque groupe
   (le parchemin : 7) et combien de groupes imprime chaque ligne (le
   parchemin : 3). Les lignes elles-mêmes sont illimitées — le texte
   coule simplement sur autant de lignes qu'il faut.
3. Écrivez le flot renversé le long des rangées d'une grille dont les
   colonnes sont les groupes : la lettre numéro k du flot renversé
   tombe dans le groupe k mod W, rangée k div W, où W est le nombre
   total de groupes.
4. Lisez la grille en descendant ses colonnes et imprimez ce que vous
   voyez : `clustersPerLine` groupes par ligne, séparés par des
   espaces. Le {{term:ciphertext}} de DESCENDE dans la forme du
   parchemin est `EEE DCD NS` — trois groupes sur une seule ligne.

## Un exemple travaillé

{{example:saknussemm-basic}}

Chaque rangée ajoute un groupe dans l'ordre d'impression. SNEFFELS
renversé donne SLEFFENS ; la forme 3×2 demande quatre groupes, et le
groupe numéro 1 prend une lettre sur quatre du flot renversé en
commençant par la première : S, puis F. Le groupe 2 prend L et E, le
groupe 3 prend E et N, le groupe 4 prend F et S. La cryptogramme
imprimée est `SF LE EN FS` — quatre groupes, deux par ligne.

## La mécanique

Tout découle d'une seule relation : **le groupe k contient les
lettres S[k], S[k+W], S[k+2W], …** où S est le message renversé et W
le nombre de groupes. Les groupes lus côte à côte reconstruisent les
rangées de la grille, qui lues en travers épellent S — et un dernier
renversement épele le texte en clair. Aucune lettre n'est jamais
modifiée, dupliquée ni perdue : la cryptogramme est toujours une
anagramme du message, ce qui est à la fois le charme du chiffre et sa
faiblesse.

## Notes propres à l'outil

- L'entrée est mise en majuscules et réduite aux lettres avant le
  chiffrement — la ponctuation et les espaces n'entrent jamais dans la
  grille. Le latin du parchemin, virgules comprises, devient un flot
  de 133 lettres.
- La sortie porte des espaces et des sauts de ligne à dessein : ils
  marquent les frontières des groupes. Le déchiffrement accepte les
  deux formes — les groupes séparés par des espaces, ou un bloc de
  lettres plein découpé avec la même règle de forme.
- La forme vaut par défaut celle du parchemin : 7 et 3. N'importe
  quelle autre forme chiffre pareil, mais seule la 7×3 reproduit la
  dictée du roman.

{{try:saknussemm-basic}}
