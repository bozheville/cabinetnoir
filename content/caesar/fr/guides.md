# Guides pas à pas

## Chiffrez votre premier message

1. Tapez votre message dans {{control:message-input}}.
2. Faites glisser le curseur de rotation {{control:key}} pour choisir
   le décalage — 3 est le choix classique.
3. Décidez des deux cases : {{control:keep-spaces}} préserve la mise en
   page des mots et {{control:keep-case}} préserve les majuscules.
   L'outil supprime tout le reste.
4. Lisez le résultat chiffré dans {{control:output}}.

## Déchiffrez un message reçu

1. Collez le cryptogramme dans {{control:message-input}}.
2. Appuyez sur le bouton d'échange {{control:swap}} pour passer en mode
   déchiffrement.
3. Réglez le curseur de rotation {{control:key}} sur le décalage utilisé
   par l'expéditeur — il faut exactement le même nombre.
4. Lisez le message d'origine dans {{control:output}}.

## Brisez un message sans la clé

Un décalage est un nombre entre 1 et 25, donc une attaque par
{{term:brute-force}} demande au plus 25 essais — et souvent bien
moins :

1. Collez le cryptogramme dans {{control:message-input}} et passez en
   mode déchiffrement avec {{control:swap}}.
2. Faites glisser la rotation {{control:key}} dans les valeurs et
   observez {{control:output}} : du charabia, encore du charabia…
   jusqu'à ce qu'un mot lisible apparaisse.
3. Si parcourir tous les décalages vous semble de la triche, prenez le
   chemin malin : l'{{term:frequency-analysis}}. Trouvez la lettre la
   plus fréquente du chiffré (souvent le E chiffré), mesurez son
   écart avec E, réglez le décalage en conséquence et lisez une phrase
   pour vérifier.
