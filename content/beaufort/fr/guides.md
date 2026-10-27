# Guides pas à pas

## Chiffrez votre premier message

1. Tapez votre message dans {{control:message-input}}.
2. Choisissez n'importe quel mot comme secret et entrez-le dans
   {{control:key}} — plus la clé est longue, plus elle résiste.
3. Vérifiez le mode : le bouton d'échange {{control:swap}} bascule entre
   chiffrer et déchiffrer. L'en-tête montre le mode courant.
4. Choisissez la variante dans {{control:variant-select}} : Beaufort
   classique ou variante. Le classique est auto-réciproque — le même
   mode dans les deux sens.
5. Lisez le résultat chiffré dans {{control:output}}. Seules les lettres
   sont chiffrées ; espaces et ponctuation sont supprimés.
6. Observez la {{term:tabula-recta}} sous les commandes : la cellule
   surlignée est la recherche ligne-colonne exacte qu'effectue votre
   première lettre.

## Déchiffrez un message reçu

1. Collez le cryptogramme dans {{control:message-input}}.
2. Entrez dans {{control:key}} la clé qu'a utilisée l'expéditeur — il
   faut exactement la même clé que celle du chiffrement.
3. Le Beaufort classique n'exige aucun changement de mode : chiffrer le
   cryptogramme avec la même clé *est* le déchiffrement. Si l'expéditeur
   a utilisé la variante, pressez le bouton {{control:swap}}.
4. Lisez le message original dans {{control:output}}.

## Percer un message sans la clé

1. Ouvrez l'onglet Cryptoanalyse. Le décodeur guidé suit les mêmes
   étapes que celui de Vigenère, avec une torsion : chaque tranche est
   comparée à une courbe de fréquence *inversée*, car Beaufort soustrait
   dans l'autre sens.
2. Étape 1 — la longueur de clé : les séquences répétées du texte sont
   surlignées ; choisissez la carte la plus confiante dans
   {{control:key-length-cards}}. Mauvais choix ? Revenez et essayez
   une autre.
3. Étape 2 — les lettres de clé : pour chaque tranche dans
   {{control:slice-tabs}}, tournez le graphique avec
   {{control:chart-arrows}} jusqu'au score le plus haut. Les lettres
   s'accumulent dans {{control:key-strip}}. Bloqué ? Une proposition
   dans {{control:crib-input}} peut révéler plusieurs lettres d'un coup.
4. Étape 3 — vérifiez la clé assemblée : corrigez toute lettre
   directement dans la bande de clé, puis pressez
   {{control:use-this-key}}.
5. L'outil déchiffre le message avec votre clé.
