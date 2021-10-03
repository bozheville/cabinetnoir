import React from 'react';
import { BodyCopy } from '@typography';

const AtbashDescription: React.FC = () => {
  return (
    <div>
      <BodyCopy>
      See more info on:{' '}
        <a href="https://en.wikipedia.org/wiki/Atbash" target="_blank">
          https://en.wikipedia.org/wiki/Atbash
        </a>
      </BodyCopy>
      <BodyCopy>
        Atbash (Hebrew: אתבש‎; also transliterated Atbaš) is a monoalphabetic
        substitution cipher originally used to encrypt the Hebrew alphabet.
        It can be modified for use with any known writing system with
        a standard collating order.
      </BodyCopy>
    </div>
  );
};

AtbashDescription.displayName = 'AtbashDescription';

export default AtbashDescription;
