# Briser le chiffre de César

Le chiffre de César est trivialement cassable, et cela vaut la peine de
comprendre pourquoi : il échoue non pas à cause d'un mauvais calcul,
mais parce qu'il conserve trop de structure. Les deux attaques
classiques ci-dessous ne demandent rien de plus que l'outil.

{{challenge:caesar-demo}}

## La faiblesse : un seul décalage pour tout

Chaque lettre se cache derrière le même {{term:shift}}. Quelles que
soient les statistiques du texte clair, le {{term:ciphertext}} les
conserve — simplement habillées d'autres lettres. La lettre la plus
fréquente du message reste la plus fréquente, seulement décalée ; le
rythme des mots répétés est toujours là. Une substitution unique
préserve tout du texte, sauf les lettres qu'il emploie.

## Attaque 1 — la force brute

Il n'existe que 25 décalages possibles (26 en comptant « pas de
chiffrement »). Parcourez-les :

1. Passez l'outil en mode déchiffrement avec {{control:swap}} et collez
   le cryptogramme dans {{control:message-input}}.
2. Faites glisser la rotation {{control:key}} de 1 à 25 et lisez
   {{control:output}} à chaque fois.
3. Le fragment lisible apparaît exactement une fois — quand la rotation
   correspond au décalage de l'expéditeur. Un œil humain finit le
   travail à partir de là.

Une attaque par {{term:brute-force}} ne demande aucune statistique :
c'est pourquoi tout chiffre moderne doit offrir un espace de clés bien
trop grand pour être parcouru.

## Attaque 2 — l'analyse fréquentielle

L'{{term:frequency-analysis}} évite les devinettes : comptez les
lettres du chiffré et comparez les comptages au profil connu de la
langue.

- En anglais, E est la lettre la plus fréquente — environ 12 % d'un
  texte long — suivie de T, A, O, I et N.
- Trouvez la lettre la plus fréquente du chiffré ; son écart avec E est
  le décalage le plus probable.
- Déchiffrez avec ce décalage et lisez. Si le texte est court et
  têtu, essayez plutôt l'écart vers T.

L'analyse fréquentielle fut décrite par le polymathe arabe Al-Kindi au
IXᵉ siècle, et elle casse tout chiffre par substitution à alphabet
unique — César n'est que le plus simple d'entre eux.

## Là où l'idée survit

L'échec de César a appris aux cryptographes la première grande leçon :
la clé doit modifier le texte de façon irrégulière. Les chiffres
suivants ont gardé l'idée du décalage mais l'ont fait varier lettre par
lettre — le chiffre de Vigenère est littéralement « beaucoup de
Césars », un par lettre de clé, et l'{{term:frequency-analysis}}
ci-dessus cesse de fonctionner sur lui tant qu'on n'a pas d'abord
retrouvé sa longueur de clé.
