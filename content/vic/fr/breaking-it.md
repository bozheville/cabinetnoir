# Casser le chiffre VIC

Personne n'a jamais cassé le chiffre VIC par la cryptanalyse. Le
message de la pièce creuse est resté illisible de 1953 à 1957. Le FBI
ne l'a lu qu'après la défection de Reino Häyhänen, l'espion à qui il
était destiné, qui a livré ses clés. Cette page explique pourquoi les
experts ont échoué, et ce que coûterait une attaque aujourd'hui.

{{challenge:vic-easy-1}}

## Pourquoi le FBI et la NSA n'ont pas pu le lire

Les cryptanalystes cherchent des régularités : une clé qui se répète,
une grille de taille fixe, des lettres trop fréquentes. Le chiffre VIC
a été conçu pour n'en laisser aucune.

1. **La clé ne se répète jamais.** Chaque message a son propre
   groupe-clé, et toute la clé en découle. Deux messages ne partagent
   donc jamais la même clé : il n'y a rien à superposer ni à comparer.
2. **Les lettres se cachent dans les chiffres.** L'échiquier donne un
   chiffre aux lettres fréquentes et deux aux lettres rares. Le message
   n'est qu'une suite de chiffres : impossible de compter les lettres
   comme d'habitude.
3. **Plusieurs verrous à la suite.** Après l'échiquier viennent deux
   transpositions, la seconde piégée. Leurs largeurs dépendent de
   secrets que l'attaquant n'a pas. Ouvrir un verrou laisse le message
   toujours fermé.
4. **Un seul message, aucune méthode.** En 1953, le FBI n'avait qu'un
   message et ignorait tout du système. Toutes les attaques classiques
   demandent davantage.

David Kahn le résume en 1961 : le chiffre n'est pas incassable en
théorie, mais il l'est en pratique sans connaître le système et avec un
seul message.

## Comment il a finalement été lu

Il a fallu un homme, pas une formule. En mai 1957, Häyhänen est
rappelé à Moscou. Il se rend plutôt à l'ambassade des États-Unis à
Paris et demande l'asile. Il explique le système au FBI et lui donne sa
phrase, sa date et son numéro personnel. Avec cela, le message du
nickel s'ouvre en quelques semaines.

Il mène aussi le FBI jusqu'à son chef, Rudolf Abel, arrêté à New York
en juin 1957. Le meilleur chiffre de son temps a cédé à la plus
ancienne des failles : les gens qui s'en servent.

## Ce que coûterait une attaque aujourd'hui

Supposons que vous connaissiez parfaitement le chiffre VIC. Il vous
faut encore les secrets. La plupart se concentrent dans une seule
ligne de dix chiffres de la feuille, la ligne H. Ajoutez le sixième
chiffre de la date et le numéro personnel : la clé vaut environ
38 bits, soit à peu près 300 milliards de possibilités.

Un ordinateur moderne les essaie toutes en moins d'une journée. Le VIC
ne résiste donc pas aux ordinateurs. Mais cette attaque suppose trois
choses que personne n'avait en 1953 : la méthode, un message chiffré
propre et beaucoup de puissance de calcul. Face à quelqu'un armé d'un
crayon et de papier, le VIC a tenu.

## Pourquoi ce site n'a pas de casseur VIC

Chaque casseur de ce site suit une faiblesse : une clé qui se répète,
une grille fixe, une lettre qui ne peut pas se chiffrer en elle-même.
Le chiffre VIC n'offre aucune faiblesse de ce genre. Un casseur pas à
pas n'aurait rien à montrer.

À la place, cochez **Montrer les calculs de clé** dans
[l'outil du chiffre VIC](/encoder/vic/direct). Vous verrez, ligne par
ligne, chaque étape que le FBI n'a pas pu défaire.

## En résumé

Le chiffre VIC marque le sommet des chiffres manuels. Il combine une
substitution, deux transpositions et une clé neuve pour chaque
message. Personne ne l'a cassé à son époque. Il n'a été lu que parce
qu'un transfuge a livré les clés.
