# Breaking the VIC cipher

Nobody ever broke the VIC cipher by codebreaking. The message from the
hollow nickel stayed unread from 1953 to 1957. The FBI read it only
after Reino Häyhänen, the spy it was written for, defected and handed
over his keys. This page explains why the experts failed, and what an
attack would cost today.

{{challenge:vic-easy-1}}

## Why the FBI and NSA could not read it

Codebreakers look for patterns: a key that repeats, a grid of a fixed
size, letters that appear too often. The VIC cipher was designed to
leave none of them.

1. **The key never repeats.** Every message has its own keygroup, and
   the whole key grows out of it. So two messages never share a key,
   and there is nothing to line up and compare.
2. **Letters hide inside digits.** The checkerboard gives common
   letters one digit and rare letters two. The cipher text is just a
   stream of digits, so you cannot count letters the usual way.
3. **Several locks in a row.** After the checkerboard come two
   transpositions, the second one with traps. Their widths come from
   secrets the attacker does not have. Opening one lock still leaves
   the message sealed.
4. **One message, no method.** In 1953 the FBI had a single message
   and no idea how the system worked. Every classical attack needs
   more than that.

David Kahn summed it up in 1961: the cipher is not unbreakable in
theory, but it is "effectually unbreakable without prior knowledge of
the system and on the basis of a single message".

## How it was finally read

It took a person, not a formula. In May 1957 Häyhänen was ordered back
to Moscow. Instead, he went to the US embassy in Paris and asked for
asylum. He explained the system to the FBI and gave them his phrase,
date and personal number. With those, the nickel message opened in a
few weeks.

He also led the FBI to his boss, Rudolf Abel, who was arrested in New
York in June 1957. The strongest cipher of its day fell to the oldest
weakness there is: the people who use it.

## What an attack would cost today

Suppose you know exactly how the VIC cipher works. You still need the
secrets. Most of them flow into one 10-digit worksheet line, line H.
Add the date's sixth digit and the personal number, and the key is
worth about 38 bits. That is roughly 300 billion options.

A modern computer can try them all in less than a day. So VIC is not
secure against computers. But that attack needs three things nobody
had in 1953: knowledge of the method, a clean ciphertext and a lot of
computing power. Against a person with pencil and paper, VIC held.

## Why this site has no VIC cracker

Every cracker on this site follows a weakness: a key that repeats, a
fixed grid, a letter that cannot map to itself. The VIC cipher has no
such weakness to follow, so a step-by-step cracker would have nothing
to show.

Instead, turn on **Show the key workings** in the
[VIC cipher tool](/encoder/vic/direct). You will see every step the
FBI could not reverse, one line at a time.

## In short

The VIC cipher was the high point of hand ciphers. It mixed a
substitution, two transpositions and a fresh key for every message.
Nobody cracked it in its time. It was read only because a defector
handed over the keys.
