# Chiffre VIC : guides

## Guide 1 — votre premier message chiffré

1. Ouvrez l'outil et tapez un message : `ATTACK AT DAWN. BY DAWN I
   MEAN 0500.` La phrase, la date, le numéro personnel et le
   groupe-clé sont les quatre secrets — remplissez-les avec
   l'exemple Wikipédia : *Twas the night before Christmas*,
   `13/9/1959`, `6`, et tirez un groupe-clé.
2. Activez **Montrer les calculs de clé**. Suivez le programme vers le
   bas : le groupe-clé (A), les chiffres de la date (B), leur
   soustraction sans emprunt (C) — chaque infobulle nomme
   l'opération.
3. Regardez l'échiquier en bas : `A` siège sous `5`, `T` sous `9`, et
   les cases vides sous `6` et `8` étiquettent les rangées enjambées.
   Les chiffres de votre message sont épelés par ce plateau.
4. La sortie est en groupes de cinq chiffres, votre groupe-clé caché
   dedans — comptez depuis la fin pour le trouver (le sixième chiffre
   de la date dit jusqu'où).

## Guide 2 — déchiffrer avec les quatre secrets

1. Passez en mode déchiffrement et collez les groupes. Trois secrets
   sont mémorisés (phrase, date, numéro personnel) ; le groupe-clé se
   lit dans le message lui-même — regardez le champ se remplir seul.
2. Décodez, puis coupez les `X` finaux : c'est du bourrage qui a
   poussé le compte de chiffres à un multiple de cinq.
3. Cassez-le exprès : changez un seul chiffre secret et redécodez. La
   sortie s'effondre en bruit — chaque étape dépend de chaque secret,
   et c'est là tout l'intérêt d'un chiffre produit.

## Guide 3 — concevez votre échiquier

1. La rangée du haut de l'échiquier est un moyen mnémotechnique de
   votre choix : jusqu'à huit lettres et deux cases vides. `AT ONE
   SIR` donne A, T, O, N, E, S, I, R — les lettres anglaises les plus
   fréquentes, un chiffre chacune.
2. Les cases vides décident de tout le reste : leurs chiffres
   d'en-tête deviennent des étiquettes de rangées, et les lettres
   restantes, le point et le signe de bascule remplissent deux
   rangées de plus.
3. Passez l'alphabets en cyrillique et la même mécanique tourne sur
   l'échiquier de Häyhänen lui-même : `СНЕГОПА` — le début de
   *снегопад*, la tourmente de neige — avec trois cases vides et
   trois rangées enjambées.

## Guide 4 — la bisection, le verrou en plus de Kahn

1. Activez **Bisecter le message** et réglez la coupe à 20. Chiffrez :
   le cryptogramme change du tout au tout, car les moitiés ont
   échangé leurs places avant l'écriture du moindre chiffre.
2. Envoyez l'index de coupe à votre correspondant hors canal — convenu
   d'avance, comme les autres secrets. Sans lui, même le bon échiquier
   lit le message à l'envers.
3. C'était le renforcement final facultatif du système historique :
   bon marché pour l'agent, dévastateur pour l'analyste, car il
   détruit la dernière structure qui restait — la position des mots
   dans le message.
