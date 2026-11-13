# Le chiffre de César en bref

Le chiffre de César remplace chaque lettre par celle qui se trouve un
nombre fixe de rangs plus loin dans l'{{term:alphabet}}. C'est un
chiffre par {{term:substitution}} à clé unique — le décalage — et
celui que Jules César employait, avec un décalage de 3, pour sa
correspondance militaire.

## Utiliser l'outil

- Tapez ou collez votre texte dans {{control:message-input}} ; le
  résultat s'affiche dans {{control:output}} au fil de la frappe.
- Faites glisser le curseur de rotation pour choisir le décalage, de 1
  à 25. Pour déchiffrer, il faut le même décalage que l'expéditeur.
- Choisissez l'alphabet : latin, allemand, français, russe ou
  ukrainien. La plage du curseur suit la longueur de l'alphabet.
- Cochez {{control:keep-spaces}} ou {{control:keep-case}} pour
  préserver les espaces entre les mots et les majuscules. Les chiffres, la
  ponctuation et les lettres absentes de l'alphabet choisi sont
  supprimés.
- Passez du chiffrement au déchiffrement avec {{control:swap}}.

## Un exemple rapide

Avec un décalage de 3, `MEETATNOON` devient `PHHWDWQRRQ` : M passe à
P, E à H, T à W, et l'alphabet reboucle après Z.

## Pour aller plus loin

Un décalage n'a que 25 valeurs possibles : un message chiffré par
César tombe en quelques minutes sous une attaque par
{{term:brute-force}}.

- [Le fonctionnement du chiffre de César](/encoder/caesar/learn), pas
  à pas
- [L'histoire du chiffre de César](/encoder/caesar/history), de
  Suétone à al-Kindi
- [Exercices pratiques sur le chiffre de César](/encoder/caesar/practice)
