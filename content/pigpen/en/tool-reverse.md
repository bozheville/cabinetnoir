# How to decrypt the Pigpen cipher

To decrypt Pigpen you only need to know which symbol set the message
uses. There is no key: each glyph stands for one fixed letter, so you
match the shapes one by one. Read with the wrong set, the same glyphs
turn into other letters.

## Using the decrypt tool

- Pick the sender's symbol set with {{control:variant-selector}}. The
  key figure and the glyph sheet below it change to match.
- Click the symbols of the message in order on
  {{control:glyph-keyboard}}. The keys show only the drawings, in
  alphabet order, so you read by shape as on paper.
- Each click adds a letter to {{control:message-input}}. "Delete"
  removes the last one, and the eraser clears the message.
- You can also type the letters straight into
  {{control:message-input}}. Spaces, digits and punctuation pass
  through unchanged.
- Read the message in capitals in {{control:output}}.
- To draw a reply, switch back with {{control:swap}}.

## A quick example

Take the 3 masonic glyphs for `SOS`: a V-shape, an open box with a dot
inside, and the V-shape again. Click those 3 keys, and
{{control:output}} shows `SOS`.

The symbol set matters. In the Templar set the same V-shape means A,
not S. Pick the wrong set and the message comes out with the wrong
letters, or with symbols you cannot find on the keyboard at all.

## Not sure it is Pigpen?

There is no key to find. Once you know the symbol set, the message is
read.

- [Identify an unknown cipher](/identify) if the symbols might come
  from another system
- [How the Pigpen cipher works](/encoder/pigpen/learn): the grids, the
  X shapes and the dots
- [The history of Pigpen](/encoder/pigpen/history), from Agrippa to
  Masonic gravestones
- [Pigpen practice challenges](/encoder/pigpen/practice) to decrypt
