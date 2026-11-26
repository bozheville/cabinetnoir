# Déchiffrer le chiffre Rail fence

Pour déchiffrer un message Rail fence, il faut deux nombres : le nombre
de rampes et la rampe de départ. L'outil trace un {{term:zigzag}} vide
de la longueur du texte chiffré et compte les lettres qui tombent sur
chaque rampe. Il découpe ensuite le chiffré en rampes de ces longueurs
et relit le zigzag. Un mauvais réglage garde toutes les lettres, mais
les mélange.

## Utiliser l'outil de déchiffrement

- Collez le texte chiffré dans {{control:message-input}} ; le texte
  clair s'affiche dans {{control:output}}.
- Choisissez le nombre de rampes avec {{control:rails-picker}}, de 2 à
  10. La valeur par défaut est 3.
- Fixez la rampe de départ avec {{control:offset-picker}}. La clôture
  classique part de la rampe du haut, la valeur par défaut.
- Les espaces, les chiffres et la ponctuation sont supprimés. Le texte
  clair sort d'un seul bloc en majuscules : à vous de remettre les
  espaces entre les mots.
- Pour chiffrer une réponse, revenez en arrière avec {{control:swap}}.

## Un exemple rapide

`ACDTAKTANTAW` sur 3 rampes donne `ATTACKATDAWN`. Un zigzag de 12
lettres sur 3 rampes place 3 lettres en haut, 6 au milieu et 3 en bas.
Le chiffré se découpe donc en `ACD`, `TAKTAN` et `TAW`, et le zigzag y
reprend les lettres une à une.

Un mauvais réglage donne les mêmes lettres dans le mauvais ordre. Sur
4 rampes, le même chiffré donne `ADTAATCANWTK`. Sur 3 rampes avec un
départ à la rampe 1, il donne `TTAAKATCAWND`.

## Pas de clé ?

- [Casser un Rail fence sans la clé](/encoder/railFence/cryptanalysis) :
  faire défiler chaque nombre de rampes et chaque départ jusqu'à ce que
  le texte se lise
- [Le fonctionnement du chiffre Rail fence](/encoder/railFence/learn),
  rampe par rampe
- [L'histoire du chiffre Rail fence](/encoder/railFence/history), de la
  scytale à la guerre de Sécession
- [Exercices de déchiffrement sur le Rail fence](/encoder/railFence/practice)
- [Identifier un chiffre inconnu](/identify) si vous n'êtes pas sûr
  qu'il s'agisse d'un Rail fence
