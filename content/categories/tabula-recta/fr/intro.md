## Ce qui unit la famille

Le [chiffre de Vigenère](/encoder/vigenere/learn), le [chiffre de Beaufort](/encoder/beaufort/learn) et l'[autoclave](/encoder/autokey/learn) partagent une même table de 26 × 26, appelée {{term:tabula-recta}} : chaque ligne est l'alphabet décalé d'une place de plus. Une lettre de la clé choisit la ligne, la lettre du message choisit la colonne, et la case où elles se croisent donne le chiffré. Les trois chiffres ne diffèrent que par leur manière de lire la table et par l'origine de leur clé.

## Comment ça marche

Clé LEMON sur ATTACK : A sous L donne L, T sous E donne X, T sous M donne F, et ainsi de suite, donc ATTACK devient LXFOPV. La clé se répète autant que nécessaire. Le chiffre de Beaufort soustrait le message de la clé au lieu de l'additionner, ce qui rend le chiffrement et le déchiffrement identiques. L'autoclave utilise une courte amorce, puis le message lui-même comme suite de la clé, si bien que la clé ne se répète jamais.

## Comment on le casse

Une clé répétée répète ses motifs. L'écart entre les fragments répétés, mesuré par la méthode dite {{term:kasiski-examination}}, et l'outil appelé {{term:index-of-coincidence}} donnent la longueur de la clé ; chaque colonne tombe ensuite devant une simple analyse fréquentielle. Le [casseur de Vigenère](/encoder/vigenere/cryptanalysis) et le [casseur de Beaufort](/encoder/beaufort/cryptanalysis) détaillent les deux étapes. L'autoclave n'a pas de période à trouver, mais sa clé est faite de langue, si bien que des mots devinés et l'amorce le cassent à la place : voir le [casseur d'autoclave](/encoder/autokey/cryptanalysis).

## Histoire

Jean Trithème imprima la table dans sa *Polygraphia* en 1508. En 1553, Giovan Battista Bellaso publia le chiffre à clé que le monde attribua plus tard à Blaise de Vigenère, lequel décrivit une version autoclave en 1586. Charles Babbage cassa la clé répétée vers 1854 et garda le secret pour lui ; Kasiski publia la méthode en 1863.
