# Guides pas à pas

## Chiffrez votre premier message

1. Tapez votre message dans {{control:message-input}} — lettres,
   ponctuation et majuscules sont bienvenues ; le chiffre ne garde
   que les lettres.
2. Choisissez la forme : {{control:cluster-width-picker}} décide
   combien de lettres contient chaque groupe,
   {{control:clusters-per-line-picker}} combien de groupes imprime
   chaque ligne. La forme propre au parchemin est 7 et 3 — les
   réglages par défaut.
3. Lisez le champ {{control:output}} : les groupes apparaissent ligne
   par ligne, séparés par des espaces, dans une police à chasse fixe
   pour que les écarts restent visibles.

## Déchiffrez un message reçu

1. Appuyez sur le bouton d'échange {{control:swap}} pour passer en
   mode déchiffrement.
2. Collez la cryptogramme dans {{control:message-input}}. Les espaces
   entre les groupes se lisent comme des frontières — gardez-les si
   vous pouvez. Un bloc plein de lettres marche aussi ; l'outil le
   découpe avec la règle de forme en cours.
3. Réglez la forme utilisée par l'expéditeur avec
   {{control:cluster-width-picker}} et
   {{control:clusters-per-line-picker}}. Une forme erronée brouille
   les rangées : les lettres sont toutes là, mais dans la mauvaise
   grille.
4. Lisez le {{term:plaintext}} dans {{control:output}} — le dernier
   renversement se fait automatiquement.

## Rejouez le parchemin

1. En mode chiffrement, appuyez sur {{control:load-parchment}} : la
   page se remplit du message latin qu'Axel déchiffre — « descends
   dans le cratère du Yoculis, au Snaeffels… »
2. Regardez l'outil produire les groupes brouillés de Saknussemm,
   puis appuyez sur {{control:swap}} : les groupes passent dans
   l'entrée et le côté sortie montre de nouveau le latin —
   l'aller-retour est exact.
3. Appuyez maintenant sur {{control:load-parchment}} en mode
   déchiffrement : le même bouton charge la dictée du roman —
   « mm.rnlls esruel seecJde… ». L'outil la lit avec la forme 7×3 et
   retrouve le message latin jusqu'aux bizarreries du parchemin : la
   transcription du roman porte la ponctuation dans les cases de la
   grille et saute une lettre corrodée.
