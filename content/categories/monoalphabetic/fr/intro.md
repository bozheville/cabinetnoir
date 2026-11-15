## Ce qui unit la famille

Un chiffrement monoalphabétique utilise un seul alphabet pour tout le message, ce qu'on appelle un {{term:cipher-alphabet}}. Chaque A devient le même symbole, chaque B un autre, de la première lettre à la dernière. La clé est la table, et dès que l'on connaît une seule paire, on la connaît partout dans le texte.

## Comment ça marche

Les tables les plus simples sont mathématiques : le décalage du [chiffre de César](/encoder/caesar/learn) et le [ROT13](/encoder/rot13/learn) font glisser l'alphabet, tandis que l'[Atbash](/encoder/atbash/learn) et le [chiffre affine](/encoder/affine/learn) le projettent le long d'une droite. Le [chiffre à mot-clé](/encoder/keyword/learn) construit une table mélangée à partir d'un mot : avec KEYWORD, l'alphabet commence par K E Y W O R D A B C…, et HELLO devient AOGGJ. Le [Pigpen](/encoder/pigpen/learn) remplace les lettres par des formes découpées dans une grille, mais c'est toujours une table fixe, simplement dessinée au lieu d'être écrite.

## Comment on le casse

Une table fixe garde les empreintes de la langue. Comptez les symboles : le plus fréquent est probablement E, un mot d'une seule lettre isolé est A ou I, et les lettres doubles comme le GG de AOGGJ trahissent LL, EE ou SS. La méthode qui complète le reste, avec les mots à motif, est la suivante : {{term:frequency-analysis}}. Un alphabet mélangé a bien trop de clés pour les essayer une à une, mais il tombe devant les statistiques aussi vite qu'un décalage ; le [casseur du chiffre à mot-clé](/encoder/keyword/cryptanalysis) montre comment.

## Histoire

Au IXe siècle, Al-Kindi rédigea la première description connue de l'analyse fréquentielle, et dès lors un alphabet unique vivait en sursis. En 1586, un alphabet de nomenclateur fixe portait les lettres du complot de Babington, et son déchiffrement condamna Marie Stuart, reine d'Écosse. La réponse de la Renaissance fut d'utiliser plus d'un alphabet.
