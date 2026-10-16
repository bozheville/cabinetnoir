# Guides pas à pas

## Chiffrez votre premier message

1. Tapez votre message dans {{control:message-input}}.
2. C'est toute l'installation — Atbash n'a pas de clé. Le sélecteur
   {{control:alphabet-selector}} choisit seulement quel alphabet est retourné
   (latin par défaut ; le miroir marche aussi sur l'allemand, le
   français, le russe et l'ukrainien).
3. Lisez le texte en miroir dans {{control:output}}.

## Déchiffrez un message reçu

1. Collez le cryptogramme dans {{control:message-input}} et appuyez
   sur le bouton d'échange {{control:swap}} — bien qu'ici ce soit une
   formalité : chiffrer et déchiffrer en Atbash sont la toute même
   opération.
2. Vérifiez que le même {{control:alphabet-selector}} que celui de
   l'expéditeur est sélectionné.
3. Lisez le message d'origine dans {{control:output}}.

## Reconnaissez un message Atbash

Il n'y a pas de clé à trouver, donc « casser » Atbash revient à le
*reconnaître* :

1. Lisez le charabia à l'envers — un texte en miroir lu à rebours
   montre souvent des formes de lettres suspectement familières.
2. Ou testez la correspondance fixe directement : passez en mode
   déchiffrement, collez le texte, et voyez si le sens apparaît. Une
   tentative suffit.
3. Retenez l'indice : un message où E ne s'accumule pas près des
   lettres chiffrées courantes, mais où la distribution des lettres
   ressemble quand même à une langue ordinaire — juste permutée —
   signale une correspondance fixe sans clé.
