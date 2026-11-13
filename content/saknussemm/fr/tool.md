# Le chiffre de Saknussemm en bref

Le chiffre de Saknussemm vient du roman de Jules Verne « Voyage au
centre de la Terre » (1864) : c'est le parchemin runique qui envoie le
professeur Lidenbrock en Islande. C'est une {{term:transposition}} en
deux temps. Le message est écrit à l'envers, puis les lettres
renversées sont distribuées en groupes en forme de colonnes : les
lettres restent les mêmes, seul leur ordre change.

## Utiliser l'outil

- Tapez votre message dans {{control:message-input}} ; les groupes
  s'affichent dans {{control:output}}, ligne par ligne, en police à
  chasse fixe.
- Seules les lettres sont gardées. Les espaces, les chiffres et la
  ponctuation sont supprimés.
- Réglez le nombre de lettres par groupe avec
  {{control:cluster-width-picker}} (de 2 à 12, 7 par défaut) et le
  nombre de groupes par ligne avec
  {{control:clusters-per-line-picker}} (de 2 à 6, 3 par défaut). Les
  valeurs par défaut reprennent la forme du parchemin.
- Avec {{control:load-parchment}}, le texte du roman remplit le champ
  de saisie.
- Appuyez sur {{control:swap}} pour déchiffrer avec la même forme. Les
  espaces entre les groupes aident l'outil à trouver les limites ; un
  bloc de lettres continu fonctionne aussi.

## Un exemple rapide

`SNEFFELS` avec 3 lettres par groupe et 2 groupes par ligne donne

```
SF LE
EN FS
```

À l'envers, SNEFFELS devient SLEFFENS ; distribuées en quatre groupes,
ses lettres donnent SF, LE, EN et FS.

## Pour aller plus loin

- [Le fonctionnement du chiffre de Saknussemm](/encoder/saknussemm/learn),
  pas à pas
- [L'histoire du chiffre de Saknussemm](/encoder/saknussemm/history), du
  roman de Verne aux livres d'énigmes
- [Exercices pratiques sur le chiffre de Saknussemm](/encoder/saknussemm/practice)
