# Fonctionnement du code Morse

## Un encodage, pas un chiffre

Le code Morse est l'exemple classique de ce que ce site appelle une
{{term:encoding}} : chaque lettre devient un motif public, que
n'importe qui peut annuler — pas de clé, pas de secret. Son but est
la *transmission*, pas la discrétion : un message devait survivre à
un fil qui ne savait alterner qu'un clic et un silence.

## L'idée en une phrase

Chaque lettre de l'alphabet devient un court motif de deux longueurs
de signal — le {{term:dot}} (court) et le {{term:dash}} (long, trois
points de long) — et le motif est choisi pour que les lettres
courantes restent courtes.

## La recette

1. Cherchez la lettre dans la table : E, la lettre anglaise la plus
   courante, reçoit un seul point ; T un seul trait ; Z paie quatre
   symboles.
2. Envoyez le motif, puis marquez une pause d'une unité pour
   séparer les lettres.
3. Entre les mots, la pause est plus longue — en Morse écrit, cette
   pause est la barre oblique : `... --- ...` sont trois lettres,
   `.../---/...` marque une frontière de mot.
4. Chaque chiffre reçoit son propre motif de cinq symboles.

## Un exemple détaillé

{{example:morse-basic}}

SOS est célèbre précisément parce qu'il est si peu coûteux à envoyer :
trois points, trois traits, trois points — les espaces portant le
rythme.

## Les conventions de l'outil

L'outil écrit les lettres avec une espace simple entre elles et une
barre oblique entre les mots, exactement comme ci-dessus. Les deux
sélecteurs choisissent quels caractères jouent le point et le trait —
l'encodage est identique, seule l'encre change. En mode déchiffrement,
l'outil est tolérant : `.`, `*` et `•` se lisent tous comme des
points, `-`, `_` et `~` comme des traits — vous pouvez coller du Morse
de n'importe quelle source.

## Pourquoi la table a cette forme

Les longueurs des lettres ne sont pas arbitraires — c'est une analyse
fréquentielle des années 1840. Vail a compté les lettres dans une
casse d'imprimeur et donné aux lettres les plus courantes les motifs
les plus courts : E vaut un point, T un trait, tandis que Q et Z
paient quatre symboles. Un message en anglais ordinaire prend
simplement moins d'antenne. C'est la même intuition statistique qui
alimentera plus tard l'{{term:frequency-analysis}} — braquée sur le
fil plutôt que sur le cryptogramme.
