# Fonctionnement du chiffre de Beaufort

## L'idée en une phrase

Le chiffre de Beaufort est le jumeau miroir de Vigenère : même
{{term:key}} répétée, même idée de {{term:tabula-recta}}, mais la
soustraction est inversée. Là où Vigenère calcule
chiffre = texte clair + clé, Beaufort calcule chiffre = clé − texte
clair. Ce signe retourné rend le chiffre auto-réciproque : la même
opération chiffre et déchiffre.

## La recette

1. Écrivez votre message et ne gardez que les lettres (l'outil supprime
   les espaces et la ponctuation de la même façon).
2. Écrivez la clé sous le message, lettre par lettre, en la répétant
   jusqu'à ce que les deux lignes aient la même longueur.
3. Pour chaque paire, soustrayez la position de la lettre du texte clair
   de celle de la lettre de clé : la lettre de clé compte les lignes, la
   lettre du texte clair compte les colonnes à rebours.
4. Lisez les lettres d'arrivée — c'est le texte chiffré.

## Un exemple détaillé

{{example:beaufort-basic}}

Lisez la première ligne : sous la lettre de clé **L**, la lettre du
texte clair **A** tombe sur **L** encore (L − A = L). La deuxième lettre
est soustraite de **E**, la troisième de **M**, et après la cinquième
lettre la clé recommence — exactement le rythme de
{{term:key-length}} de Vigenère.

## La formule

En numérotant A=0 … Z=25, le chiffrement soustrait et reboucle sur
l'{{term:alphabet}} :

```
chiffre = (clé − texte clair) mod 26
```

Comme la même formule avec les opérandes échangés déchiffre
(`texte clair = clé − chiffre`), Beaufort est {{term:reciprocal}} : une
seule recherche sert aux deux sens. L'outil reste dans un seul mode —
chiffrez un message avec une clé, puis chiffrez le résultat encore une
fois avec la même clé : le texte clair revient.

## La variante

Le **Beaufort variante** inverse la soustraction dans l'autre sens :
`chiffre = texte clair − clé`. Il déchiffre avec
texte clair = chiffre + clé — la même arithmétique que Vigenère avec
chaque lettre de clé négative. Conséquence pour la
{{term:cryptanalysis}} : statistiquement, la variante est
indiscernable de Vigenère, tandis que le Beaufort classique laisse sa
propre empreinte (les tranches s'ajustent à des courbes de fréquence
*inversées*). Le sélecteur de variante de l'outil bascule entre les
deux ; le décodeur suit.

## Sa place dans la famille

Vigenère, Beaufort et Beaufort variante partagent le même moteur : une
courte clé répétée sur une {{term:tabula-recta}} décalée ou inversée.
Qui connaît l'un connaît les trois — la différence tient au sens de la
soustraction.
