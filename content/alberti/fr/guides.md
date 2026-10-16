# Guides pas à pas

## Chiffrez votre premier message

1. Tapez votre message dans {{control:message-input}}. Seules les 20
   lettres du disque sont chiffrées — H, J, K, U, W, Y sont supprimées,
   exactement comme sur le disque latin d'Alberti.
2. Réglez la longueur des groupes avec le curseur de période
   {{control:period}} et le saut du disque avec le curseur d'incrément
   {{control:increment}}.
3. Si vous voulez un autre alignement de départ, tournez le disque
   intérieur avec les flèches {{control:rotate-left}} et
   {{control:rotate-right}}.
4. Lisez le résultat chiffré dans {{control:output}} — en minuscules,
   comme le disque intérieur lui-même.

## Déchiffrez un message reçu

1. Collez le cryptogramme dans {{control:message-input}}.
2. Appuyez sur le bouton d'échange {{control:swap}} pour passer en mode
   déchiffrement.
3. Réglez la même période {{control:period}} et le même incrément
   {{control:increment}} que l'expéditeur, et ramenez les disques au
   même alignement de départ avec les flèches. Il faut les trois —
   période, incrément et alignement — pour défaire le chiffrement.
4. Lisez le message d'origine dans {{control:output}}.

## Brisez un message sans la clé

Le disque tourne à intervalles réguliers : les lettres à la même
position dans chaque groupe sont chiffrées avec la même substitution.
Cette régularité est la porte d'entrée :

1. Devinez la période : coupez le chiffré en groupes de cette longueur
   (commencez par 2 ou 3) et mettez les lettres de même position dans
   une même pile.
2. Chaque pile est une {{term:substitution}} simple — appliquez-y
   l'{{term:frequency-analysis}}. L'alphabet intérieur étant mélangé,
   une pile donne des paires de lettres plutôt qu'un simple décalage,
   mais deux ou trois paires résolues identifient l'alignement.
3. Réglez les disques sur cet alignement avec les flèches, saisissez
   la période {{control:period}} et l'incrément
   {{control:increment}}, puis déchiffrez. Mauvaise piste ? Essayez la
   période suivante — un message court peut en exiger plusieurs.
