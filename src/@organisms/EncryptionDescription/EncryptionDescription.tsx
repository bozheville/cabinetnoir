import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';

import Section from '@atoms/Section/Section';
import {
  AffineDescription,
  AlbertiDescription,
  AtbashDescription,
  CaesarDescription,
  MorseDescription,
  Rot13Description,
} from '@encryptors';

const EncryptorWrapper = styled(Section)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const EncryptionDescription: React.FC = () => {
  const router = useRouter();
  const { algorithm } = router.query;

  const DescriptionComponent =
    algorithm === 'affine' ? AffineDescription
    : algorithm === 'alberti' ? AlbertiDescription
    : algorithm === 'atbash' ? AtbashDescription
    : algorithm === 'caesar' ? CaesarDescription
    : algorithm === 'morse' ? MorseDescription
    : algorithm === 'rot13' ? Rot13Description
    : null

  return DescriptionComponent ? (
    <EncryptorWrapper stitch="both" color="description">
      <DescriptionComponent />
    </EncryptorWrapper>
  ) : null;
};

EncryptionDescription.displayName = 'EncryptionDescription';

export default EncryptionDescription;
