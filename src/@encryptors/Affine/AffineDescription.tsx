import { BodyCopy } from '@typography';
import React from 'react';

const CaesarDescription: React.FC = () => {
  return (
    <div>
      <BodyCopy>
        See more info on:{' '}
        <a href="https://en.wikipedia.org/wiki/Affine_cipher" target="_blank">
          https://en.wikipedia.org/wiki/Affine_cipher
        </a>
      </BodyCopy>
      <BodyCopy>
        The affine cipher is a type of monoalphabetic substitution cipher,
        where each letter in an alphabet is mapped to its numeric equivalent,
        encrypted using a simple mathematical function, and converted back to a letter.
        The formula used means that each letter encrypts to one other letter,
        and back again, meaning the cipher is essentially a standard substitution
        cipher with a rule governing which letter goes to which. As such, it has the
        weaknesses of all substitution ciphers. Each letter is enciphered with the
        function (ax + b) mod 26, where b is the magnitude of the shift.
      </BodyCopy>
    </div>
  );
};

CaesarDescription.displayName = 'CaesarDescription';

export default CaesarDescription;
