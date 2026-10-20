# Columnar transposition: guides

## Guide 1 — your first transposition

1. Open the tool and type the keyword `SUN`. The grid shows the
   {{term:column-order}} as numbered badges: 1 under the column the
   keyword reads first.
2. Type `MEET ME AT NOON` and compare with the grid: the ciphertext is
   exactly the same letters, read down the columns in badge order.
3. Switch to decrypt mode and paste the cryptogram back — it returns
   unchanged. Transposition undoes itself when you know the reading
   order.

## Guide 2 — padded or irregular

1. Encrypt a message whose length does not divide evenly by the keyword
   length — say 13 letters under `SUN` (3 columns).
2. Encrypt once with "Leave the last row incomplete" on and once off.
   With padding, the ciphertext length is a multiple of 3; without, it
   is 13 — the grid shape itself leaks or hides information.
3. Count how many candidate widths divide the padded length: each
   divisor is a hypothesis a codebreaker must try. Irregular grids cut
   that list down.

## Guide 3 — double transposition

1. Tick "Double transposition" and add a second keyword, say `WOLF`.
2. Encrypt the same message with and without the second keyword and
   compare the two cryptograms: the double one has no readable column
   fragments left — the very fragments the single cipher leaks.
3. This is why armies doubled the transposition, and why the guided
   cracker in this app sticks to the single version.
