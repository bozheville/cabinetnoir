# Percer le chiffre autokey

Le chiffre autokey n'a aucune {{term:key}} répétée à trouver — l'attaque
de Vigenère n'y attrape rien. Mais il a une couture plus faible : la clé
*est* le texte clair. Cette page explique l'attaque par glissement de
{{term:crib}} ; chaque étape a son pendant dans le décodeur guidé de
l'outil, pour suivre la lecture en direct.

{{challenge:autokey-demo}}

## Pourquoi l'attaque classique échoue

La périodicité a disparu. Le flux de clé étant « amorce puis texte
clair », deux lettres identiques du texte clair ne se chiffrent presque
jamais deux fois de la même façon ; les séquences répétées se tarissent
et l'analyse fréquentielle par tranches n'a plus de tranches où mordre.
L'examen de Kasiski comme l'{{term:index-of-coincidence}} reviennent
vides.

## La couture : la clé est le message

Chaque lettre du flux de clé (après l'amorce) est une lettre du texte
clair datant d'une longueur d'amorce plus tôt. Un mot deviné du texte
clair fait donc double service :

1. **Faites glisser le mot.** Placez votre devinette à chaque position
   du {{term:ciphertext}}. À la position *p*, la devinette implique des
   lettres de clé K = C − devinette — et dans l'autokey ces lettres de
   clé *sont* du texte clair d'une longueur d'amorce plus tôt. Un
   placement faux produit de la soupe alphabétique ; le bon produit de
   l'anglais lisible.
2. **Déroulez.** Une fois le placement juste, les lettres connues du
   texte clair se propagent seules : une lettre récupérée en position
   *p* devient la clé en *p + L* (révélant le texte clair là), et la
   lettre en *p − L* se révèle pareillement en arrière. Quelques
   passages, et les chaînes couvrent tout ce que les classes de position
   du mot probable touchent.
3. **Lisez l'amorce.** Les premières *L* lettres du flux de clé sont
   l'amorce : K(i) = C(i) − P(i) pour chacune. Là où la devinette
   n'est jamais arrivée, les lettres d'amorce restent blanches — la
   dernière étape de l'assistant, c'est vous qui les tapez à la main,
   d'après ce qui ressemble à de l'anglais.

Rien là-dedans n'exige de statistiques. Un mot deviné, une règle de
soustraction, et le chiffre fait le reste de la démolition lui-même.

## Les limites

- **La devinette est toute la partie.** Si le texte clair ne contient
  aucun mot devinable, l'attaque cale — aucune machinerie de classement
  ne sauvera un mot probable faux.
- **Les amorces courtes sont fragiles.** Une amorce de 1 à 3 lettres
  frôle le César à étages ; les chaînes déroulées couvrent presque tout
  d'un coup.
- **Les longues amorces se prennent pour un masque jetable.** Une
  amorce aussi longue que le message ne réutilise jamais rien —
  incassable, comme toute clé utilisée une seule fois. La faiblesse de
  l'autokey n'existe que parce que l'amorce est courte.
