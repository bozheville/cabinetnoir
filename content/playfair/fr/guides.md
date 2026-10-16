# Guides pas à pas

## Chiffrez votre premier message

1. Tapez votre message dans {{control:message-input}}.
2. Saisissez un mot-clé dans {{control:key}} — court et mémorable,
   comme SHADOW. Le mot-clé se dédoublonne et sème le carré.
3. Lisez les paires chiffrées dans {{control:output}} — l'outil les
   joint avec des espaces, et ces espaces sont décoratives : le
   déchiffrement les ignore.

## Déchiffrez un message reçu

1. Collez le cryptogramme dans {{control:message-input}} — avec ou
   sans espaces entre les paires, les deux marchent — et appuyez sur
   le bouton d'échange {{control:swap}}.
2. Saisissez exactement le mot-clé de l'expéditeur dans
   {{control:key}}. Le carré est toute la clé : un mauvais mot-clé
   donne un autre carré et du bruit pur.
3. Lisez le texte clair dans {{control:output}}. Méfiez-vous des deux
   artefacts : un I peut tenir la place d'un J, et un X peut être du
   bourrage plutôt qu'une lettre.

## Attaquer un message Playfair à la main

1. Comptez les lettres. Playfair demande du volume : ses statistiques
   de digraphes ne se réveillent que sur quelques centaines de
   lettres.
2. Si la clé est connue ou devinable (un nom, une unité, un mot de
   code), construisez simplement le carré et déchiffrez — voir les
   guides ci-dessus.
3. Sinon, c'est de l'analyse fréquentielle de digraphes
   d'école : TH, HE, AN, RE, ER et ON dominent les paires
   anglaises, et chaque digraphe deviné et placé dans le carré en
   contraint beaucoup d'autres. L'attaque est puissante mais
   patiente — les défis de l'onglet pratique vous donnent tous le
   mot-clé.
