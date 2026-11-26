# Déchiffrer le chiffre par mot-clé

Pour déchiffrer un message par mot-clé, il faut le mot-clé, ou bien
l'alphabet chiffré complet qui en découle. Le déchiffrement lit les
deux alphabets dans l'autre sens : on cherche la lettre chiffrée sur la
bande du bas et on prend la lettre au-dessus. Un mauvais mot-clé
construit un autre alphabet : une partie des lettres, ou toutes,
sortent fausses.

## Utiliser l'outil de déchiffrement

- Collez le texte chiffré dans {{control:message-input}} ; le texte
  clair s'affiche dans {{control:output}}.
- Saisissez le mot-clé dans {{control:keyword-input}}. La casse ne
  compte pas : `kryptos` et `KRYPTOS` donnent le même résultat.
- Cochez {{control:free-alphabet-toggle}} si vous avez l'alphabet
  chiffré entier plutôt qu'un mot-clé. Le bouton « Utiliser ce
  résultat » de l'onglet de cryptanalyse le remplit pour vous.
- Cochez {{control:continuation-toggle}} seulement si l'expéditeur a
  poursuivi l'alphabet après la dernière lettre du mot-clé.
- Vérifiez {{control:alphabet-strip}} : pour déchiffrer, lisez-la de
  la ligne du bas vers celle du haut.
- Les espaces et les majuscules restent toujours ; les chiffres et la
  ponctuation sont supprimés.
- Pour chiffrer une réponse, revenez en arrière avec {{control:swap}}.

## Un exemple rapide

`KNNKYDKNPKVG` avec le mot-clé `KRYPTOS` donne `ATTACKATDAWN`. Sur la
bande, K se trouve sous A et N sous T.

Une clé presque juste montre précisément les lettres qu'elle touche.
`KRYPTON` donne `AGGACKAGDAWN` : seuls les T sont faux, car N se
trouve désormais sous une autre lettre du clair. Le bon mot-clé avec
{{control:continuation-toggle}} coché donne `AYYACPAYDAIS`.

## Pas de clé ?

- [Casser un chiffre par mot-clé sans la clé](/encoder/keyword/cryptanalysis) :
  reconstituer l'alphabet lettre par lettre grâce à
  l'{{term:frequency-analysis}}
- [Le fonctionnement du chiffre par mot-clé](/encoder/keyword/learn),
  avec les deux bandes d'alphabet
- [L'histoire du chiffre par mot-clé](/encoder/keyword/history), et
  comment Marie Stuart a perdu face au comptage des lettres
- [Exercices de déchiffrement sur le chiffre par mot-clé](/encoder/keyword/practice)
