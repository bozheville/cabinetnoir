import React from 'react';
import { BodyCopy } from '@typography';

const AlbertiDescription: React.FC = () => (
    <div>
      <BodyCopy>
      See more info on:{' '}
        <a href="https://en.wikipedia.org/wiki/Alberti_cipher" target="_blank">
        https://en.wikipedia.org/wiki/Alberti_cipher
        </a>
      </BodyCopy>
      <BodyCopy>Alberti's cipher disk embodies the first example of polyalphabetic substitution with mixed alphabets and variable period. This device, called Formula, was made up of two concentric disks, attached by a common pin, which could rotate one with respect to the other.[3] The larger one is called Stabilis [stationary or fixed], the smaller one is called Mobilis [movable]. The circumference of each disk is divided into 24 equal cells. The outer ring contains one uppercase alphabet for plaintext and the inner ring has a lowercase mixed alphabet for ciphertext. The outer ring also includes the numbers 1 to 4 for the superencipherment of a codebook containing 336 phrases with assigned numerical values. </BodyCopy>
    </div>
  );

AlbertiDescription.displayName = 'AlbertiDescription';

export default AlbertiDescription;
