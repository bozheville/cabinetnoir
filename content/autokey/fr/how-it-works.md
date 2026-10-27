# Fonctionnement du chiffre autokey

## L'idée en une phrase

Le chiffre autokey est ce que le « chiffre de Vigenère » était
réellement en 1586 : un chiffre de type Vigenère dont la {{term:key}}
sort du message lui-même. Il démarre avec une amorce — par exemple
`QUEEN` — et après ces cinq lettres, le flux de clé continue avec le
texte clair déjà écrit. La clé se nourrit d'elle-même ; voilà l'« auto »
d'autokey.

## La recette

1. Écrivez votre message et ne gardez que les lettres.
2. Choisissez une amorce — un court mot-clé, typiquement bien plus
   court que le message.
3. Construisez le {{term:keystream}} : l'amorce d'abord, puis votre
   propre texte clair ajouté à la suite.
4. Additionnez comme dans Vigenère : chaque lettre du texte clair plus
   la lettre du flux de clé au-dessus d'elle (avec rebouclage sur
   l'{{term:alphabet}}) donne le {{term:ciphertext}}.

## Un exemple détaillé

{{example:autokey-basic}}

Observez la colonne du flux de clé : `QUEENLY` s'épuise après six
lettres, et à partir de là chaque lettre de clé n'est que la lettre du
message datant d'une longueur d'amorce plus tôt. L'outil le montre en
direct : la rangée de flux de clé sous la saisie grandit avec votre
texte, la partie amorce surlignée.

## La formule

En numérotant A=0 … Z=25, avec le flux K bâti sur l'amorce et le texte
clair lui-même :

```
chiffre = (texte clair + clé) mod 26
clé[i] = amorce[i]                      pour i < longueur de l'amorce
clé[i] = texte clair[i − longueur]      ensuite
```

Le déchiffrement parcourt le même flux : récupérez le texte clair
lettre par lettre, et chaque lettre récupérée devient clé une longueur
d'amorce plus loin. Voilà pourquoi l'amorce est le secret entier — tout
le reste se régénère tout seul.

## Ce que ça rapporte — et ce que ça coûte

Le flux de clé ne répétant aucune période, les empreintes périodiques
de Vigenère (séquences répétées, gains d'{{term:index-of-coincidence}}
par tranche) disparaissent. Le chiffre résiste à l'attaque classique du
XIXe siècle.

Le prix, c'est la fragilité. Toute erreur de transmission se propage
dans toutes les lettres de clé suivantes, et tout le dispositif repose
sur un seul petit secret : si l'attaquant devine du texte clair
(« glissement » de {{term:crib}}), les lettres devinées *sont* de la
matière de clé et déroulent le reste du message — c'est exactement ce
que fait le décodeur guidé de l'outil, avec vous.
