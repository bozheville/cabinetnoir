# Briser le chiffre affine

Le chiffre affine est une {{term:substitution}} monoalphabétique avec
un squelette mathématique — et c'est précisément ce squelette qui le
trahit. Deux lettres connues effondrent toute la clé. Cette page
montre les deux routes.

{{challenge:affine-demo}}

## La faiblesse : une droite laisse une trace

Deux paramètres, une règle linéaire : `y = (a·x + b) mod 26`. Chaque
paire de la clé appartient à la même droite. Deux points déterminent
une droite — deux paires de lettres connues déterminent donc la clé.

## Attaque 1 — deux lettres connues suffisent

1. Devinez ou obtenez deux paires clair → chiffré, disons `x₁ → y₁`
   et `x₂ → y₂`.
2. Soustrayez : `y₁ − y₂ ≡ a·(x₁ − x₂) (mod 26)`. Divisez par
   `x₁ − x₂` — dans l'{{term:modular-arithmetic}}, diviser revient à
   multiplier par l'inverse modulaire — pour retrouver `a`.
3. Remplacez en arrière pour retrouver `b`.
4. Saisissez la clé et déchiffrez. Les {{term:crib}} — mots connus en
   tête de message — offrent les paires gratuitement.

## Attaque 2 — l'analyse fréquentielle, comme toujours

Sans lettres connues, le chiffre reste une {{term:substitution}}
fixe : la lettre chiffrée la plus fréquente correspond à E, la
suivante à T ou A, et chaque correspondance devinée est une
hypothèse sur `(a, b)` à tester sur les lettres suivantes. Rien à
trouver comme période, aucune structure au-delà de la correspondance
elle-même — l'{{term:frequency-analysis}} fonctionne exactement comme
contre César, seuls les alphabets candidats sont moins réguliers.

## Pourquoi la règle de co-primauté compte

Le multiplicateur doit être premier avec 26 — sinon deux lettres du
texte clair se confondent en une seule lettre chiffrée et le message
ne peut plus être déchiffré de façon unique. Cette exigence réduit de
moitié l'espace de clés à 312 combinaisons, et elle est la première
rencontre d'un débutant avec l'idée qui porte la cryptographie
moderne : l'inversibilité dans l'arithmétique modulaire.

## De César à l'affine à RSA

Le décalage de César est le chiffre affine avec `a` = 1. L'affine
ajoute une multiplication, et avec elle la notion d'inverse
modulaire. Montez d'un cran — l'exponentiation à la place de la
multiplication — et vous atteignez les mathématiques à clé publique
de RSA. Le chiffre-jouet et le système bancaire partagent une même
grammaire.
