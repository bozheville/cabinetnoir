# VIC cipher: guides

## Guide 1 — encrypt your first message

1. Open the tool and type a message: `ATTACK AT DAWN. BY DAWN I MEAN
   0500.` The phrase, date, personal number and keygroup fields are
   the four secrets — fill them with the Wikipedia example: *Twas the
   night before Christmas*, `13/9/1959`, `6`, and roll a keygroup.
2. Turn on **Show the key workings**. Follow the schedule downward:
   the keygroup (A), the date digits (B), their no-borrow subtraction
   (C) — each tooltip names the operation.
3. Watch the checkerboard at the bottom: `A` sits under `5`, `T` under
   `9`, and the blanks under `6` and `8` label the straddled rows.
   Your message's digits are spelled by that board.
4. The output is five-figure groups with your keygroup hidden inside
   — count from the end to find it (the date's sixth digit says how
   far).

## Guide 2 — decrypt with the four secrets

1. Switch to decrypt mode and paste the groups. Three secrets are
   remembered (phrase, date, personal number); the keygroup is read
   from the message itself — watch the field fill itself in.
2. Decode, then trim the trailing `X`s: they are padding that pushed
   the digit count to a multiple of five.
3. Break it deliberately: change one secret digit and decode again.
   The output collapses into noise — every stage depends on every
   secret, which is the point of a product cipher.

## Guide 3 — design your own checkerboard

1. The board's top row is a mnemonic of your choosing: up to eight
   letters and two blanks. `AT ONE SIR` gives A, T, O, N, E, S, I, R —
   the most frequent English letters, one digit each.
2. The blanks decide everything below: their header digits become row
   labels, and the remaining letters plus the period and the shift
   sign fill two more rows.
3. Switch the alphabet to Cyrillic and the same machinery runs on
   Häyhänen's own board: `СНЕГОПА` — the start of *снегопад*,
   snowfall — with three blanks and three straddled rows.

## Guide 4 — the bisection, Kahn's extra lock

1. Turn on **Bisect the message** and set the cut at 20. Encrypt: the
   ciphertext changes completely, because the halves swapped places
   before a single digit was written.
2. Send the cut index to your recipient out of band — agreed in
   advance, like the other secrets. Without it, even the correct
   checkerboard reads the message inside out.
3. This was the historical system's optional final strengthening:
   cheap for the agent, devastating for the analyst, because it
   destroys the only remaining structure — the position of words
   within the message.
