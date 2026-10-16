# Fonctionnement de ROT13

## L'idée en une phrase

ROT13 est un chiffre de César dont le cadran est collé à un demi-tour
: chaque lettre avance de 13 places dans l'{{term:alphabet}}, donc A
devient N et N devient A.

## La recette

1. Comptez 13 positions après la lettre — ou ne comptez pas : la
   seconde moitié de l'alphabet est un miroir de la première.
2. Remplacez chaque lettre par sa partenaire. Espaces et majuscules
   restent en place.
3. Pour annuler, recommencez. Comme 13 + 13 = 26, appliquer ROT13
   deux fois est l'identité — l'opération est sa propre inverse.

## Un exemple détaillé

{{example:rot13-basic}}

HELLO devient URYYB. Regardez la colonne du décalage : chaque ligne
dit 13, et cette constance est tout le chiffre. Vérifiez la
symétrie : U revient à H, R revient à E — la même table tourne dans
les deux sens.

## La formule

```
chiffrer : y = (x + 13) mod 26
déchiffrer : y = (x + 13) mod 26   # la même ligne !
```

Cette répétition n'est pas un hasard : 13 est la moitié de 26, le
seul décalage qui apparie chaque lettre à exactement une partenaire
et s'inverse lui-même. Aucun autre décalage de César n'a cette
propriété.

## Obfuscation, pas chiffrement

Personne n'a jamais prétendu que ROT13 est sûr — ce serait absurde :
pas de clé, une correspondance fixe, annulation instantanée. Son
travail est le *confort* : un texte que l'œil de passage ne peut pas
lire par accident, mais que le lecteur volontaire dévoile sans
outil. Voyez-y un sac en papier sur la chute, pas un coffre autour
du trésor — les défis de l'onglet pratique s'ouvrent d'un clic.
