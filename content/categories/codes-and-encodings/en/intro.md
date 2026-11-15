## What unites the family

Codes and encodings turn text into another alphabet by a public rule. There is no key: anyone who knows the table can read the message, so this is {{term:encoding}}, not encryption. The goal is to carry text through a channel that cannot take letters as they are, such as a telegraph wire or an old email system.

## How it works

[Morse code](/encoder/morse/learn) gives every letter a pattern of short and long signals: SOS is three dots, three dashes, three dots. Frequent letters get short patterns, so E is a single dot and T a single dash, which made hand sending fast. [Base64](/encoder/base64/learn) cuts data into 6-bit pieces and writes each one as one of 64 safe characters; the word Hi becomes SGk=, with an equals sign as padding at the end.

The Baconian cipher, writing each letter as five A or B symbols, and the tap code, knocking out row and column, are coming soon.

## How it is broken

Nothing has to be broken: you look the symbols up. The real skill is recognition. A text made only of dots, dashes and spaces is Morse; a string of letters, digits, plus signs and slashes whose length is a multiple of four, often ending in = or ==, is almost certainly Base64. The identifier in the cabinet spots both at once. An encoding can still hide a real cipher underneath, so decode first and then look at what comes out.

## History

On 24 May 1844 Samuel Morse sent "What hath God wrought" over a telegraph line from Washington to Baltimore. Base64 took its modern form in the MIME email standards of 1992 to 1996, so that mail written for plain text could carry pictures and files.
