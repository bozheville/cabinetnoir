# Déjouer le chiffre de Vigenère

La {{term:key}} qui se répète est ce qui rend le chiffre déchiffrable.
Cette page explique l'attaque ; chaque étape correspond à une étape de
l'assistant de déchiffrement de l'outil, pour suivre en lisant.

{{challenge:vigenere-demo}}

## La faille : la clé se répète

Le chiffrement décale la lettre *i* du texte clair avec la lettre *i*
de la clé — mais la clé est courte, si bien que la lettre *i+5* (avec
une clé de 5 lettres) est décalée par la *même* lettre de clé. Dès que
le texte clair contient la même lettre à deux positions distantes d'un
multiple de la longueur de la clé, le {{term:ciphertext}} montre aussi
la même lettre. Les textes longs répètent des groupes de lettres
courants (the, and, tion…), et ces répétitions trahissent la
{{term:key-length}}.

## Étape 1 — trouver la longueur de la clé

Deux signaux indépendants, tous deux affichés sur les cartes de
longueur de clé de l'assistant :

- **Les séquences répétées** — l'{{term:kasiski-examination}} : repérez
  les groupes de lettres qui apparaissent plusieurs fois, mesurez les
  distances entre eux, et cherchez les longueurs qui divisent beaucoup
  de ces distances. Si les écarts valent 12 et 18, la longueur de clé
  divise les deux — 6 est un meilleur choix que 36.
- **L'{{term:index-of-coincidence}}** — pour une longueur candidate N,
  découpez le texte en N tranches (une lettre sur N) et mesurez à quel
  point chaque tranche ressemble à l'anglais. L'anglais marque environ
  0,067, des lettres aléatoires environ 0,038. Quand N est la vraie
  longueur de clé, chaque tranche n'a été décalée que par *une seule*
  lettre et ressemble encore à l'anglais.

## Étape 2 — chaque tranche est un chiffre de César

Une fois la longueur de clé connue, chaque tranche est chiffrée avec
une seule lettre de clé — ce n'est plus qu'un chiffre de César, que
n'importe quel écolier déjoue. Le graphique de l'outil pose les
fréquences des lettres de la tranche face à la table anglaise :
tournez jusqu'à ce que les barres hautes se superposent aux barres de
référence, et la lettre affichée est la lettre de clé de cette tranche.
Une rotation par tranche, et la clé entière est sortie — regardez
l'aperçu devenir lisible à mesure que vous avancez.

## Un raccourci — les mots probables

Parfois on peut deviner un mot qui doit apparaître dans le texte clair
(une salutation, un nom, « attaque »). Placez le {{term:crib}} à une
position et soustrayez : chaque lettre du texte chiffré moins la
lettre devinée du texte clair est une lettre de clé. Une bonne
hypothèse révèle plusieurs lettres de clé d'un coup ; une mauvaise est
rejetée car elle se contredit.

## Les limites

- **Les textes courts mentent.** Avec peu de lettres par tranche,
  l'analyse fréquentielle devient de la devinette — c'est pourquoi
  l'assistant vous avertit et pourquoi un mot probable aide.
- **Les clés longues gênent.** Une clé aussi longue que le texte,
  utilisée une seule fois, est l'idéal sans
  {{term:substitution}} : le masque jetable, le seul chiffre dont
  l'invulnérabilité est démontrée. Vigenère avec une clé jetable *est*
  un masque jetable.
- **Tout le reste est de la comptabilité.** Dès que la longueur de clé
  est connue, le reste est mécanique — c'est exactement ce pour quoi
  l'assistant automatisait le calcul, pendant que vous prenez les
  décisions.
