# Guides pas à pas

## Chiffrez votre premier message

1. Tapez votre message dans {{control:message-input}}.
2. Réglez le multiplicateur dans {{control:multiplier}} — essayez 3,
   choix classique premier avec 26.
3. Réglez le décalage dans {{control:shift}} — l'ajout à la César,
   toute valeur de 0 à 25.
4. Lisez le résultat dans {{control:output}}. La même lettre du texte
   clair donne toujours la même lettre chiffrée, mais la
   correspondance n'est plus un simple glissement.

## Déchiffrez un message reçu

1. Collez le cryptogramme dans {{control:message-input}} et appuyez
   sur le bouton d'échange {{control:swap}}.
2. Saisissez le même multiplicateur {{control:multiplier}} et le même
   décalage {{control:shift}} que l'expéditeur. L'outil calcule
   l'inverse multiplicatif pour vous — aucune arithmétique modulaire
   de votre côté.
3. Lisez le message d'origine dans {{control:output}}.

## Brisez un message sans la clé

Le chiffre affine reste une {{term:substitution}} fixe unique, il
tombe donc devant l'attaque classique — et devant un raccourci :

1. Si vous connaissez deux paires lettre clair → lettre chiffrée,
   résolvez la droite directement : soustrayez les deux équations
   pour éliminer `b`, puis divisez — c'est-à-dire multipliez par
   l'inverse modulaire — pour obtenir `a`.
2. `a` connu, retrouvez `b` depuis l'une des paires.
3. Saisissez les deux nombres dans {{control:multiplier}} et
   {{control:shift}}, passez en mode déchiffrement et lisez le
   message.
4. Aucune lettre connue ? Revenez à l'{{term:frequency-analysis}} : la
   lettre chiffrée la plus fréquente correspond à E (ou T, ou A), et
   chaque hypothèse sur une paire de candidates détermine une clé
   candidate à tester sur les lettres suivantes.
