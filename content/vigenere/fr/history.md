# Histoire du chiffre de Vigenère

## Les premières idées polyalphabétiques

Utiliser plusieurs alphabets à tour de rôle fut le grand saut de la
cryptographie de la Renaissance. Vers 1467, l'architecte et
cryptographe italien Leon Battista Alberti propose un disque de
chiffrement : deux roues de lettres superposées, tournées entre les
mots pour qu'une même lettre ne soit pas toujours chiffrée de la même
façon. Quelques décennies plus tard, l'abbé allemand Johannes
Trithemius publie la *tabula recta* — la table carrée des 26 alphabets
de décalage qu'utilisent encore les chiffres de type Vigenère — dans
son livre de stéganographie *Polygraphia* (1508).

## Bellaso, pas Vigenère

Le chiffre qu'on appelle aujourd'hui Vigenère fut décrit en 1553 par
Giovan Battista Bellaso, qui associa la tabula recta à une phrase clé
facile à retenir et nota qu'il fallait changer souvent de clé. En
1586, le diplomate français Blaise de Vigenère publie sa propre
variante, plus forte, à auto-clé. L'histoire s'est trompée
d'attribution : le chiffre à clé répétée porte le nom de Vigenère, et
le nom est resté.

## « Le chiffre indéchiffrable »

Pendant près de trois siècles, le chiffre fut connu sous le nom de *le
chiffre indéchiffrable*. Il fut largement utilisé pour la
correspondance diplomatique, et longtemps la réputation fut méritée :
tant que la clé était aussi longue que le message et jamais réutilisée,
les méthodes ci-dessous ne fonctionnent pas.

## La chute

La clé répétée est la faille. Charles Babbage comprend en 1854 comment
retrouver la clé à partir d'un texte anglais chiffré, probablement pour
déjouer une annonce chiffrée dans la presse, mais il ne publie jamais.
En 1863, l'officier prussien Friedrich Kasiski publie la même méthode
générale — c'est pourquoi l'examen des séquences répétées porte son
nom. Dans les années 1920, l'indice de coïncidence de William Friedman
transforme la détection de longueur de clé en statistique mesurable, et
le chiffre devient un exercice de manuel.

{{timeline:vigenere}}

## Sources

- [Chiffre de Alberti — Wikipédia](https://en.wikipedia.org/wiki/Alberti_cipher)
- [Tabula recta — Wikipédia](https://en.wikipedia.org/wiki/Tabula_recta)
- [Chiffre de Vigenère — Wikipédia](https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher)
- [Examen de Kasiski — Wikipédia](https://en.wikipedia.org/wiki/Kasiski_examination)
- [Indice de coïncidence — Wikipédia](https://en.wikipedia.org/wiki/Index_of_coincidence)
- David Kahn, *The Codebreakers* (1967), chapitres sur les chiffres de la Renaissance.
