# Casser la transposition colonnaire

Une transposition cache l'*ordre* des lettres, pas les lettres
elles-mêmes — les fréquences qui tuent les chiffres de substitution
sont donc plates ici, et une autre faiblesse prend le relais : la
structure. L'assistant de l'onglet Cryptoanalyse guide l'attaque ; cette
page explique ce que fait chaque étape et pourquoi elle marche.

{{challenge:columnar-demo}}

## La faiblesse : la grille a une forme

Le chiffre est fait de colonnes entières d'une grille mises bout à
bout. Si vous devinez la bonne largeur, le chiffre se découpe en
exactement ces colonnes — de vraies tranches verticales intactes de la
grille du texte clair. Si vous vous trompez, vous coupez les colonnes à
des endroits arbitraires et mélangez des lettres sans rapport. C'est le
levier dont toute l'attaque se sert.

## L'assistant, étape par étape

1. **Nombre de colonnes.** Pour une grille complétée (régulière), la
   longueur du chiffre doit se diviser par la largeur — seuls les
   diviseurs sont candidats, classés selon à quel point la meilleure
   disposition de leurs colonnes paraît anglaise. Le score est un
   indice, pas une réponse : sur les textes courts une mauvaise largeur
   peut surpasser la bonne, et le vrai test est l'étape 2.
2. **Ordonner les colonnes.** Le chiffre se dresse en colonnes ;
   l'{{term:anagrammage}} consiste à les faire glisser côte à côte
   jusqu'à ce que les lignes se lisent comme un texte anglais. Chaque
   paire voisine est notée d'après les digrammes que leurs lignes
   forment ensemble — TH, HE, IN s'allument, QX non. Suivez les
   badges, rapprochez les partenaires prometteurs et fiez-vous à votre
   œil de locuteur plutôt qu'aux nombres : l'outil ne déplace jamais
   une colonne à votre place.
3. **Terminé.** Quand les lignes se lisent, le texte clair est
   retrouvé — des lettres de complètement peuvent traîner à la toute
   fin. « Utiliser ce résultat » emporte l'ordre des colonnes vers
   l'onglet Outil, qui déchiffre tout le message.

## Pourquoi ça marche : les digrammes se souviennent de l'ordre

Les lettres de l'anglais ne sont pas indépendantes : certaines paires
sont fréquentes, la plupart sont rares. Deux vraies colonnes voisines
zippent leurs lignes en vrais digrammes anglais ; deux inconnues
zippent en bruit. Cette seule statistique suffit à reconstruire la clé
décision par décision — le même principe que l'attaquant ADFGVX
applique à sa deuxième étape, où les colonnes sont le même objet.

## Ce que change la double transposition

L'{{term:column-order}} d'une transposition simple se retrouve paire de
colonnes par paire de colonnes. Chiffrez deux fois et aucune paire de
morceaux du chiffre n'est plus une vraie paire de voisins du texte
clair — toute statistique simple s'aplatit. Casser la double
transposition à la main, c'est écrire des mots probables sur du papier
quadrillé et faire glisser des formes ; un beau travail manuel, hors de
portée de cet outil.
