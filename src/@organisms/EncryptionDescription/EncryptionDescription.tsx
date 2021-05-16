import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';

import {
  CaesarDescription,
} from '@encryptors';

const EncryptorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  padding: 0;
  border; 1px solid #aaa;
  border-radius: 8px;
  box-shadow: 0px 2px 4px 0px #999;
  margin: 24px;
  background-color: #fff;
  overflow: hidden;
  padding: 16px;

  ${({ theme }) => theme.breakpoints.small} {
    margin: 24px 4px 4px 4px;
  }
`;

const EncryptionDescription: React.FC = () => {
  const router = useRouter();
  const { algorithm } = router.query;

  const DescriptionComponent =
    algorithm === 'caesar' ? CaesarDescription
    : algorithm === 'morse' ? MorseDescription
    : null

  return DescriptionComponent ? (
    <EncryptorWrapper><DescriptionComponent /></EncryptorWrapper>
  ) : null;
};

EncryptionDescription.displayName = 'EncryptionDescription';

export default EncryptionDescription;
