# Déchiffrer le carré de Polybe

Pour déchiffrer un message en carré de Polybe, il faut le carré de
l'expéditeur : le carré A–Z simple, ou le mot-clé qui l'a mélangé.
L'outil coupe les chiffres en paires et lit chaque paire comme une
ligne et une colonne. Avec un mauvais carré, chaque paire tombe quand
même sur une lettre : on obtient des lettres lisibles, mais sans sens.

## Utiliser l'outil de déchiffrement

- Collez les chiffres dans {{control:message-input}} ; les lettres
  s'affichent dans {{control:output}}.
- Laissez vide le champ « Clé du carré » pour le carré simple, ou
  tapez le mot-clé de l'expéditeur.
- Les espaces entre les paires ne comptent pas : `23 15` et `2315`
  donnent le même résultat. Tout ce qui n'est pas un chiffre est
  ignoré.
- Un chiffre isolé à la fin n'a pas de partenaire : il est supprimé.
- I et J partagent une case : un J du message d'origine revient sous
  la forme d'un I.
- Le carré sous les réglages met en évidence la case de la dernière
  paire.
- Pour chiffrer une réponse, revenez en arrière avec {{control:swap}}.

## Un exemple rapide

`23 15 31 31 34` dans le carré simple donne `HELLO`. La première paire
désigne la ligne 2, colonne 3 : la case du H.
`11 44 44 11 13 25 11 44 14 11 52 33` donne `ATTACKATDAWN`.

Un mauvais carré n'a pas l'air faux. Avec la clé du carré `NIGHT`, le
même `23 15 31 31 34` donne `CTFFM`. Le double L reste un double F,
car un carré ne fait que renommer les lettres.

## Pas de clé ?

- [Casser un carré de Polybe à clé](/encoder/polybius/cryptanalysis) :
  attribuer des lettres aux paires les plus fréquentes, et le carré se
  remplit au fur et à mesure
- [Le fonctionnement du carré de Polybe](/encoder/polybius/learn),
  ligne par ligne
- [L'histoire du carré de Polybe](/encoder/polybius/history), des
  torches grecques aux murs des prisons
- [Exercices de déchiffrement sur le carré de Polybe](/encoder/polybius/practice)
- [Identifier un chiffre inconnu](/identify) si les chiffres peuvent
  venir d'un autre système
