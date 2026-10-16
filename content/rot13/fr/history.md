# Histoire de ROT13

## Né sur Usenet

ROT13 n'a jamais été inventé par un cryptographe — il a évolué sur
les débuts d'internet. Dans les années 1980, le système de
discussion Usenet avait besoin d'un moyen de publier des blagues
potentiellement choquantes et des spoilers de films ou de livres
sans les gâcher pour les lecteurs pressés : le texte devait être
présent sans être lisible par accident. Un décalage de César fixé à
13 était la réponse évidente, et le groupe `net.jokes` en a fait une
convention.

## Pourquoi 13 et pas 3

Deux raisons, toutes pratiques. D'abord, 13 est sa propre inverse —
la même procédure cache et révèle, ce qui permettait aux lecteurs
d'utiliser une seule commande (ou un coup d'œil à une roue imprimée)
dans les deux sens. Ensuite, 13 déplace chaque lettre hors de sa
place : avec un alphabet pair, seul le demi-tour apparie chaque
lettre à une partenaire différente, aucune lettre ne se trahit en
restant sur place.

## Un outil, pas un secret

Des années 1980 aux années 1990, ROT13 est devenu un élément de la
nétiquette : avertissements de spoiler, indices d'énigmes, chutes de
blagues, réponses aux quiz. Unix a gagné une commande `rot13` ; les
lecteurs de news l'ont intégrée. Les professionnels de la sécurité la
citent comme l'exemple canonique que *l'obfuscation n'est pas le
chiffrement* — et les poseurs d'énigmes la gardent canonique pour
exactement la même raison.

## Toujours en rotation

Des décennies plus tard, la roue continue de tourner : les journaux
de transparence des certificats y cachent des noms d'hôtes, les
énigmes de géocaching s'en servent, et chaque nouveau programmeur
écrit sa propre ROT13 comme exercice de jeunesse. Le plus vieux
cache-chute d'internet est aussi le plus longtemps vivant.

{{timeline:rot13}}
