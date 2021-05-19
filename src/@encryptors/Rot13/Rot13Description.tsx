import React from 'react';

const Rot13Description: React.FC = () => {
  return (
    <div>
      <p>
        <em>
          Extracted from{' '}
          <a href="https://en.wikipedia.org/wiki/ROT13" target="_blank">
            Wikipedia
          </a>
        </em>
      </p>
      <p>
        ROT13 ("rotate by 13 places", sometimes hyphenated ROT-13) is a simple letter substitution cipher[1]that replaces a letter with the 13th letter after it in the alphabet. ROT13 is a special case of the Caesar cipher which was developed in ancient Rome.
      </p>
      <p>
        Because there are 26 letters (2×13) in the basic Latin alphabet, ROT13 is its own inverse; that is, to undo ROT13, the same algorithm is applied, so the same action can be used for encoding and decoding. The algorithm provides virtually no cryptographic security, and is often cited as a canonical example of weak encryption.
      </p>
      <p>
        ROT13 is used in online forums as a means of hiding spoilers, punchlines, puzzle solutions, and offensive materials from the casual glance. ROT13 has inspired a variety of letter and word games online, and is frequently mentioned in newsgroup conversations.
      </p>
      <p>[1] - There is no additional key needed to invert the substitution, so basically, it's encoding, not cipher. <em>Denys Grybov, CN developer</em></p>
    </div>
  );
};

Rot13Description.displayName = 'Rot13Description';

export default Rot13Description;
