# Guides pas à pas

## Chiffrez votre premier message

1. Tapez votre message dans {{control:message-input}}.
2. Choisissez une courte amorce et entrez-la dans {{control:key}} —
   quatre à six lettres, c'est typique.
3. Vérifiez le mode : le bouton d'échange {{control:swap}} bascule entre
   chiffrer et déchiffrer. L'en-tête montre le mode courant.
4. Lisez le résultat chiffré dans {{control:output}}. Seules les lettres
   sont chiffrées ; espaces et ponctuation sont supprimés.
5. Regardez la rangée de flux de clé sous les commandes : les lettres
   surlignées sont votre {{term:primer}}, et chaque lettre qui suit est
   votre propre message qui revient en guise de clé.

## Déchiffrez un message reçu

1. Collez le cryptogramme dans {{control:message-input}}.
2. Entrez dans {{control:key}} l'amorce qu'a utilisée l'expéditeur — il
   faut exactement la même amorce que celle du chiffrement.
3. Pressez le bouton {{control:swap}} pour passer en déchiffrement.
4. Lisez le message original dans {{control:output}}. La rangée de flux
   de clé repousse d'elle-même à partir du texte clair récupéré.

## Percer un message sans la clé

1. Ouvrez l'onglet Cryptoanalyse. Le décodeur guidé travaille par
   glissement de {{term:crib}} — deviner un mot et laisser la ruse de
   la clé du chiffre dérouler le message.
2. Étape 1 — devinez un mot probablement présent dans le texte (tapez-le
   dans {{control:crib-input}} ; les indices du défi en suggèrent un) et
   fixez la longueur d'amorce dans {{control:primer-length}}. Un mot
   aussi long que l'amorce révèle tout ; un plus court vous laisse
   quelques lettres.
3. Étape 2 — faites glisser le mot le long du texte dans
   {{control:offset-list}}. À chaque position, le chiffre implique un
   fragment de clé — dans l'autokey, ce fragment est du texte clair plus
   ancien, donc les positions lisibles sont les bonnes.
4. Étape 3 — le placement se déroule : les chaînes de texte clair se
   propagent dans les deux sens dans {{control:unroll-worksheet}}, et
   l'amorce apparaît au début. Tapez les lettres restantes dans
   {{control:primer-fill}}.
5. Étape 4 — vérifiez l'amorce assemblée, puis pressez
   {{control:use-this-key}}. L'outil déchiffre le message avec elle.
