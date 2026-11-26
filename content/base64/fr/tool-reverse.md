# Décoder le Base64

Pour décoder du Base64, il ne faut ni clé ni réglage. Chaque groupe de
4 caractères redonne 3 octets, et l'outil affiche ces octets comme du
texte. Une faute de frappe ne brouille que les lettres voisines. Un
caractère hors de l'alphabet bloque le décodage.

## Utiliser l'outil de décodage

- Collez la chaîne Base64 dans {{control:message-input}} ; le texte
  décodé s'affiche dans {{control:output}}.
- La casse compte. `T` et `t` sont deux valeurs différentes : une
  chaîne recopiée en minuscules donne du charabia.
- Les espaces et les retours à la ligne dans la chaîne sont ignorés.
  Un `=` final manquant ne pose pas de problème non plus.
- Le décodage échoue sur un caractère hors de `A–Z a–z 0–9 + /`, ou
  sur un mauvais remplissage, par exemple un seul `=` là où il en
  faut deux.
- Chaque octet devient un caractère latin. Un texte qui contenait du
  cyrillique ou des emoji ressort en lettres étranges comme `Ð` et
  `Ñ`.
- Pour encoder une réponse, revenez en arrière avec {{control:swap}}.

## Un exemple rapide

`TUVFVEFUTk9PTg==` donne `MEETATNOON`. Les 4 premiers caractères,
`TUVF`, redonnent les 3 premières lettres, `MEE`.

Une faute reste locale. Remplacez le `P` vers la fin par un `O` :
`TUVFVEFUTk9OTg==` donne `MEETATNONN`. Une seule lettre est fausse : la
neuvième, un O, est devenue N.

## Ce n'est peut-être pas du Base64 ?

Il n'y a pas de clé à trouver. Si une chaîne se décode proprement,
vous l'avez lue.

- [Identifier un chiffre inconnu](/identify) si la chaîne pourrait
  être autre chose
- [Le fonctionnement de Base64](/encoder/base64/learn), bit par bit
- [L'histoire de Base64](/encoder/base64/history), des premiers
  e-mails au web
- [Exercices de décodage sur Base64](/encoder/base64/practice)
