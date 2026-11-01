# Fonctionnement du chiffre rail fence

## L'idée en une phrase

Rail fence est la {{term:transposition}} la plus simple à imaginer : les
lettres parcourent une clôture en diagonale, rebondissant entre la
rampe du haut et celle du bas, et le chiffre est constitué des rampes
lues l'une après l'autre, de haut en bas.

## La recette

1. Choisissez un nombre de rampes, par exemple 3, et écrivez le texte
   clair en diagonale : `A` sur la rampe 1, `T` sur la rampe 2, `T` sur
   la rampe 3, `A` de retour sur la rampe 2, et ainsi de suite — le
   {{term:zigzag}}.
2. Avec `ATTACKATDAWN`, la clôture se remplit ainsi :
   rampe 1 : `A · C · D`, rampe 2 : `T · A · K · T · A · N`,
   rampe 3 : `T · A · W`.
3. Lisez les rampes de haut en bas : `ACD`, puis `TAKTAN`, puis `TAW`.
4. Le chiffre est `ACDTAKTANTAW`. Le déchiffrement est la même marche en
   sens inverse : comptez combien de lettres possède chaque rampe,
   découpez le chiffre en conséquence et parcourez à nouveau la
   clôture.

## Un exemple détaillé

{{example:railFence-basic}}

Chaque ligne suit une lettre du texte clair : sur quelle rampe elle se
trouve et à quelle position du chiffre elle aboutit. Remarquez comme
les trois premières lettres du chiffre ne sont que la rampe du haut —
la clôture laisse sa forme entière en pleine vue.

## La variante décalée

La clôture classique commence toujours sur la rampe du haut — la
première lettre du chiffre est toujours la première lettre du message,
un cadeau pour l'attaquant. Le décalage déplace la rampe de départ :
avec 3 rampes et un décalage de 1, le zigzag commence sur la rampe du
milieu en descendant. Même clôture, une chose de plus à essayer.

## Pourquoi c'est la rampe d'accès, pas la forteresse

La clé tient en deux petits nombres. Même le réglage maximal ici — dix
rampes — ne fait que dix fois une poignée d'essais, et chaque essai se
juge à savoir si le texte se lit. Voilà pourquoi rail fence est la
première transposition idéale à casser à la main, et le déchiffreur
guidé en fait un simple curseur.
