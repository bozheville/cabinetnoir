# Base64 en bref

Base64 est un {{term:encoding}}, pas un chiffre : il transforme des
octets en une chaîne de 64 caractères sûrs, pour que des données
binaires traversent sans dommage un e-mail, une URL, du JSON ou du
HTML. Il n'a pas de clé : n'importe qui peut le décoder, il ne cache
rien.

## Utiliser l'outil

- Tapez ou collez du texte dans {{control:message-input}} ; la chaîne
  encodée s'affiche dans {{control:output}}.
- Il n'y a aucun réglage. L'alphabet est toujours `A–Z a–z 0–9 + /`,
  avec un ou deux signes `=` pour compléter la fin.
- Les espaces, les chiffres et la ponctuation sont encodés eux aussi :
  rien n'est supprimé. Le texte latin simple fonctionne le mieux : les
  caractères cyrilliques ou les emoji sortent de ce que l'outil sait
  encoder.
- Appuyez sur {{control:swap}} pour décoder. Si le
  décodage échoue, cherchez des caractères hors de l'alphabet, un `=`
  manquant ou un espace ramassé lors du copier-coller.

## Un exemple rapide

`MEETATNOON` devient `TUVFVEFUTk9PTg==`. Chaque groupe de 3 octets
donne 4 caractères ; le dernier groupe ne contient qu'un octet, d'où
les deux signes `=`.

## Pour aller plus loin

Une chaîne dont la longueur est un multiple de 4, faite uniquement de
lettres, de chiffres, de `+` et de `/`, terminée par `=` ou `==`, est
presque sûrement du Base64.

- [Le fonctionnement de Base64](/encoder/base64/learn), bit par bit
- [L'histoire de Base64](/encoder/base64/history), des premiers
  e-mails au web
- [Exercices pratiques sur Base64](/encoder/base64/practice)
