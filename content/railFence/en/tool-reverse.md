# How to decrypt the Rail fence cipher

To decrypt a Rail fence message you need two numbers: the rail count
and the starting rail. The tool draws an empty {{term:zigzag}} as long
as the ciphertext and counts how many letters land on each rail. Then
it cuts the ciphertext into rails of those lengths and reads the
zigzag again. A wrong setting keeps every letter but scrambles them.

## Using the decrypt tool

- Paste the ciphertext into {{control:message-input}}; the plaintext
  appears in {{control:output}}.
- Choose the rail count with {{control:rails-picker}}, from 2 to 10.
  The default is 3.
- Set the starting rail with {{control:offset-picker}}. The classic
  fence starts on the top rail, the default.
- Spaces, digits and punctuation are dropped. The plaintext comes out as
  one run of capitals, so add the word breaks yourself.
- To encrypt a reply, switch back with {{control:swap}}.

## A quick example

`ACDTAKTANTAW` on 3 rails gives `ATTACKATDAWN`. A 12-letter zigzag on 3
rails puts 3 letters on the top rail, 6 in the middle and 3 at the
bottom. So the ciphertext splits into `ACD`, `TAKTAN` and `TAW`, and
the zigzag picks one letter at a time from them.

A wrong setting gives the same letters in the wrong order. On 4 rails
the same ciphertext gives `ADTAATCANWTK`. On 3 rails starting at rail 1
it gives `TTAAKATCAWND`.

## No key?

- [Break a Rail fence cipher without the key](/encoder/railFence/cryptanalysis):
  slide through every rail count and offset until the text reads
- [How the Rail fence cipher works](/encoder/railFence/learn), rail by
  rail
- [The history of the Rail fence cipher](/encoder/railFence/history),
  from the scytale to the Civil War
- [Rail fence practice challenges](/encoder/railFence/practice) to
  decrypt
- [Identify an unknown cipher](/identify) if you are not sure it is a
  rail fence
