# Histoire du Base64

## Le problème : le courriel ne pouvait pas porter des octets

Le courrier électronique des années 1980 supposait le texte des plus
vieux protocoles : lignes de caractères imprimables, pas d'octets
au-dessus de 127, pas de binaire brut. Les pièces jointes — images,
exécutables, archives — ne pouvaient tout simplement pas voyager. La
solution devait parler la langue du canal : réécrire chaque octet en
texte imprimable.

## MIME apporte la réponse (1992–1996)

Le standard MIME de Nathaniel Borenstein — conçu pour que le courriel
porte du contenu riche — définissait une famille d'« encodages de
transfert de contenu » et choisissait 64 caractères comme compromis :
assez grand pour limiter la surcharge, assez petit pour esquiver tous
les caractères que les passerelles mutilaient. La spécification MIME
de 1996 (RFC 2045) a figé l'alphabet exact, et les pièces jointes
Base64 ont commencé à inonder les boîtes de réception.

## Du courriel à partout

Une fois standardisé, Base64 a quitté la boîte aux lettres. Les Data
URLs incorporent des images dans les feuilles de style ; les jetons
JWT portent leurs charges JSON en sections Base64 ; bases de
données, journaux et API stockent des octets en texte. La RFC 4648
(2006) a consolidé la famille des encodages de base et formalisé les
variantes — dont le cousin sûr pour les URL, qui échange `+` et `/`
contre `-` et `_`.

## La leçon qui est restée

Chaque génération redécouvre la même erreur : voir une sortie Base64
et l'appeler chiffrement. C'est un uniforme de coursier, pas une
armure — l'encodage existe pour que les données survivent au voyage,
et il se défait tout aussi facilement à l'arrivée. Ce site le garde
en compagnie de vrais chiffres précisément pour que la différence
soit impossible à manquer.

{{timeline:base64}}
