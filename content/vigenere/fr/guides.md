# Guides pas à pas

## Chiffrez votre premier message

1. Tapez votre message dans {{control:message-input}}.
2. Choisissez un mot comme secret et saisissez-le dans {{control:key}} —
   une clé plus longue est plus difficile à casser.
3. Vérifiez le mode : le bouton d'échange {{control:swap}} bascule entre
   chiffrer et déchiffrer. L'en-tête montre le mode courant.
4. Lisez le résultat chiffré dans {{control:output}}. Seules les lettres
   sont chiffrées ; les espaces et la ponctuation sont supprimés.

## Déchiffrez un message reçu

1. Collez le cryptogramme dans {{control:message-input}}.
2. Saisissez la clé qu'a utilisée l'expéditeur dans {{control:key}} — il
   faut exactement la même clé que pour le chiffrement.
3. Appuyez sur le bouton d'échange {{control:swap}} pour passer en mode
   déchiffrement.
4. Lisez le message original dans {{control:output}}.

## Brisez un message sans la clé

1. Ouvrez l'onglet Cryptanalyse. L'assistant guidé s'y ouvre.
2. Étape 1 — la longueur de la clé : les séquences répétées du texte
   sont surlignées ; choisissez la carte la plus fiable parmi
   {{control:key-length-cards}}. Mauvais choix ? Retournez en arrière et
   essayez-en une autre.
3. Étape 2 — l'alphabet : l'assistant vérifie si l'alphabet de
   {{control:alphabet}} explique chaque tranche. S'il convient,
   gardez-le ; sinon (l'expéditeur a utilisé un alphabet mélangé),
   choisissez « Le reconstruire » dans {{control:alphabet-mode}}.
4. Étape 3 — reconstruire l'alphabet (seulement si vous le
   reconstruisez) : choisissez deux tranches dans
   {{control:column-pair}}, puis dans {{control:link-board}}
   cliquez une lettre de la première tranche et la lettre de la seconde
   qui représente la même lettre du clair. Les liens remplissent
   {{control:alphabet-ring}} ; un lien contradictoire est signalé en
   rouge. Regardez {{control:merged-ic}} monter vers l'anglais, et
   placez les lettres rares à la main depuis
   {{control:loose-letters}}.
5. Étape 4 — les lettres de clé : pour chaque tranche de
   {{control:slice-tabs}}, faites tourner le graphique avec
   {{control:chart-arrows}} jusqu'au score de correspondance le plus
   élevé. Les lettres se rassemblent dans {{control:key-strip}}.
   Bloqué ? Une hypothèse dans {{control:crib-input}} peut révéler
   plusieurs lettres à la fois.
6. Étape 5 — vérifiez la clé assemblée : corrigez directement une
   lettre dans la bande de clé, puis appuyez sur
   {{control:use-this-key}}.
7. L'outil déchiffre le message avec votre clé.
