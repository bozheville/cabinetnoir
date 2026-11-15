## Ce qui unit la famille

Les disques chiffrants et les machines à rotors changent l'alphabet mécaniquement. Un anneau ou une roue tourne, et avec lui toute la table de substitution se décale, si bien que le chiffre passe d'un alphabet à l'autre sans table écrite. La clé est la position de départ des roues et la règle qui les fait tourner.

## Comment ça marche

Le [disque d'Alberti](/encoder/alberti/learn) se compose de deux anneaux de lettres concentriques. On les aligne sur une lettre repère convenue, on lit quelques lettres, puis on tourne l'anneau intérieur vers une nouvelle position, annoncée par une majuscule dans le chiffré. La [machine Enigma](/encoder/enigma/learn) a automatisé l'idée avec des roues électriques ; chacune est un {{term:rotor}}. Un rotor avance à chaque frappe, les autres avancent comme un compteur kilométrique, et un réflecteur renvoie le courant à travers eux. Tapez AAAA et les lampes affichent presque à chaque fois une lettre différente, mais jamais A, car le réflecteur ne laisse jamais une lettre se chiffrer en elle-même.

## Comment on le casse

Les roues qui tournent cachent bien les fréquences des lettres, mais chaque machine laisse ses propres régularités. Le disque d'Alberti ne change d'alphabet que sur instruction, donc un long passage sur un même réglage tombe devant l'analyse fréquentielle ; le [casseur d'Alberti](/encoder/alberti/cryptanalysis) montre comment. Enigma a été cassée par sa structure et par ses opérateurs : des clés de message répétées, la règle qui veut qu'aucune lettre ne se chiffre en elle-même, et des mots probables, des mots connus comme ceux des bulletins météo, qui permettaient à des machines de tester des milliers de réglages de rotors.

## Histoire

Leon Battista Alberti décrivit son disque en 1467, premier chiffrement polyalphabétique imprimé. Arthur Scherbius fit breveter Enigma en 1918. En décembre 1932, Marian Rejewski, du bureau du chiffre polonais, reconstitua son câblage, et à Bletchley Park Alan Turing conçut la bombe qui lut le trafic allemand jusqu'à la fin de la guerre.
