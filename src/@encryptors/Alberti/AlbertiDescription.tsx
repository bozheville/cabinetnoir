import React from 'react';
import Image from 'next/image'
import { BodyCopy, DoublePica } from '@typography';
import { Pane } from 'evergreen-ui';

const AlbertiDescription: React.FC = () => (
    <div>
      <Pane display="flex" flexDirection="row">
        <Pane display="flex" flexDirection="column" maxWidth="75%">
          <BodyCopy>
            See more info on:{' '}
              <a href="https://en.wikipedia.org/wiki/Alberti_cipher" target="_blank">
              https://en.wikipedia.org/wiki/Alberti_cipher
              </a>
            </BodyCopy>
            <BodyCopy>Alberti's cipher disk embodies the first example of polyalphabetic substitution with mixed alphabets and variable period. This device, called Formula, was made up of two concentric disks, attached by a common pin, which could rotate one with respect to the other.[3] The larger one is called Stabilis [stationary or fixed], the smaller one is called Mobilis [movable]. The circumference of each disk is divided into 24 equal cells. The outer ring contains one uppercase alphabet for plaintext and the inner ring has a lowercase mixed alphabet for ciphertext. The outer ring also includes the numbers 1 to 4 for the superencipherment of a codebook containing 336 phrases with assigned numerical values. </BodyCopy>
        </Pane>
        <Image
          src="/images/alberti.svg"
          alt="Picture of the author"
          width={500}
          height={500}
        />
      </Pane>
      <DoublePica>
        Step-by-step example:
      </DoublePica>
      <BodyCopy>
        1. Set initial encryption parameters: A -> q, incrementing step 3, encryption period: 2. And the message to encrypt would be SECRETNOTE
      </BodyCopy>
      <BodyCopy>
        2. S becomes t; E becomes d. The period of 2 characters is completed. Rotating the disc by three characters, so A -> f
      </BodyCopy>
      <BodyCopy>
        3. C becomes b; R becomes z. The period of 2 characters is completed. Rotating the disc by three characters, so A -> a
      </BodyCopy>
      <BodyCopy>
        4. E becomes k; T becomes o. The period of 2 characters is completed. Rotating the disc by three characters, so A -> g
      </BodyCopy>
      <BodyCopy>
        4. N becomes x; O becomes y. The period of 2 characters is completed. Rotating the disc by three characters, so A -> n
      </BodyCopy>
      <BodyCopy>
        4. T becomes d; E becomes u. The encryption is done
      </BodyCopy>
      <BodyCopy>
        The resulting encrypted message is "tdbzkoxydu".
      </BodyCopy>
    </div>
  );

AlbertiDescription.displayName = 'AlbertiDescription';

export default AlbertiDescription;
