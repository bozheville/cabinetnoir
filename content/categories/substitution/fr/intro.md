## Ce qui unit la famille

Un chiffrement par substitution remplace chaque lettre, ou chaque paire de lettres, par autre chose : une autre lettre, un nombre, un symbole. Les lettres gardent leur place dans le message ; seule leur identité change. La clé est la table de remplacement, et toute la famille tient à la manière dont cette table est construite et à la fréquence à laquelle elle change.

## Comment ça marche

Avec un décalage de 3 du [chiffre de César](/encoder/caesar/learn), HELLO devient KHOOR : chaque lettre avance de trois places dans l'alphabet. Un alphabet mélangé par [mot-clé](/encoder/keyword/learn), la grille du [Pigpen](/encoder/pigpen/learn), l'alphabet inversé de l'[Atbash](/encoder/atbash/learn) ou l'arithmétique du [chiffre affine](/encoder/affine/learn) sont d'autres façons de construire une table fixe. Le [chiffre de Vigenère](/encoder/vigenere/learn), le [chiffre de Beaufort](/encoder/beaufort/learn), l'[autoclave](/encoder/autokey/learn), le [disque d'Alberti](/encoder/alberti/learn) et la [machine Enigma](/encoder/enigma/learn) passent d'une table à l'autre au fil du message. Le [chiffre de Playfair](/encoder/playfair/learn) remplace des paires, et le [carré de Polybe](/encoder/polybius/learn) transforme les lettres en nombres.

## Comment on le casse

Une table fixe laisse fuir les fréquences des lettres de la langue : E, T et A transparaissent, et une méthode suffit à les lire : {{term:frequency-analysis}}. Plusieurs tables étalent ces fréquences, jusqu'à ce que le test de Kasiski et l'outil appelé {{term:index-of-coincidence}} les séparent à nouveau ; le [casseur de Vigenère](/encoder/vigenere/cryptanalysis) le montre pas à pas. La substitution par paires cache les lettres isolées mais laisse encore fuir les fréquences des paires, et c'est ainsi que [tombe le chiffre de Playfair](/encoder/playfair/cryptanalysis).

## Histoire

Suétone rapporte que Jules César décalait de trois ses lettres privées. Au IXe siècle, à Bagdad, Al-Kindi décrivit l'analyse fréquentielle, et la course entre de meilleures tables et de meilleures statistiques se poursuivit jusqu'à la machine Enigma et Bletchley Park.
