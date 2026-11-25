# Chiffre VIC : guides pas à pas

## Guide 1 : chiffrer votre premier message

1. Tapez un message dans {{control:message-input}}, par exemple
   `ATTACK AT DAWN. BY DAWN I MEAN 0500.`
2. Reprenez les secrets de l'exemple de Wikipédia. **Phrase** : *Twas
   the night before Christmas*. **Date** : `13/9/1959`. **Numéro
   perso** : `6`. **Groupe-clé** : `72401`. (Pour un vrai message, vous
   cliqueriez plutôt sur **Tirer un nouveau groupe-clé**.)
3. Des groupes de cinq chiffres apparaissent dans {{control:output}}.
   C'est votre message chiffré.
4. Cochez **Montrer les calculs de clé**. Lisez la feuille de haut en
   bas : le groupe-clé (ligne A), les chiffres de la date (ligne B) et
   leur différence (ligne C). Survolez une ligne pour voir comment elle
   est calculée.
5. Descendez jusqu'à l'échiquier. `A` est sur le `5`, `T` sur le `9`.
   Les cases vides sont sur le `6` et le `8` : chaque lettre des
   rangées du bas commence donc par `6` ou `8`.
6. Cherchez votre groupe-clé dans le résultat. Comptez cinq groupes
   depuis la fin : c'est le sixième chiffre de la date, `5`, qui fixe
   la position.

## Guide 2 : déchiffrer avec les secrets

1. Cliquez sur {{control:swap}} pour passer au déchiffrement. Collez
   les groupes de cinq chiffres.
2. Saisissez la phrase, la date et le numéro personnel. Ne touchez pas
   au groupe-clé : l'outil le lit dans le message et remplit le champ
   tout seul.
3. Le texte clair apparaît. S'il se termine par quelques `X`,
   supprimez-les. Ils servaient seulement à obtenir un nombre de
   chiffres multiple de cinq.
4. Changez maintenant un chiffre de la date et regardez à nouveau. Le
   texte devient illisible. Chaque étape dépend de chaque secret : le
   VIC est un {{term:product-cipher}}.

## Guide 3 : essayer l'échiquier de Häyhänen

1. Ouvrez **Alphabet** et choisissez l'échiquier cyrillique.
2. Regardez la rangée du haut : `СНЕГОПА`. Ce sont les sept premières
   lettres de *снегопад*, « chute de neige » en russe. Häyhänen
   utilisait exactement ce mot.
3. L'échiquier latin a deux cases vides, le cyrillique en a trois. Il
   a donc trois rangées du bas, assez pour un alphabet plus long et
   quelques signes en plus.
4. Tapez un court message en russe et chiffrez-le. Déchiffrez-le
   ensuite pour vérifier qu'il revient intact. L'échiquier utilise
   l'alphabet russe : les lettres ukrainiennes comme І ou Ї sont
   supprimées.

## Guide 4 : couper le message en deux

1. Cochez **Couper le message en deux** et réglez **Couper à** sur `20`.
2. Chiffrez le même message qu'au guide 1. Le résultat change
   complètement : l'outil a inversé les deux moitiés du texte avant de
   chiffrer.
3. Votre correspondant a besoin de ce nombre lui aussi. Convenez-en à
   l'avance, comme des autres secrets.
4. Déchiffrez en laissant l'option décochée. Le message sort avec ses
   moitiés dans le mauvais ordre. Recochez-la avec la même coupe : le
   texte se lit de nouveau normalement.
