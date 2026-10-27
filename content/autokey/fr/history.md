# Histoire du chiffre autokey

## L'idée de Bellaso, 1553

En 1553, Giovan Battista Bellaso publie le chiffre que le monde rebaptisa
plus tard du nom de Vigenère : une table d'alphabets mélangés convenue
par mot-clé, avec une phrase-clé facile à retenir. Bellaso proposa aussi
une astuce plus forte — utiliser le message lui-même pour continuer la
clé. Cette variante est le plus ancien autokey connu : la clé qui ne se
répète jamais, parce qu'elle grandit avec le texte qu'elle chiffre.

## La version de Vigenère, 1586

En 1586, Blaise de Vigenère décrit dans son *Traicté des chiffres* une
construction à auto-clé : une lettre d'amorce démarre le flux de clé et
le texte clair lui-même l'étend. La plaisanterie de l'histoire : le
chiffre qui porte le nom de Vigenère — le schéma simple à clé répétée —
n'est *pas* celui qu'il a décrit ; celui qu'il a décrit (l'autokey) ne
porte le nom de personne. Voir la page d'histoire de Vigenère pour toute
l'histoire de la mauvaise attribution.

## Pourquoi ça n'a pas conquis le monde

L'autokey est réellement plus solide face aux attaques par recherche de
période qui ont tué le schéma à clé répétée — mais il est fragile sur le
terrain. Chaque erreur de transmission corrompt la clé à partir de ce
point, l'émetteur et le récepteur doivent rester en parfait pas, et un
seul mot deviné déroule le message de l'intérieur. Les diplomates et les
armées du XIXe siècle préférèrent en général des systèmes qui se
dégradent avec grâce.

## La postérité

L'idée refusa de mourir. Les flux de clé nourris par le message (ou par
le chiffre, dans la forme voisine d'*autokey sur le chiffre*)
réapparurent dans la cryptographie à machines puis dans la conception
des chiffres de flux modernes — le principe général qu'un flux de clé
doit être imprévisible et ne jamais se répéter est exactement ce que
Bellaso avait pressenti en 1553, avec quatre siècles d'avance.

{{timeline:autokey}}
