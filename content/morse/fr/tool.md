# Le code Morse en bref

Le code Morse écrit chaque lettre et chaque chiffre sous la forme d'un
court motif de points et de traits. Conçu pour le télégraphe dans les
années 1830 et 1840, il est encore pratiqué aujourd'hui par les
radioamateurs. C'est un {{term:encoding}}, pas un chiffre : la table
est publique et il n'y a pas de clé. Cet outil suit l'alphabet
international (UIT).

## Utiliser l'outil

- Tapez votre texte dans {{control:message-input}} ; le Morse
  s'affiche dans {{control:output}}. Les lettres sont séparées par une
  espace et les mots par une barre oblique `/`.
- Les lettres A–Z et les chiffres 0–9 sont encodés. La ponctuation et
  les lettres accentuées sont supprimées.
- Choisissez les caractères dessinés pour le point et le trait avec
  {{control:dot-symbol}} et {{control:dash-symbol}} — les motifs ne
  changent pas.
- Appuyez sur {{control:swap}} pour décoder.
  Gardez une espace entre les lettres et une barre oblique entre les
  mots ; les caractères de point et de trait courants sont tous
  acceptés.

## Un exemple rapide

`SOS` devient `••• --- •••` : trois points, trois traits, trois
points. `MEET ME` devient `-- • • - / -- •` — notez la barre oblique
entre les deux mots.

## Pour aller plus loin

Les lettres les plus fréquentes ont les motifs les plus courts : E est
un seul point, T un seul trait.

- [Le fonctionnement du code Morse](/encoder/morse/learn) : rythme,
  silences et table complète
- [L'histoire du code Morse](/encoder/morse/history), de Samuel Morse
  au SOS
- [Exercices pratiques sur le code Morse](/encoder/morse/practice)
