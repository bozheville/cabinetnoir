# Décoder le code Morse

Pour décoder du Morse, il ne faut pas de clé : l'outil cherche chaque
motif dans la table internationale (UIT). Ce qui compte, ce sont les
silences. Une espace termine une lettre, une barre oblique termine un
mot. Un silence oublié ou en trop donne d'autres lettres, pas une
erreur.

## Utiliser l'outil de décodage

- Collez le Morse dans {{control:message-input}} ; les lettres
  s'affichent en majuscules dans {{control:output}}.
- Les sélecteurs de point et de trait disparaissent dans ce mode.
  `.`, `*` et `•` se lisent tous comme un point, `-`, `_` et `~` comme
  un trait.
- Mettez une espace entre les lettres et une barre oblique `/` entre
  les mots. Les espaces autour de la barre sont facultatives.
- Un motif absent de la table est supprimé sans avertissement. Des
  lettres écrites sans espace se fondent en un seul long motif, lu
  comme une autre lettre ou supprimé.
- Pour encoder une réponse, revenez en arrière avec {{control:swap}}.

## Un exemple rapide

`-- • • - / -- •` donne `MEET ME`, et `••• --- •••` donne `SOS`.
`-- . . - / -- .`, tapé avec de simples points, donne lui aussi
`MEET ME`.

Les silences comptent autant que les signaux. Supprimez l'espace entre
les deux E : `-- •• - / -- •` donne `MIT ME`, car deux points de suite
font un I. Remplacez la barre oblique par deux espaces, et les mots se
collent en `MEETME`.

## Ce n'est peut-être pas du Morse ?

Il n'y a pas de clé à trouver. Une fois les silences bien placés, le
message est lu.

- [Identifier un chiffre inconnu](/identify) si les points et les
  traits pourraient vouloir dire autre chose
- [Le fonctionnement du code Morse](/encoder/morse/learn) : rythme,
  silences et table complète
- [L'histoire du code Morse](/encoder/morse/history), de Samuel Morse
  au SOS
- [Exercices de décodage sur le code Morse](/encoder/morse/practice)
