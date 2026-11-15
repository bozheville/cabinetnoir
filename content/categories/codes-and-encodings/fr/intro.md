## Ce qui unit la famille

Les codes et encodages transforment un texte en un autre alphabet selon une règle publique. Il n'y a pas de clé : quiconque connaît la table peut lire le message. Il s'agit donc de ce qu'on appelle {{term:encoding}}, et non de chiffrement. Le but est de faire passer un texte par un canal qui ne peut pas transmettre les lettres telles quelles, comme un fil télégraphique ou un ancien système de courrier électronique.

## Comment ça marche

Le [code Morse](/encoder/morse/learn) donne à chaque lettre un motif de signaux courts et longs : SOS s'écrit trois points, trois traits, trois points. Les lettres fréquentes reçoivent des motifs courts, donc E est un seul point et T un seul trait, ce qui rendait la transmission manuelle rapide. Le [Base64](/encoder/base64/learn) découpe les données en morceaux de 6 bits et écrit chacun d'eux avec l'un de 64 caractères sûrs ; le mot Hi devient SGk=, avec un signe égal comme remplissage à la fin.

Le chiffre de Bacon, qui écrit chaque lettre avec cinq symboles A ou B, et le code des prisonniers (tap code), qui frappe la ligne puis la colonne, arrivent bientôt.

## Comment on le casse

Rien n'est à casser : on cherche les symboles dans la table. La vraie compétence est la reconnaissance. Un texte fait uniquement de points, de traits et d'espaces est du Morse ; une suite de lettres, de chiffres, de signes plus et de barres obliques dont la longueur est un multiple de quatre, souvent terminée par = ou ==, est presque certainement du Base64. L'identificateur du cabinet repère les deux d'un coup. Un encodage peut néanmoins cacher un vrai chiffre en dessous : décodez d'abord, puis regardez ce qui en sort.

## Histoire

Le 24 mai 1844, Samuel Morse envoya « What hath God wrought » (« Ce que Dieu a forgé ») sur une ligne télégraphique de Washington à Baltimore. Le Base64 prit sa forme moderne dans les normes de courrier électronique MIME de 1992 à 1996, afin que des messages conçus pour du texte brut puissent transporter des images et des fichiers.
