import React, {useState} from 'react';
import styled from 'styled-components';

import Section from '@atoms/Section/Section';
import { EncryptionInputs, EncryptionSettings, EncryptionDescription } from '@organisms';

const EncryptorSection = styled(Section)`
  flex: 1 0 auto;
`;

const EncryptorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colorScheme.blue_green[500]};

  box-shadow: 0px 0px 0px 1px ${({ theme }) => theme.colorScheme.blue_green[200]};;
  margin: 24px auto;
  background-color: ${({ theme }) => theme.colorScheme.orange[50]};
  overflow: hidden;
  border-radius: 8px;

  ${({ theme }) => theme.breakpoints.small} {
    margin: 4px;
  }

  ${({ theme }) => theme.breakpoints.desktop} {
    max-width: 1016px;
  }
`;

const Encryptor: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  return (
    <>
      <EncryptorSection stitch="both" color="encryptor">
        <EncryptorWrapper>
          <EncryptionSettings
            input={input}
            onOutputUpdate={({ output }) => {
              setOutput(output);
            }}
          />
          <EncryptionInputs
            onChange={setInput}
            output={output}
          />
        </EncryptorWrapper>
      </EncryptorSection>
      <EncryptionDescription />
    </>
  );
};

Encryptor.displayName = 'Encryptor';

export default Encryptor;
