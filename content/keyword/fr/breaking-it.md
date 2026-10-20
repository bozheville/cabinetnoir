# Briser le chiffre par mot-clé

Un alphabet à mot-clé paraît personnel et facile à mémoriser — il
reste une {{term:substitution}} monoalphabétique, et les statistiques
classiques s'appliquent sans changement. L'assistant de l'onglet
Cryptoanalyse conduit l'attaque ; cette page explique ce que fait
chaque étape et pourquoi elle fonctionne.

{{challenge:keyword-demo}}

## La faiblesse : une correspondance fixe

Quelle que soit la forme de l'alphabet — mot-clé, mot-clé continué ou
permutation libre — chaque lettre du texte clair se chiffre en la même
lettre pour tout le message. C'est l'invariant dont se nourrit
l'{{term:frequency-analysis}} : les comptages des lettres chiffrées
sont des comptages des lettres claires déguisés.

## L'assistant, étape par étape

1. **Compter les lettres.** Le tableau trie les symboles chiffrés par
   fréquence et dessine chaque compte en barre. Comparez la forme avec
   l'anglais — E, T, A, O mènent — et vérifiez que le texte est assez
   long pour être fiable (l'outil avertit sous 100 lettres).
2. **Attribuer les évidentes.** Cliquez la cellule la plus fréquente et
   choisissez la lettre qu'elle représente à votre avis ; la suggestion
   sous une cellule n'est qu'un indice. Après chaque clic le texte
   partiel se met à jour : une mauvaise hypothèse se voit immédiatement
   — annulez-la et essayez la suivante.
3. **Trouver les mots.** Avec quelques lettres placées, des mots
   entiers s'illuminent. Le panneau liste les mots chiffrés dont la
   forme correspond à un mot anglais courant (correspondance par
   {{term:pattern-word}} — THE a la forme ABC, THAT ABCA) et ne montre
   que les candidats compatibles avec vos attributions. Un clic place
   le mot entier. Les lettres doublées et les mots d'une seule lettre
   (seulement A et I en anglais) sont des indices aussi.
4. **Combler les vides.** Les symboles rares viennent en dernier :
   laissez-vous guider par le texte partiel jusqu'à ce que chaque
   cellule soit prise.
5. **Terminé.** L'alphabet reconstitué apparaît ; s'il a la forme d'un
   mot-clé, l'assistant nomme le mot qu'il cache. « Utiliser cette clé »
   porte l'alphabet jusqu'à l'onglet Outil, qui déchiffre la suite.

L'outil n'attribue jamais une lettre de lui-même. Chaque clic est le
vôtre, et chaque clic peut être annulé — c'est voulu : le briser
soi-même, voilà la leçon.

## Ce que le mot-clé ajoute — et ce qu'il n'ajoute pas

Un mot-clé réduit les alphabets que le concepteur doit mémoriser, pas
ceux que l'attaquant doit considérer. L'analyse fréquentielle se moque
de la manière dont la permutation a été notée. Le mot-clé ne compte
qu'après coup : un alphabet reconstitué peut révéler le mot dont il
vient, ce qui est satisfaisant — et un avertissement sur le choix de
clés que votre texte chiffré peut avouer.
