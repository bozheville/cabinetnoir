# Guides pas à pas

## Encodez n'importe quoi

1. Tapez ou collez n'importe quel texte — espaces, ponctuation,
   chiffres, tout — dans {{control:message-input}}. Base64 n'a ni
   réglage ni clé.
2. Lisez la chaîne encodée dans {{control:output}}. L'alphabet est
   toujours `A–Z a–z 0–9 + /`, avec `=` en bourrage final.

## Décodez une chaîne

1. Collez le Base64 dans {{control:message-input}} et appuyez sur le
   bouton d'échange {{control:swap}}. Aucun réglage à rater.
2. Lisez le texte décodé dans {{control:output}}.
3. Si le décodage échoue, la chaîne n'est probablement pas du Base64
   valide : cherchez des caractères hors de l'alphabet, un bourrage
   `=` manquant, ou une espace glissée dans la copie.

## Repérer du Base64 dans la nature

1. Longueur divisible par 4, uniquement lettres, chiffres, `+`, `/`
   et `=` à la fin — cette combinaison est l'empreinte.
2. Une fin en `==` signifie que le dernier groupe portait un seul
   octet ; un `=` isolé, deux.
3. Retenez la leçon de cette page : reconnaître l'encodage est
   instantané, le décoder est instantané — Base64 est un emballage de
   transport, pas une serrure.
