# Histoire du chiffre affine

## Un décalage, remis d'aplomb

Le chiffre affine n'a ni inventeur attitré ni entrée en scène
spectaculaire : c'est la généralisation du décalage de César que les
mathématiques offrent gratuitement. Là où César glisse l'alphabet
(`x + b`), la règle affine multiplie avant de glisser (`a·x + b`) — et
le nom vient de la fonction affine de l'algèbre scolaire,
`f(x) = a·x + b`.

## Les mathématiques arrivent tard

Des chiffres de cette forme ont certainement circulé à l'âge des
manuscrits, mais la compréhension systématique est venue avec la
théorie des nombres. Travailler modulo 26, demander quels
multiplicateurs peuvent être défaits — lesquels ont un inverse
modulaire — est une question qu'Euler et Gauss jugeaient élémentaire.
Le chiffre est devenu un exercice de manuel : le plus petit système
où chiffrer est faire de l'arithmétique et la clé est une formule.

## Le portrait de famille

Posez `a` = 1 et le chiffre affine est César. Posez `a` = 1, `b` = 13
et c'est le décalage de ROT13. Posez `a` = 7, `b` = 0 et vous avez le
chiffre multiplicatif déjà catalogué par les cryptographes arabes. Le
chiffre affine est l'arbre généalogique dessiné comme une formule
unique — c'est pourquoi les enseignants l'adorent et les
cryptanalystes haussent les épaules.

## L'héritage : l'arithmétique comme clé

L'héritage véritable est conceptuel. L'affine fait de la clé un
morceau de mathématiques plutôt qu'une table ou un disque, et fait de
« la clé doit être défaisable » un énoncé démontrable (la co-primauté).
La cryptographie à clé publique — la percée de Diffie et Hellman en
1976, RSA un an plus tard — tourne sur le même instinct, avec
l'exponentiation à la place de la multiplication et des modules de
2048 bits à la place de 26.

{{timeline:affine}}
