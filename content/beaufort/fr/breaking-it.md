# Percer le chiffre de Beaufort

La {{term:key}} répétée rend le chiffre perçable — et l'attaque est
celle de Vigenère avec un demi-tour de miroir. Cette page explique
l'attaque ; chaque étape a son pendant dans le décodeur guidé de
l'outil, pour suivre la lecture en direct.

{{challenge:beaufort-demo}}

## Le défaut : la clé se répète

Le chiffrement soustrait la lettre *i* du texte clair de la lettre de
clé *i* — mais la clé est courte, si bien que la lettre *i+5* (avec une
clé de 5 lettres) est soustraite de la *même* lettre de clé. Le
{{term:ciphertext}} est périodique, et la périodicité trahit la
{{term:key-length}} exactement comme pour Vigenère.

## Étape 1 — trouver la longueur de clé

Les deux signaux classiques fonctionnent sans changement :

- **Les séquences répétées** — l'{{term:kasiski-examination}} : repérez
  des groupes de lettres présents plusieurs fois, mesurez les distances
  entre eux, cherchez les longueurs qui divisent beaucoup de ces
  distances.
- **L'{{term:index-of-coincidence}}** — pour une longueur N candidate,
  découpez le texte en N tranches (une lettre sur N) et mesurez leur
  ressemblance avec l'anglais. La mesure est aveugle au sens de la
  soustraction — elle ne voit que l'*irrégularité* des comptes de
  lettres — donc elle vaut pour Beaufort comme pour Vigenère.

## Étape 2 — chaque tranche est un César en miroir

La longueur de clé connue, chaque tranche a été chiffrée par une seule
lettre de clé — mais ses lettres ont été *réfléchies* avant (ou après)
le décalage. La différence pratique : quand l'outil compare les comptes
de lettres d'une tranche à la table de fréquences anglaise, les barres
hautes s'alignent avec les barres de référence *dans l'autre sens*.
Tournez jusqu'à ce que la courbe inversée s'ajuste, et la lettre affichée
est la lettre de clé de la tranche. Un cryptanalyste qui oublie le
miroir récolte de la soupe alphabétique ; le graphique du décodeur
dessine simplement la courbe inversée.

(Pour le **Beaufort variante**, pas de miroir du tout — ses tranches se
comportent exactement comme celles de Vigenère, d'où leur
indiscernabilité statistique.)

## Un raccourci — les mots probables

Un mot deviné marche ici aussi, soustraction inversée : chaque lettre du
texte chiffré *plus* la lettre devinée du texte clair donne une lettre de
clé (pour la variante, texte chiffré *moins* la devinette). Le panneau de
mots probables de l'outil fait l'arithmétique pour la variante en cours.

## Les limites

- **Les textes courts mentent.** Avec peu de lettres par tranche,
  l'analyse fréquentielle devient de la divination — voilà pourquoi le
  décodeur vous alerte et pourquoi un mot probable aide.
- **La variante se fond dans la foule.** Les textes du Beaufort variante
  sont exactement des textes de Vigenère à clé négée : un intercepteur
  ne peut même pas savoir lequel des deux vous avez utilisé — maigre
  consolation, puisque tous deux tombent sous la même attaque.
- **Les longues clés blessent.** Une clé aussi longue que le texte,
  utilisée une seule fois, atteint l'idéal du masque jetable — Beaufort
  hérite cette propriété de Vigenère.
