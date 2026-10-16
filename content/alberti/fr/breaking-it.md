# Briser le chiffre d'Alberti

Le chiffre par disque fut un bond en avant : une
{{term:substitution}} qui change pendant l'écriture déjoue le simple
comptage des lettres qui a cassé César. Mais le schéma d'Alberti
tourne le disque à intervalles *fixes*, et cette régularité laisse une
empreinte. Cette page montre comment l'empreinte livre la clé.

{{challenge:alberti-demo}}

## La faiblesse : le disque tourne comme une horloge

Après chaque groupe de `period` lettres, le disque intérieur saute
d'exactement `increment` positions. Ainsi la lettre n° 1 de chaque
groupe a toujours été lue à travers un même alignement, la lettre n° 2
à travers un autre, et ainsi de suite. Coupez le texte par position
dans le groupe et vous obtenez `period` piles — et chaque pile
redevient un chiffre monoalphabétique ordinaire, comme les tranches de
l'attaque Vigenère ultérieure.

## Attaque 1 — trancher par position dans le groupe

1. Devinez la période (2 ou 3 est courant) et coupez le chiffré en
   groupes de cette longueur.
2. Rassemblez les lettres de même position — la première lettre de
   chaque groupe dans la pile 1, la deuxième dans la pile 2…
3. Appliquez l'{{term:frequency-analysis}} à chaque pile. Une pile
   associe les lettres du texte clair à des positions d'un alphabet
   *mélangé* : elle révèle donc des paires de lettres plutôt qu'un
   décalage — mais deux ou trois paires résolues suffisent à fixer
   l'alignement du disque.
4. Reconstituez la clé : l'alignement, la période et l'incrément.
   Saisissez-les dans l'outil et déchiffrez.

## Attaque 2 — la force brute, en douceur

Tout est petit : une période de 1 à 4, un incrément de 1 à 10,
24 alignements. Si un message résiste, parcourez les combinaisons :

1. Fixez la période et l'incrément, passez l'outil en mode
   déchiffrement avec {{control:swap}}.
2. Tournez les disques avec les flèches jusqu'à ce que le
   {{term:ciphertext}} commence à dire quelque chose. L'alignement est
   la partie la plus sensible — un pas change chaque lettre.
3. Toujours rien ? Changez de période et recommencez. Une marche par
   {{term:brute-force}} sur quelques centaines de combinaisons était
   hors de portée des ennemis d'Alberti, et elle vous coûte des
   secondes.

## Ce qu'Alberti a vraiment résolu

Avant le disque, l'{{term:frequency-analysis}} d'Al-Kindi rendait tout
chiffre à alphabet unique transparent. La réponse d'Alberti — changer
d'alphabet pendant le message — est l'idée racine de toute la
cryptographie polyalphabétique. Ses successeurs ont gardé l'idée et
l'ont régularisée : au lieu d'un disque mélangé tourné à la main, une
tabula recta tournée par une lettre de clé. Ce descendant régularisé
est le chiffre de Vigenère — plus simple à utiliser, et plus simple à
casser, mais bâti sur la même rotation.

## Le mélange, un surcroît d'astuce

Notez que le disque intérieur n'est pas un alphabet décalé mais un
alphabet *mélangé* (**mqihfdbacegklnprtuz&xyso**). Le mélange tue le
raccourci « distance avec E » dans chaque pile : l'attaquant doit
résoudre de vraies substitutions, pas des décalages. C'est la première
apparition d'un truc que des chiffres ultérieurs (Playfair entre
autres) réutilisent — et le rappel que la conception de la clé, et non
sa longueur, fut la vraie invention d'Alberti.
