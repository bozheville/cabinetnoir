# Casser le carré de Polybe

Il n'y a pas d'onglet d'analyse pour ce chiffre — ce n'est pas un
oubli, c'est la leçon.

{{challenge:polybius-easy-1}}

## Le carré est une substitution qui porte une grille

Chaque lettre du texte clair correspond à un symbole fixe, toujours :
`E` est toujours `15` du carré simple, quoi qu'il y ait avant ou après.
Ramenez les paires aux lettres et vous tenez une {{term:substitution}}
ordinaire — le chiffre même dont la page Keyword enseigne le
démontage guidé.

## Le chemin d'entrée : la fréquence des paires

1. Comptez les paires du chiffré. Avec le carré simple, la paire la
   plus fréquente est E (`15`), puis T (`44`), A (`11`), O (`34`) —
   l'ordre anglais habituel portant des nombres.
2. Attribuez des lettres candidates aux paires fréquentes, exactement
   comme l'étape d'{{term:frequency-analysis}} du casseur de Keyword.
3. Quand le carré est clé, l'assignation *est* le carré : récupérez
   assez de lettres et la grille se remplit toute seule — puis le
   mot-clé se révèle comme dans le casseur de Keyword.

## Essayez dans l'application

Prenez un chiffré Polybe à carré clé, collez-le dans le casseur
**Keyword substitution** après avoir réécrit chaque paire comme sa
lettre du carré simple (ou n'importe quel repère fixe), et le plateau
d'assignation fait le reste. Les coordonnées changent le costume, pas
les faiblesses : un chiffre monoalphabétique reste monoalphabétique,
que ses symboles soient des lettres ou des nombres.

## Là où le carré devient dangereux

Seul, le carré est trivial. Enchaîné en fractionnement et
transposition — ADFGVX — ou doté d'une clé numérique périodique — le
chiffre nihiliste —, les mêmes 25 cases deviennent le substrat de
systèmes bien plus coriaces. Voilà pourquoi cette page existe :
enseigner une fois, proprement, l'idée de coordonnée avant que les
chiffres plus lourds ne l'empruntent.
