# History of the Columnar transposition cipher

## Older than its name

Rearranging letters by an agreed pattern is one of the oldest cryptographic
ideas — the Spartan scytale staff is a row-wise ribbon read column-wise,
a transposition in everything but the vocabulary. The columnar form,
keyed by a word, appears in the seventeenth-century literature and
settled into every major cipher manual by the nineteenth century. It
needed no equipment, no tables and no arithmetic: a sheet of paper and
one memorable word.

## The First World War: the field workhorse

Trench warfare produced mountains of messages that had to be encrypted
quickly by exhausted signallers. Substitution ciphers were vulnerable
to frequency counting; machine ciphers did not exist at the front.
Columnar transposition — usually applied **twice** with two keywords —
became the standard field cipher of several armies, including the
German one. The French, reading German traffic, learned to attack the
double transposition by anagramming: sliding suspected column fragments
together until sentences appeared. Whole sections of army cryptanalysis
were, in effect, professional jigsaw departments.

## ADFGVX, 1918: transposition as the second lock

The most sophisticated German field cipher of the war, ADFGVX, chained
two ideas: fractionation (each plaintext letter becomes two coordinate
letters) and a keyed columnar transposition over the result. The
transposition was there precisely to destroy the frequencies the
fractionated coordinates would otherwise show — and Georges Painvin's
breakthrough was to undo the {{term:column-order}} first, on traffic
volume, before attacking what remained. The ADFGVX pages in this app
tell that story in full; its cracker's second stage is the same
column-rebuilding you do here.

## The SOE and the poem ciphers

In the Second World War, agents of Britain's Special Operations
Executive behind enemy lines encrypted reports with double
transposition — it survived on paper where machines could not. Leo
Marks, the SOE's cryptographer, gave agents keys they would never
forget by writing them as original poems ("The Life That I Have"),
memorised rather than carried. A poem in the head, a grid on a scrap of
paper: the columnar transposition worked precisely because its key
lives in human memory, not in a device that can be captured.

## Still a teacher

Columnar transposition never protected anything against a professional
with enough traffic — and was never meant to. It survives as the
clearest demonstration that *hiding order* is a different problem from
*hiding letters*, and as the standard first chapter of every
transposition lesson: the grid is the cipher, and the key is the way
you read it.

{{timeline:columnar}}
