# Déjouer le chiffre Pigpen

Pigpen paraît indéchiffrable au débutant — symboles étrangers, aucune
lettre à compter — et est en réalité le chiffre le plus rapide à
déjouer de ce site après Atbash. Cette page montre pourquoi l'étrangeté
n'est qu'un vernis.

## La faille : une substitution déguisée

Retirez les dessins et le pigpen est une simple {{term:substitution}}
monoalphabétique : exactement une correspondance fixe des lettres aux
symboles, sans clé, sans autre choix que la variante. Tout ce qui
déjoue une substitution simple s'applique à l'identique — il n'y a que
26 symboles à identifier, et le texte clair est du langage ordinaire.

## L'attaque — le traiter comme un exercice de lecture

1. **Reconnaître d'abord le chiffre.** Fragments de grille et formes
   pointées se reconnaissent au premier coup d'œil : l'intercepteur n'a
   généralement pas besoin de *déjouer* le pigpen, seulement de le
   *déchiffrer* — la clé est un savoir public, comme l'alphabet lui-même.
2. **Identifier la variante.** Le jeu de symboles se devine souvent :
   grilles maçonnes d'abord, puis les variantes à cases pointées ou à
   croix. Essayer la poignée de variantes publiées prend des minutes.
3. **Revenir à l'{{term:frequency-analysis}}.** Si la variante est non
   standard, comptez les symboles : le glyphe le plus fréquent est
   presque sûrement E, T ou A, les symboles doublés sont L, T ou E, et
   la grammaire des formes (murs, points, bras) contraint les
   hypothèses. Un texte de taille raisonnable tombe devant les mêmes
   statistiques que tout chiffre monoalphabétique.

## Pourquoi il n'y a pas de déjoueur ici

Les déjoueurs guidés de ce site méritent leur place en cherchant dans
un espace de clés : décalages, multiplicateurs, rotations de disques,
permutations de colonnes. Le pigpen n'a rien à chercher — une fois la
variante identifiée, la correspondance est complète. Un futur déjoueur
ne ferait qu'automatiser la reconnaissance de variante ; si un message
lui résiste, ce n'est pas vraiment du pigpen.

## Ce que le pigpen enseigne

Le pigpen est la leçon la plus pure sur la différence entre *secret de
la méthode* et *secret de la clé* : un système dont la sécurité repose
sur l'hypothèse que l'adversaire n'a jamais vu une pierre tombale
maçonnique n'est pas un système, c'est un espoir. C'est exactement
l'hypothèse que toute conception de chiffrement sérieuse refuse de
faire.
