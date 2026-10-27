# Casser le chiffre de Saknussemm

Saknussemm semble impénétrable — du latin à rebours en groupes
runiques — et c'est en fait la transposition la plus facile à casser
de ce site, parce que l'espace des clés tient dans deux petits
nombres.

## La faille : une transposition pure

Le chiffre ne substitue jamais une seule lettre : la
{{term:ciphertext}} est toujours une anagramme du {{term:plaintext}}.
Les seuls secrets sont le sens de lecture (à rebours — mais la
suggestion d'Axel est la première chose que tout solveur essaie) et la
forme (lettres par groupe, groupes par ligne). Tous deux vivent dans
un espace minuscule : une dizaine de valeurs plausibles chacun,
explorables à la main en quelques minutes.

## L'attaque — anagrammez la grille

1. **Comptez les lettres.** Si chaque lettre de la langue apparaît
   avec sa fréquence normale, aucune substitution n'est à l'œuvre —
   profilez d'abord, transposez ensuite. Sur ce site, /identify
   rapporte exactement cela.
2. **Lisez à rebours.** Renversez tout le flot de lettres ; pour du
   latin — ou n'importe quel texte — la fin montre souvent une
   signature ou un mot-clé, ce qui ancre le sens de lecture.
3. **Balayez la forme.** Renversez le flot, puis essayez des nombres
   de groupes qui découpent le texte en lignes régulières : le
   parchemin imprime 21 groupes, donc 7 lettres par groupe et 3 par
   ligne. La bonne forme est celle dont les groupes, lus côte à côte,
   épellent du latin renversé.
4. **Surveillez l'indice.** Des rangées bien assemblées se lisent
   comme une langue ; une forme presque juste produit du bruit. Il
   n'y a aucune clé à retrouver au-delà de la forme — dès que les
   rangées se lisent, le message est cassé.

## L'unique défi

{{challenge:saknussemm-parchment}}

## Pourquoi il n'y a pas de casseur ici

Les cassers guidés de ce site parcourent des espaces de clés qui
méritent d'être guidés — alphabets, disques, permutations de
colonnes. Tout l'espace de clés de Saknussemm tient dans deux petits
entiers qu'on peut balayer à la main avec les sélecteurs de forme,
et son unique défi d'entraînement est un texte que tout lecteur du
roman possède déjà. Un casseur n'automatiserait que le balayage ; le
parchemin mérite le travail à la main.

## Ce que Saknussemm enseigne

Le professeur de Verne garde les runes secrètes pendant des semaines
et cède devant le truc le plus simple du manuel : lire à rebours. Le
chiffre est une leçon d'humilité — une sécurité qui repose sur le
fait que l'adversaire n'essaie pas la deuxième chose évidente n'est
pas une sécurité du tout.
