# History of Base64

## The problem: email could not carry bytes

Electronic mail in the 1980s assumed the text of the oldest
protocols: lines of printable characters, no bytes above 127, no
raw binary. Attachments — images, executables, archives — simply
could not travel. The fix had to speak the channel's language:
rewrite every byte as printable text.

## MIME gives the answer (1992–1996)

Nathaniel Borenstein's MIME standard — designed so email could carry
rich content — defined a family of "content-transfer encodings" and
chose 64 characters as the sweet spot: large enough to keep the
overhead low, small enough to dodge every character that gateways
mangled. The 1996 MIME specification (RFC 2045) fixed the exact
alphabet, and Base64 attachments began flooding inboxes.

## From email to everywhere

Once standardised, Base64 escaped the mailbox. Data URLs embed
images in stylesheets; JWT tokens carry their JSON payloads as
Base64 sections; databases, logs and APIs store binary blobs as
text. RFC 4648 (2006) consolidated the family of base encodings and
formalised the variants — including the URL-safe cousin that swaps
`+` and `/` for `-` and `_`.

## The lesson that stuck with it

Every generation rediscovers the same mistake: seeing Base64 output
and calling it encryption. It is a courier uniform, not body
armour — the encoding exists so data survives the journey, and it
undoes itself just as easily on arrival. This site keeps it in the
company of real ciphers precisely so the difference is impossible to
miss.

{{timeline:base64}}
