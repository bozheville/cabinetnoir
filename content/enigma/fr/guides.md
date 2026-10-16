# Guides pas à pas

## Chiffrez votre premier message

1. Tapez votre message dans {{control:message-input}}. Seules les
   lettres A–Z voyagent — espaces, chiffres et ponctuation sont
   supprimés sans commentaire, exactement comme sur la vraie machine,
   qui n'avait pas de barre d'espacement.
2. Réglez la clé à trois lettres dans {{control:key}} — les positions
   de départ des rotors, par exemple `AAA`.
3. Lisez le résultat dans {{control:output}}. Les roues tournent
   toutes seules ; rien d'autre à régler.

## Déchiffrez un message reçu

1. Collez le cryptogramme dans {{control:message-input}}. Gardez-le
   en lettres nues — l'outil ignore tout le reste.
2. Réglez dans {{control:key}} la **même** clé à trois lettres que
   celle de l'expéditeur. Une clé erronée produit un bruit pur, pas
   une dégradation élégante.
3. Appuyez sur le bouton d'échange {{control:swap}} — ou pas. Une
   Enigma est sa propre inverse : chiffrer et déchiffrer sont la
   toute même opération ; le bouton d'échange n'existe que par
   symétrie avec les autres outils du site.

## Travaillez comme un clerc du livre de codes

1. Le vrai trafic était découpé : l'opérateur choisissait une *clé de
   message* aléatoire, chiffrait le message avec, et envoyait la clé
   de message (deux fois — une habitude devenue fatale) en tête de la
   transmission.
2. Pour simuler cela : chiffrez le corps avec un réglage de clé dans
   {{control:key}}, notez le texte chiffré, puis recommencez une
   nouvelle session avec la clé de message et chiffrez la clé à
   trois lettres elle-même. Le récepteur refaisait les étapes en
   sens inverse.
3. Chiffrez le même message sous deux clés différentes et comparez
   les sorties — aucun lien visible ne survit, et c'est exactement
   ce que le mouvement des rotors a pour but de garantir.
